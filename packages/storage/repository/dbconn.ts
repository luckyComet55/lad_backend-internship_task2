import {DataBaseSource} from "./data-source.js";
import {DataSource} from "typeorm";
import {Fact} from "./entity/Fact.js";

export class DataBase {
    private _dbconn: DataSource

    constructor() {
        (async () => this._dbconn = await DataBaseSource.initialize())();
    }

    public async find(col: string, val: string): Promise<Fact | null> {
        return await this._dbconn.manager.findOneBy(Fact, {
            [col]: val
        });
    }

    public async close() {
        return await this._dbconn.destroy();
    }

}