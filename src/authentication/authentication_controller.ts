import {Router, Response, Request} from "express"
import * as bodyParser from "body-parser"
import {pool} from "../postgre/pool"
import * as uniqid from "uniqid"
import * as jwt from "jsonwebtoken"

export class AuthenticationController{
	path: string = "/authentication"
	router = Router()

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.post(`${this.path}/login`, this.login)
		this.router.post(`${this.path}/register`, this.register)
	}

	private login = async(request: Request, response: Response)=>{
		try{
			const incomingData = request.body
			let user = (await pool.query(`SELECT * FROM users WHERE email = '${incomingData.email}'`)).rows[0]
			if(user){
				if(user.password == incomingData.password){
					let token = this.createToken({id: user.id})
					response.cookie("Authentication", token)
					response.status(200).send("success sign in")
				}else{
					response.send("wrong password")
				}
			}else{
				response.send("email not found")
			}	
		}catch(error){
			response.send(error)
		}

	}

	private register = async(request: Request, response: Response)=>{
		try{
			const incomingData = request.body
			let user = (await pool.query(`SELECT * FROM users WHERE email = '${incomingData.email}'`)).rows[0];
			if(user){
				response.send("user with this email already registed")
			}else{
				await pool.query(`INSERT INTO users (id, email, password, nickname) 
					VALUES ('${uniqid()}', '${incomingData.email}', '${incomingData.password}', '${incomingData.nickname}')`)
				response.status(200).send("success registed")
			}
		}catch(error){
			if(error.constraint=='users_password_check'){
				response.status(400).send("invalid password")
			}else if(error.constraint=='users_nickname_check'){
				response.status(400).send("invalid nickname")
			}else{
				response.send("some error")
			}

		}
	}

	private createToken(data):string{
		return jwt.sign(data, process.env.JWT_KEY, {expiresIn: process.env.JWT_EXPIRESIN})
	}

}