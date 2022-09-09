import {connect, ConnectionOptions, NatsConnection} from "nats";

export class HapiServerConnectionError extends Error {}
export class NatsServerConnectionError extends Error {}
export class NatsClosureError extends Error {}

export async function connect2Nats(): Promise<NatsConnection> {
    const serverOptions: ConnectionOptions = {
        servers: "localhost:4222",
    }

    try {
        return await connect(serverOptions);
    } catch (err) {
        throw new NatsServerConnectionError(err);
    }
}

export async function closeNats(nc: NatsConnection): Promise<void | Error> {
    const done = nc.closed();
    await nc.drain();
    const err = await done;
    if(err) {
        throw new NatsClosureError();
    }
    return done;
}