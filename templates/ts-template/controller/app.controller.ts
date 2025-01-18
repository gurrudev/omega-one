import {Request, Response}from 'express'

class Controller {

    static getListening(req: Request, res: Response) {
        res.send('Server is Live🚀')
    }
    
    static getHelloWorld(req: Request, res: Response) {
        res.send('Hello World!')
    }
}

export default Controller