export class AtlassianHelper {
    static calculateExpiresAt(expiresIn: number): string {
        const REFRESH_TOKEN_MARGIN = 5000;
        const expiresAt = Date.now() + expiresIn * 1000 - REFRESH_TOKEN_MARGIN;

        return expiresAt.toString();
    }
}
