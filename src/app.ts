import * as express from "express"
import * as bodyParser from "body-parser"
import * as cookieParser from "cookie-parser"
import {ControllerInterface} from "./interfaces/controller_interface"
import * as dotenv from "dotenv"

dotenv.config()

export class App{
	app: express.Application = express();
	port: string = process.env.MAIN_PORT;

	constructor(controllers: ControllerInterface[]){
		this.initControllers(controllers);
		this.initMiddlewares();
		this.listen();
	}

	private initMiddlewares(){
		this.app.use(bodyParser.json());
		this.app.use(cookieParser());
	}

	private initControllers(controllers: ControllerInterface[]){
		controllers.forEach(controller=>{
			this.app.use(controller);
		})
	}

	private listen(){
		this.app.listen(this.port, ()=>{
			console.log(`server works on ${this.port}...`)
		})
	}
}