import { Server } from "@hapi/hapi";
import { StringCodec } from "nats";
import { connect2Nats, closeNats } from "../common/index.js";
import { HapiServerConnectionError } from "../common/index.js";
import { stopRoute } from "./handlers/dev-stop.js";

async function createServer(): Promise<Server> {
    const server: Server = new Server({
        host: "localhost",
        port: "8090"
    })

    server.route([
        stopRoute
    ]);

    // @ts-ignore
    server.app.natsConn = await connect2Nats();
    server.event("stop-debug");
    // @ts-ignore
    server.events.on("stop-debug", async () => {
        // @ts-ignore
        await closeNats(server.app.natsConn);
        await server.stop();
        console.log("Server successfully stopped!");
    })

    try {
        await server.start();
    } catch (err) {
        throw new HapiServerConnectionError();
    }

    return server;
}

async function runServer() {
    try {
        const server: Server = await createServer();
        console.log("Server started!");
        // @ts-ignore
        console.log(`Connected to ${server.app.natsConn.getServer()} NATS server`);
        console.log("Storage microservice up and running!");
        // @ts-ignore
        const nc = server.app.natsConn;
        const sc = StringCodec();
        const sub = nc.subscribe("tastefulMessage");
        for await (const m of sub) {
            console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
        }
        console.log("Subscription closed");
    } catch (err) {
        console.log(`The ${err.constructor.name} has occurred`);
        console.error(err);
    }
}

(async () => await runServer())()
