import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseHelper } from './response.interface';

interface ExceptionResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

function isExceptionResponse(obj: unknown): obj is ExceptionResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (typeof (obj as ExceptionResponse).message === 'string' ||
      typeof (obj as ExceptionResponse).error === 'string' ||
      typeof (obj as ExceptionResponse).statusCode === 'number')
  );
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Unknown error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exceptionResponse;
      } else if (isExceptionResponse(exceptionResponse)) {
        message = exceptionResponse.message || exception.message;
        error =
          exceptionResponse.error ||
          exceptionResponse.message ||
          exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.message;
    }

    console.error(
      `Error occurred on ${request.method} ${request.url}:`,
      exception,
    );

    const apiResponse = ResponseHelper.error(message, status, error);

    response.status(status).json(apiResponse);
  }
}
