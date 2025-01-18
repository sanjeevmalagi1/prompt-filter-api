import { Response, Request } from 'express'

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
export const json_response = (req: Request, res: Response, statusCode: number, response: Object | Object[]): Response => {
    return res.status(statusCode).json({
        ...(Array.isArray(response) ? { items: response } : { item: response }),
        method: req.method,
    })
}

