import {Request, Response, Router} from "express"
import {pool} from "../postgre/pool"
import {UserInterface} from "./user_interface"
import {ControllerInterface} from "../interfaces/controller_interface"
import {authenticationMiddleware} from "../middleware/authentication_middleware"

export class UserController implements ControllerInterface{
	router = Router();
	path = process.env.USER_PATH;

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.get(this.path, authenticationMiddleware, this.getAllUsers);
		this.router.get(`${this.path}/:id`, authenticationMiddleware, this.getUserById)
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
			const user = (await pool.query(`SELECT id,email,nickname FROM users WHERE id = '${user_id}'`)).rows[0]
			response.status(200).send(user)
		}catch(error){
			response.send(error)
		}
	}
}