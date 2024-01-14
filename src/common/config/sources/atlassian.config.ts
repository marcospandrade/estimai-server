import { IsNotEmpty, IsString } from 'class-validator';

export class AtlassianConfig {
    @IsNotEmpty()
    @IsString()
    ATLASSIAN_CLIENT_ID!: string;

    @IsNotEmpty()
    @IsString()
    ATLASSIAN_CLIENT_SECRET!: string;

    @IsNotEmpty()
    @IsString()
    ATLASSIAN_CALLBACK_URL!: string;

    @IsNotEmpty()
    @IsString()
    ATLASSIAN_BASE_URL!: string;
}
