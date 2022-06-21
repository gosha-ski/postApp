import {App} from "./app"
import {UserController} from "./users/user_controller"
import {AuthenticationController} from "./authentication/authentication_controller"

const app = new App([
	new UserController(),
	new AuthenticationController()
])