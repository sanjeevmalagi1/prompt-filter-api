import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { makeAPIRequestToOpenAI, makeAPIRequestToFetchCVEs, responseJSON } from "./services"

export const generatePayload = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestBody = event.body ? JSON.parse(event.body) : {}
        const userPrompt = requestBody.user_prompt

        const response = await makeAPIRequestToOpenAI(userPrompt)

        const responseBody = {
            message: "Request received",
            data: response,
        }

        return responseJSON(200, responseBody)
    } catch (error) {
        console.error("Error", error)

        const responseBody = {
            message: "Request received",
            data: { message: "Something went wrong" },
        }
        return responseJSON(400, responseBody)
    }
}

export const fetchCVEs = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestBody = event.body ? JSON.parse(event.body) : {}
        console.log(requestBody)

        const response = await makeAPIRequestToFetchCVEs(requestBody)
        console.log(response.data)

        return responseJSON(response.status, response.data)
    } catch(error: any) {
        console.log(error)
        
        if (error.response) {
            const responseBody = {
                message: "API request failed",
                error: error.response.data
            }

            return responseJSON(error.response.status, responseBody)
        }

        const responseBody = {
            message: "Internal server error",
            error: error.message,
        }
        return responseJSON(500, responseBody)
    }
}
