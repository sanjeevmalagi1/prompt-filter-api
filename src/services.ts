import { OpenAI } from "openai"
import axios from "axios"

const open_ai_api_key = process.env.OPEN_AI_API_KEY

const TRANSILIENCE_API_BASE_URL = process.env.TRANSILIENCE_API_BASE_URL
const TRANSILIENCE_BARER_TOKEN = process.env.TRANSILIENCE_BARER_TOKEN

const axiosInstance = axios.create({
    baseURL: TRANSILIENCE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TRANSILIENCE_BARER_TOKEN}`
    }
})


const openai = new OpenAI({
    apiKey: open_ai_api_key
})

const parseResponse = (response: string| null) => {
    if (!response) {
      return null
    }

    return JSON.parse(response)
}

const getCurrenTime = () => {
    return new Date().toString()
}

const getSystemPropmt = () => {
    const currentTime = getCurrenTime()
    return `You are an API assistant that converts user requests into JSON payloads for an API. Extract relevant parameters such as vendor, product, date range, sorting, and limits from user queries and generate a valid JSON request body.\n\nRules:\n- Use 'since_date' and 'to_date' in the ISO 8601 format: 'YYYY-MM-DDTHH:MM:SSZ'.\n- The 'sort_order' field must always be an object, formatted as '{ \"<sort_field>\": <sort_direction> }', where:\n  - '<sort_field>' must be one of: 'epss_percentile', 'epss_score', 'weaknesses', 'api_created', 'api_last_modified', 'name', 'version'.\n  - '<sort_direction>' should be '1' for ascending or '-1' for descending order.\n  - Default sorting is '{ \"api_last_modified\": -1 }' if not specified by the user.\n- If no 'limit' is specified, default to 10.\n- If no date range is provided, use the last 30 days. The date time is: ${currentTime}.Use this for date range queries. \n.\n- If no vendor is specified, do not include the 'vendor' field.\n- If no product is specified, do not include the 'product' field.\n\n Return only the JSON payload, with no extra text or explanations.Do not include as json tags.`
}

type SortField = "epss_percentile" | "epss_score" | "weaknesses" | "api_created" | "api_last_modified" | "name" | "version"

interface ICVEPayload {
    start_from: string
    limit: number
    sort_order: Record<SortField, 1 | -1>
    since_date: string
    to_date: string
    vendor?: string
    product?: string
}
 
export const makeAPIRequestToOpenAI = async (userPrompt: string) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: getSystemPropmt() },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    })
  
    return parseResponse(response.choices[0].message.content) as ICVEPayload
}

export const makeAPIRequestToFetchCVEs = async (payload: ICVEPayload) => {
    const body = payload
    
    const response = await axiosInstance.post(`/cves`, body)

    return response
}

export const responseJSON = (statusCode: number, body: any) => {
  return {
    statusCode: statusCode,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  }
}
