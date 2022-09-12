import { basicRoute } from "../../interfaces/index.js";
import { Request, ResponseToolkit } from "hapi__hapi";
import { StringCodec } from "nats";

async function natsPublisher(request: Request, h: ResponseToolkit): Promise<any> {
    const sc = StringCodec();
    // @ts-ignore
    const nc = request.server.app.natsConn;
    nc.publish("storage.api.request.find", sc.encode("f_id:2"));
    return {
        status: 200,
        result: "OK",
        message: "Successful publication"
    }
}

export const getRoute: basicRoute = {
    method: "GET",
    path: "/api/test",
    handler: natsPublisher
}
