import express, { Request, Response } from "express"
import cors from "cors"

const app = express()

app.use(express.json());
app.use(cors());

import {
    createNewThread,
    addMessageAndRunThread,
    getMessages,
    json_response
} from "./services";

app.post('/api/v1/thread', async (req: Request, res: Response) => {
    const thread = await createNewThread()

    json_response(req, res, 200, thread)
})

app.post('/api/v1/thread/:thread_id/run', async (req: Request, res: Response) => {
    const threadId = req.params.thread_id
    const message = req.body.message

    console.log("Running thread", threadId, message)
    
    const threadMessages = await addMessageAndRunThread(threadId, message)

    console.log("Thread messages", threadMessages)
    
    json_response(req, res, 200, threadMessages)
})

app.get('/api/v1/thread/:thread_id/messages', async (req: Request, res: Response) => {
    const threadId = req.params.thread_id
    
    const threadMessages = await getMessages(threadId)
    
    json_response(req, res, 200, threadMessages)
})

export default app
  