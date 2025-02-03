import express, { Request, Response } from "express"
import AWS  from "aws-sdk"

const app = express()

app.use(express.json());

import {
    createNewThread,
    addUserMessageToThread,
    addAssistantMessageToThread,
    getMessages,
    json_response
} from "./services";

app.post('/api/v1/thread', async (req: Request, res: Response) => {
    const thread = await createNewThread()

    json_response(req, res, 200, thread)
})

app.post('/api/v1/thread', async (req: Request, res: Response) => {
    const thread = await createNewThread()

    json_response(req, res, 201, thread)
})

app.post('/api/v1/thread/:thread_id/message', async (req: Request, res: Response) => {
    const threadId = req.params.thread_id
    const message = req.body.message
    
    const threadMessages = await addUserMessageToThread(threadId, message)

    await addAssistantMessageToThread(threadId)
    
    json_response(req, res, 200, threadMessages)
})

app.post('/api/v1/thread/:thread_id/run', async (req: Request, res: Response) => {
    const threadId = req.params.thread_id
    
    const threadMessages = await addAssistantMessageToThread(threadId)
    
    json_response(req, res, 200, threadMessages)
})

app.get('/api/v1/thread/:thread_id/messages', async (req: Request, res: Response) => {
    const threadId = req.params.thread_id
    
    const threadMessages = await getMessages(threadId)
    
    json_response(req, res, 200, threadMessages)
})

export default app
  