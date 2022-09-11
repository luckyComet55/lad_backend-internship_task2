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

DataBaseSource.initialize()
    .then(async () => {
        DataBaseSource.manager.findOneBy(Fact, {
            f_id: 1
        }).then((res) => {
            console.log("Successfully found fact with f_id = 1: ");
            console.log(res);
        }).catch(err => {
            console.log("An error occurred: " + err);
        }).finally(() => console.log("End of query"));

    })
    .catch(err => console.error(err))