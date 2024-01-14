import { ClassConstructor } from 'class-transformer';

export interface ValidateResponseSchemaMetadata<AnyClass> {
  schema: ClassConstructor<AnyClass>;
}

export type ValidateResponseSchemaOptions<AnyClass> = Omit<ValidateResponseSchemaMetadata<AnyClass>, 'schema'>;

export const VALIDATE_RESPONSE_SCHEMA_METADATA_KEY = 'custom::validateResponseSchema';

/**
 * @description Decorator to set the schema to validate the response agaisnt
 *
 * If no schema is passed, no validation will occur
 *
 * If the validation fails, the response will be a 500 error and the 'validationErrors' property will be set in the response
 *
 * @example
 * _@Get('/user:id')
 * _@ValidateResponseSchema(User)
 * findOne(@Param id: string) {
 *    return this.userService.findOne(id);
 * }
 */
export const ValidateResponseSchema = <
  AnyObject extends Record<string, any>,
  Schema extends ClassConstructor<AnyObject>,
>(
  schema: Schema,
  options?: ValidateResponseSchemaOptions<InstanceType<Schema>>,
) => {
  return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const metadata = {
      schema: schema as any,
      ...options,
    } as ValidateResponseSchemaMetadata<InstanceType<Schema>>;

    Reflect.defineMetadata(VALIDATE_RESPONSE_SCHEMA_METADATA_KEY, metadata, descriptor.value);

    return descriptor;
  };
};
