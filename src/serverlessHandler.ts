
import serverless from "serverless-http"
import app from "./app"

const api = serverless(app)

export {
    api
}
