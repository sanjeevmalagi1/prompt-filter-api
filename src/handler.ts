import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { makeAPIRequestToOpenAI, makeAPIRequestToFetchCVEs } from "./services"

export const generatePayload = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestBody = event.body ? JSON.parse(event.body) : {}
        const userPrompt = requestBody.user_prompt

        const response = await makeAPIRequestToOpenAI(userPrompt)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Request received",
                data: response,
            })
        }
    } catch (error) {
        console.error("Error", error)
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Something went wrong" }),
          }
    }
}

export const fetchCVEs = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestBody = event.body ? JSON.parse(event.body) : {}
        console.log(requestBody)

        const response = await makeAPIRequestToFetchCVEs(requestBody)
        console.log(response.data)

        return {
            statusCode: response.status,
            body: JSON.stringify(response.data)
        }
    } catch(error: any) {
        // Handle errors from target API
        if (error.response) {
            return {
                statusCode: error.response.status,
                body: JSON.stringify({
                    message: "API request failed",
                    error: error.response.data
                })
            }
        }
    
        return {
                statusCode: 500,
                body: JSON.stringify({
                message: "Internal server error",
                error: error.message,
            })
        }
    }
}
