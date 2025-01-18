import express, { Request, Response } from 'express'

const app = express()

import {
    json_response
} from "./services";

app.get('/', (req: Request, res: Response) => {
    json_response(req, res, 200, { success: "Your First JSON response" })
})

export default app
  