import { Server } from "@hapi/hapi";
import { HapiServerConnectionError } from "../common/index.js";
import { connect2Nats, closeNats } from "../common/index.js";
import { getRoute } from "./handlers/api.js";
import { stopRoute } from "./handlers/dev-stop.js";

async function createServer(): Promise<Server> {
    let server: Server = new Server({
        host: "localhost",
        port: "8080"
    });
    // @ts-ignore
    server.app.natsConn = await connect2Nats();
    server.event("stop-debug");
    // @ts-ignore
    server.events.on("stop-debug", async () => {
        // @ts-ignore
        await closeNats(server.app.natsConn);
        await server.stop();
        console.log("Server stopped successfully");
    })

    server.route([
        getRoute,
        stopRoute
    ])

    try {
        await server.start();
    } catch (err) {
        throw new HapiServerConnectionError(err);
    }
    return server;
}

async function runServer():  Promise<any> {
    try {
        const server: Server = await createServer();
        console.log("Server started!");
        // @ts-ignore
        console.log(`Connected to ${server.app.natsConn.getServer()} NATS server`);
    } catch (err) {
        console.log(`The ${err.constructor.name} has occurred`);
        console.error(err);
    }
}

(async () => await runServer())()
