import { UnprocessableEntityException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationFailedException extends UnprocessableEntityException {
  validationErrors!: ValidationError[];

  constructor(params: Partial<ValidationFailedException>) {
    super(params.message ?? 'Validation failed');
    this.validationErrors = params.validationErrors ?? [];
  }
}
