import { DataSource } from "typeorm";
import { Fact } from "./entity/Fact.js";
import {deflateRaw} from "zlib";

export const DataBaseSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "",
    database: "storage",
    entities: [Fact]
})
