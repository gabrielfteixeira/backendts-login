export abstract class JwtService {
  public abstract generateToken(userId: string): Promise<string>;
  public abstract generateRefreshToken(userId: string): Promise<string>;
}
