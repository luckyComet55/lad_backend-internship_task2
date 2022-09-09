import { basicRoute } from "../../interfaces/index.js";
import { Request, ResponseToolkit } from "hapi__hapi";

async function stopServerPleasantly(request: Request, h: ResponseToolkit): Promise<any> {
    setTimeout(() => {
        request.server.events.emit("stop-debug");
    }, 1000);
    return {
        status: 202,
        result: "Accepted",
        message: "Server stopped"
    }
}

export const stopRoute: basicRoute = {
    method: "POST",
    path: "/api/stop-debug",
    handler: stopServerPleasantly
}