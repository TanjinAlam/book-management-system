import {
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Injectable()
export class CustomValidationPipe
  extends ValidationPipe
  implements PipeTransform
{
  constructor() {
    super({
      whitelist: true,
      errorHttpStatusCode: 400,
      transform: true,
      exceptionFactory: (errors) => {
        console.log('Validation errors:', errors);

        // Extract constraint messages from validation errors
        const errorMessages: Record<string, string[]> = {};

        errors.forEach((error: ValidationError) => {
          if (error.constraints) {
            errorMessages[error.property] = Object.values(error.constraints);
          }
        });

        const exception = new BadRequestException({
          message: 'Bad Request due to validation',
          error: errorMessages,
        });

        return exception;
      },
    });
  }
}
