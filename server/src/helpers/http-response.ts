import type { Request, Response } from 'express';

/**
 * @class Class for handling HTTP responses.
 */
class httpResponse {
  /**
   * Sends a response with a given status code, data, and message.
   * @param res - The response object.
   * @param statusCode - The HTTP status code of the response.
   * @param success - Whether the request was successful.
   * @param data - The data to be sent in the response.
   * @param message - An optional message to be sent in the response.
   * @returns The response object.
   */
  static sendResponse<T>(
    res: Response,
    statusCode: number,
    success: boolean,
    data: T,
    message?: string
  ) {
    return res.status(statusCode).json({
      status: statusCode,
      success,
      message,
      data,
    });
  }

  /**
   * Sends a successful response with a given status code, data, and message.
   * @param res - The response object.
   * @param statusCode - The HTTP status code of the response.
   * @param data - The data to be sent in the response.
   * @param message - An optional message to be sent in the response.
   * @returns The response object.
   */
  static success<T>(
    res: Response,
    data: T,
    statusCode: number = 200,
    message?: string
  ): Response {
    return this.sendResponse(res, statusCode, true, data, message);
  }

  /**
   * Sends an error response with a given status code and message.
   * @param res - The response object.
   * @param statusCode - The HTTP status code of the error.
   * @param message - The error message to be sent in the response.
   * @returns The response object.
   */
  static error(res: Response, statusCode: number, message: string): Response {
    return this.sendResponse(res, statusCode, false, null, message);
  }
}

export default httpResponse;
