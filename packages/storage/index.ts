import { Server } from "@hapi/hapi";
import { StringCodec } from "nats";
import { connect2Nats, closeNats } from "../common/index.js";
import { HapiServerConnectionError } from "../common/index.js";
import { stopRoute } from "./handlers/dev-stop.js";
import { DataBase } from "./repository/dbconn.js";
import { Fact } from "./repository/entity/Fact.js";

function validateData(data: string): boolean {
    const dataSchema = /^f_(?<colName>id|cont):(?<colData>[^]*)$/;
    const parsedData = data.match(dataSchema);
    if(parsedData === null || parsedData.groups === undefined) return false;
    if(parsedData.groups.colName === "id") {
        return /\d+/.test(parsedData.groups.colData);
    }
    return true;
}

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
        const dataBase = new DataBase();
        console.log("Server started!");
        // @ts-ignore
        console.log(`Connected to ${server.app.natsConn.getServer()} NATS server`);
        console.log("Storage microservice up and running!");
        // @ts-ignore
        const nc = server.app.natsConn;
        const sc = StringCodec();
        const sub = nc.subscribe("storage.api.request.find");
        for await (const m of sub) {
            console.log(`[${sub.getProcessed()}]${m.subject.split(".")[3]}: ${sc.decode(m.data).split(":")}`);
            const data = sc.decode(m.data);
            if(!validateData(data)) continue;
            const [key, val] = data.split(":");
            const dbQueryRes: Fact | null = await dataBase.find(key, val);
            if(dbQueryRes === null) {
                console.log("Query returned nothing");
            } else {
                console.log(`<${dbQueryRes.f_dob}> [${dbQueryRes.f_id}]: "${dbQueryRes.f_cont}"`);
            }
        }
        console.log("Subscription closed");
        await dataBase.close();
        console.log("Connection with database closed");
    } catch (err) {
        console.log(`The ${err.constructor.name} has occurred`);
        console.error(err);
    }
}

(async () => await runServer())()
