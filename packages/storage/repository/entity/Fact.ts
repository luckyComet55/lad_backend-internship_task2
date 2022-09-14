import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity({ name: "testData" , schema: "public"})
export class Fact {
    @PrimaryColumn()
    f_id: number

    @Column("text")
    f_cont: string

    @Column("timestamptz")
    f_dob: string
}