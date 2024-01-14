import { ValidationFailedException } from '../../../exceptions/validation-failed-exception';

export type InterceptedError = Error | ValidationFailedException;
