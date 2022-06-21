import * as jwt from "jsonwebtoken"
import * as express from "express"
import {pool} from "../postgre/pool"

export async function authenticationMiddleware(request, response, next){
	try{
		const cookie = request.cookies.Authentication
		const data = jwt.verify(cookie, process.env.JWT_KEY)
		const user = (await pool.query(`SELECT * FROM users WHERE id = '${data.id}'`)).rows[0]
		if(user){
			request.user = {
				id: user.id,
				email: user.email,
				nickname: user.nickname
			}
			next()
		}else{
			response.send("jwt expired")
		}

	}catch(error){
		response.send(error)
	}
}