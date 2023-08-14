export class AtlassianHelper {
  static calculateExpiresAt(expiresIn: number) {
    const REFRESH_TOKEN_MARGIN = 5000;

    return Date.now() + expiresIn * 1000 - REFRESH_TOKEN_MARGIN;
  }
}
