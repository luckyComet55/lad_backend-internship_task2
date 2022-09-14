import {DataBaseSource} from "./data-source.js";
import {DataSource} from "typeorm";
import {Fact} from "./entity/Fact.js";

export class DataBase {
    private _dbconn: DataSource

    constructor() {
        (async () => {
            this._dbconn = await DataBaseSource.initialize();
            await this._dbconn.manager.save([this._dbconn.manager.create(Fact, {
                f_id: 1,
                f_cont: "I like books",
                f_dob: "2022-09-14 13:12"
            }),
            this._dbconn.manager.create(Fact, {
                f_id: 2,
                f_cont: "I like programming",
                f_dob: "2022-09-11 12:11"
            }),
            this._dbconn.manager.create(Fact, {
                f_id: 3,
                f_cont: "Ah yes, JavaScript",
                f_dob: "2022-09-11 11:10"
            })])
        })();
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