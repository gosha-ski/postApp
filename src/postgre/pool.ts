import {Pool} from "pg"

export const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "june_twenty",
	password: " ",
	port: 5432
})

