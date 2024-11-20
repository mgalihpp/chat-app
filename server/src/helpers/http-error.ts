import type { Response } from 'express';
import { ZodIssue } from 'zod';
import HttpStatus from 'http-status-codes';

/**
 * @class Class for handling HTTP errors.
 */
class HttpError {
  /**
   * Sends an error response.
   * @param res - The response object.
   * @param statusCode - The HTTP status code of the error.
   * @param message - The error message. Can be a string, an array of strings, or an array of Zod issues.
   * @returns The response object.
   */
  static sendError(
    res: Response,
    statusCode: number,
    message: string | string[] | ZodIssue[]
  ) {
    return res.status(statusCode).json({
      status: statusCode,
      success: false,
      message: message,
    });
  }

  /**
   * Sends an internal server error response.
   * @param res - The response object.
   * @param message - The error message. Defaults to 'Internal Server Error'.
   * @param error - The error object that caused the internal server error.
   *              If provided, the error message will be sent instead of the message provided.
   * @returns The response object.
   */
  static internalServerError(
    res: Response,
    error?: unknown,
    message: string | string[] = 'Internal Server Error'
  ) {
    if (error instanceof Error) {
      return this.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message
      );
    } else {
      return this.sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
  }

  /**
   * Sends a bad request error response.
   * @param res - The response object.
   * @param message - The error message. Defaults to 'Bad Request'.
   * @returns The response object.
   */
  static badRequest(res: Response, message: string | string[] = 'Bad Request') {
    return this.sendError(res, HttpStatus.BAD_REQUEST, message);
  }

  /**
   * Sends a not found error response.
   * @param res - The response object.
   * @param message - The error message. Defaults to 'Not Found'.
   * @returns The response object.
   */
  static notFound(res: Response, message: string | string[] = 'Not Found') {
    return this.sendError(res, HttpStatus.NOT_FOUND, message);
  }

  /**
   * Sends a validation error response with a list of Zod issues.
   * @param res - The response object.
   * @param message - An array of Zod issues representing the validation errors.
   * @returns The response object with a BAD_REQUEST status and the validation errors.
   */
  static validationError(res: Response, message: ZodIssue[]) {
    return this.sendError(res, HttpStatus.BAD_REQUEST, message);
  }

  /**
   * Sends an unauthorized error response.
   * @param res - The response object.
   * @param message - The error message. Defaults to 'Unauthorized'.
   * @returns The response object.
   */
  static unauthorized(
    res: Response,
    message: string | string[] = 'Unauthorized'
  ) {
    return this.sendError(res, HttpStatus.UNAUTHORIZED, message);
  }

  // You can add more error types (e.g., unauthorized, forbidden, etc.) if needed
}

export default HttpError;
