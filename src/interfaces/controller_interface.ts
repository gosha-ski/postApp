import * as express from "express"

export interface ControllerInterface{
	router: express.Router;
	path: string;
}

