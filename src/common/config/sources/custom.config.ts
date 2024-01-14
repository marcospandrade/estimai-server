import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 *  Base template for any Custom configuration, you can extend this with your own
 *  Note that the BaseCustomConfig values are set by the framework
 *
 * Your custom config can be in a file like `server/src/config/example-custom.config.ts`
 * used together with the customLoad function
 *
 * @example
 *  const exampleCustomConfig: BaseCustomConfig = {
 *      serverStartTime: Date.now(),
 *  };
 */
export class BaseCustomConfig {
    @IsNotEmpty()
    @IsNumber()
    serverStartTime!: number;
}
