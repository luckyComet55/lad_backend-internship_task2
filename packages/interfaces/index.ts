export interface basicRoute {
    method: "GET" | "POST",
    path: string,
    handler: Function
}

export interface basicServer {
    host: string,
    port: string | number
}