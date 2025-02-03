import { OpenAI } from "openai"
import { Response, Request } from "express"
import AWS from "aws-sdk"

const open_ai_api_key = process.env.OPEN_AI_API_KEY
const open_ai_assistant_id = process.env.OPEN_AI_ASSISTANT_ID

const openai = new OpenAI({
    apiKey: open_ai_api_key
});

// const lambda = new AWS.Lambda();

export const createNewThread = async () => {
    return await openai.beta.threads.create();
}

export const addUserMessageToThread = async (threadId: string, message: string) => {
    const threadMessages = await openai.beta.threads.messages.create(
        threadId,
        { role: "user", content: message }
    );

    return threadMessages
}

export const addAssistantMessageToThread = async (threadId: string) => {
    if (!open_ai_assistant_id) {
        return {}
    }

    const run = await openai.beta.threads.runs.create(
        threadId,
        { assistant_id: open_ai_assistant_id }
      );

    return run
}

export const getMessages = async (threadId: string) => {
    const threadMessages = await openai.beta.threads.messages.list(threadId);
    return threadMessages
}

/**
 * Sends a JSON response to the client with the specified HTTP status code and response data.
 *
 * @param {Request} req - The Express request object, containing information about the HTTP request.
 * @param {Response} res - The Express response object, used to send a response back to the client.
 * @param {number} statusCode - The HTTP status code to be sent with the response.
 * @param {Object | Object[]} response - The data to be sent in the response body. If it's an array, the data will be wrapped under the `items` key; 
 *                                       otherwise, it will be wrapped under the `item` key.
 * @returns {Response} - The Express response object with the JSON payload.
 *
 * Example usage:
 * ```
 * json_response(req, res, 200, { name: "John Doe" });
 * json_response(req, res, 200, [{ name: "John Doe" }, { name: "Jane Doe" }]);
 * ```
 */
export const json_response = (__req: Request, res: Response, statusCode: number, response: Object | Object[]): Response => {
    return res.status(statusCode).json(response)
}

