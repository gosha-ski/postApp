import {ControllerInterface} from "../interfaces/controller_interface"
import {Request, Response, Router} from "express"
import {pool} from "../postgre/pool"
import {authenticationMiddleware} from "../middleware/authentication_middleware"
import * as uniqid from "uniqid"

export class PostController implements ControllerInterface{
	router = Router()
	path = "/posts"

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.get(this.path, authenticationMiddleware, this.getAllPosts)
		this.router.get(`${this.path}/:id`, authenticationMiddleware, this.getPostById)
		this.router.post(this.path, authenticationMiddleware, this.createPost)
		this.router.delete(`${this.path}/:id`, authenticationMiddleware, this.deletePost)
	}

	private getAllPosts = async (request: Request, response: Response)=>{
		try{
			let posts = (await pool.query(`SELECT * FROM posts`)).rows
			response.status(200).send(posts)
		}catch(error){
			response.send(error)
		}

	}

	private getPostById = async (request: Request, response: Response)=>{
		try{
			const id = request.params.id 
			let post = (await pool.query(`SELECT * FROM posts WHERE id = '${id}'`)).rows[0]
			response.status(200).send(post)

		}catch(error){
			response.send(error)
			
		}
	}

    private createPost = async (request: Request, response: Response)=>{
    	try{
    		const data = request.body
    		const id = uniqid()
    		const user_id = request.user.id
    		await pool.query(`INSERT INTO posts(id, title, content, author_id) VALUES ('${id}', '${data.title}', '${data.content}', '${user_id}')`)
    		const post = (await pool.query(`SELECT * FROM posts WHERE id = '${id}' `)).rows[0]
    		response.status(200).send(post)
		}catch(error){
			response.send(error)
			
		}
    }

    private deletePost = async (request: Request, response: Response)=>{
    	try{
    		const post_id = request.params.id
    		const user_id = request.user.id
    		const post = (await pool.query(`SELECT * FROM posts WHERE id = '${post_id}'`)).rows[0]
    		if(post.author_id == user_id){
    			await pool.query(`DELETE FROM posts WHERE id = '${post_id}'`)
    			response.status(200).send("post deleted")
    		}else{
    			response.send("you dont have permissions")
    		}
		}catch(error){
			console.log(error)
			response.send(error)
		}
    }



}