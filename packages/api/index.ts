import {Server, ServerOptions} from "@hapi/hapi";
import {connect, ConnectionOptions, NatsConnection} from "nats";
import {HapiServerConnectionError, NatsServerConnectionError, NatsClosureError} from "../common/index.js";
import { getRoute } from "./handlers/api.js";
import { stopRoute } from "./handlers/dev-stop.js";

async function createServer(): Promise<Server> {
    const serverOptions: ServerOptions = {
        host: "localhost",
        port: "8080"
    }
    let server: Server = new Server(serverOptions);
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
    } catch (err: any) {
        throw new HapiServerConnectionError(err);
    }
    return server;
}

async function connect2Nats(): Promise<NatsConnection> {
    const serverOptions: ConnectionOptions = {
        servers: "localhost:4222",
    }

    try {
        return await connect(serverOptions);
    } catch (err) {
        throw new NatsServerConnectionError(err);
    }
}

async function closeNats(nc: NatsConnection): Promise<void | Error> {
    const done = nc.closed();
    await nc.close();
    const err = await done;
    if(err) {
        throw new NatsClosureError();
    }
    return done;
}

async function runServer():  Promise<any> {
    try {
        const server: Server = await createServer();
        console.log("Server started!");
    } catch (err) {
        console.log(`The ${err.constructor.name} has occurred`);
        console.error(err);
    }
}

(async () => await runServer())()
