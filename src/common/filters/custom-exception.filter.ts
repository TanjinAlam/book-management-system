import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

interface ErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  error: string | string[] | Record<string, string[]>;
  path: string;
  method: string;
  timestamp: string;
}

interface HttpExceptionResponse {
  message?: string | string[] | ValidationError[];
  error?: string;
  statusCode?: number;
}

interface ValidationError {
  property: string;
  constraints?: Record<string, string>;
  children?: ValidationError[];
}

interface PostgresError extends Error {
  code?: string;
  detail?: string;
  table?: string;
  constraint?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    this.logger.error('Exception caught:', exception);

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: string | string[] | Record<string, string[]> =
      'Internal Server Error';

    // Handle TypeORM QueryFailedError (includes unique constraint violations)
    if (exception instanceof QueryFailedError) {
      const pgError = exception.driverError as PostgresError;

      // PostgreSQL unique constraint violation
      if (pgError.code === '23505') {
        statusCode = HttpStatus.CONFLICT;
        message = 'Duplicate entry found';

        // Extract field name from constraint or detail
        const detail = pgError.detail || '';
        const match = detail.match(/Key \((.*?)\)=/);
        const field = match ? match[1] : pgError.constraint || 'field';

        error = `${field} already exists`;
      }
      // PostgreSQL foreign key constraint violation
      else if (pgError.code === '23503') {
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint violation';
        error = pgError.detail || 'Referenced entity does not exist';
      }
      // PostgreSQL not null constraint violation
      else if (pgError.code === '23502') {
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Missing required field';
        const match = pgError.message.match(/column "(.*?)"/);
        const column = match ? match[1] : 'field';
        error = `${column} is required`;
      }
      // Other database errors
      else {
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        message = 'Database query failed';
        error = pgError.message || 'Query execution error';
      }
    }
    // Handle TypeORM EntityNotFoundError
    else if (exception instanceof EntityNotFoundError) {
      statusCode = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
      error = exception.message;
    }
    // Handle TypeORM general errors
    else if (exception instanceof TypeORMError) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Database operation failed';
      error = exception.message;
    }
    // Handle NestJS HttpException
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as HttpExceptionResponse;

        // Handle validation errors from class-validator
        if (
          Array.isArray(responseObj.message) &&
          responseObj.message.length > 0
        ) {
          const firstItem = responseObj.message[0];

          // Check if it's a ValidationError object
          if (
            typeof firstItem === 'object' &&
            'property' in firstItem &&
            'constraints' in firstItem
          ) {
            const validationErrors = responseObj.message as ValidationError[];
            const errorMessages: Record<string, string[]> = {};

            validationErrors.forEach((err) => {
              if (err.constraints) {
                errorMessages[err.property] = Object.values(err.constraints);
              }
            });

            message = 'Validation failed';
            error = errorMessages;
          } else {
            // Simple string array
            message = firstItem as string;
            error = responseObj.message as string[];
          }
        } else {
          message = Array.isArray(responseObj.message)
            ? (responseObj.message[0] as string)
            : responseObj.message || exception.message;
          error = responseObj.error || exception.message;
        }
      }
    }
    // Handle standard Error objects
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.message;
    }
    // Handle unknown errors
    else {
      message = 'An unexpected error occurred';
      error = typeof exception === 'string' ? exception : 'Unknown error';
    }

    const responseBody: ErrorResponse = {
      success: false,
      statusCode,
      message,
      error,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(response, responseBody, statusCode);
  }
}
