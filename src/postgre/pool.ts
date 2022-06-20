import {Pool} from "pg"

export const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "june_twenty",
	password: " ",
	port: 5432
})

async function f(){
	const res = (await pool.query(`SELECT id, password, email FROM users`)).rows
	// for(let key in res){
	// 	console.log(key)
	// }
	console.log(res)
}

//f()