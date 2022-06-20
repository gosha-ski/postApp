import {Request, Response, Router} from "express"
import {pool} from "../postgre/pool"
import {UserInterface} from "./user_interface"

export class UserController{
	router = Router();
	path = process.env.USER_PATH;

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.get(this.path, this.getAllUsers);
		this.router.get(`${this.path}/:id`, this.getUserById)
	}

	private getAllUsers = async(request: Request, response: Response)=>{
		try{
			const users = (await pool.query(`SELECT id, email, nickname FROM users;`)).rows
		    response.status(200).send(users)

		}catch(error){
			response.send(error)
		}
	}

	private getUserById = async(request: Request, response: Response)=>{
		try{
			const user_id: string = request.params.id;
			const user: UserInterface = (await pool.query(`SELECT id,email,nickname FROM users WHERE id = '${user_id}'`)).rows[0]
			response.status(200).send(user)

		}catch(error){
			response.send(error)
		}
	}
}