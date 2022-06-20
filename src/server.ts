import {App} from "./app"
import {UserController} from "./users/user_controller"

const app = new App([
	new UserController()
])