import { basicRoute } from "../../interfaces/index.js";
import { Request, ResponseToolkit, ResponseObject } from "hapi__hapi";
import { NatsConnection } from "nats";

async function natsPublisher(request: Request, h: ResponseToolkit): Promise<any> {
    // @ts-ignore
    const nc = request.server.app.natsConn;
    console.log(nc);
    return {
        status: 204,
        result: "No Content",
        message: "Successive request"
    }
}

export const getRoute: basicRoute = {
    method: "GET",
    path: "/api/test",
    handler: natsPublisher
}
