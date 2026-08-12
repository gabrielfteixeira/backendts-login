export type GenerateAuthTokenWithRefreshTokenOutput = {
  authToken: string;
  userId: string;
};

export abstract class JwtService {
  public abstract generateAuthToken(userId: string): Promise<string>;
  public abstract generateRefreshToken(userId: string): Promise<string>;
  public abstract generateAuthTokenWithRefreshToken(
    authToken: string,
  ): Promise<GenerateAuthTokenWithRefreshTokenOutput>;
}
