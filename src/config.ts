import { IsString } from 'class-validator';

export class AuthConfig {
  @IsString()
  JWT_KEY: string;

  @IsString()
  JWT_EXPIRES: string;
}

// export class OrmConfig {
//   @IsString()
//   DB_TYPE = 'postgres';

//   @IsString()
//   DB_HOST!: string;

//   @IsNumber()
//   @Transform(({ value }) => parseInt(value))
//   DB_PORT!: number;

//   @IsString()
//   DB_USER!: string;

//   @IsString()
//   DB_PASSWORD!: string;

//   @IsString()
//   DB_NAME!: string;

//   @IsBoolean()
//   DB_SYNC = true;

//   @IsArray()
//   @Transform(({ value }) => value.split(','))
//   DB_LOG_LEVEL!: LoggerOptions;

//   @IsArray()
//   entities = [path.resolve(__dirname, '**/*.entity{.ts,.js}')];

//   @IsString()
//   migrationsTableName = 'migrations';

//   @IsArray()
//   migrations = [path.resolve(__dirname, 'modules', 'database', 'migrations', '**/*.ts')];
// }
