import { Reflector } from '@nestjs/core';

/**
 * @description Decorator to set the response 'message' property of a route
 *
 * If something goes wrong, the message will be the default error constructor message, e.g.: 'Error: Forbidden Resource' - 404
 *
 * @example
 * _@Post('/assert-consistency')
 * _@ResponseMessage({
 *   success: 'Consistency asserted',
 *   error: 'Error asserting consistency',
 * })
 * assertConsistency(@Body() payload: UpdateContactDto) {
 *    return this.contactsService.assertConsistency(payload);
 * }
 */
export const ResponseMessage = Reflector.createDecorator<string>();
