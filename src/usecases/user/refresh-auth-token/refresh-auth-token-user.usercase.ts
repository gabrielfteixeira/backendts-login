import { UserGateway } from 'src/domain/repositories/user.gateway';
import { JwtService } from 'src/infra/services/jwt/jwt.service';
import { CredentialsNotValidUseCaseException } from 'src/usecases/exceptions/credentials-not-valid.usecase.exception';
import { UseCase } from 'src/usecases/usecase';

export type RefreshAuthTokenUserUsecaseInput = {
  refreshToken: string;
};

export type RefreshAuthTokenUserUsecaseoutput = {
  authToken: string;
};

export class RefreshAuthTokenUserUsecase implements UseCase<
  RefreshAuthTokenUserUsecaseInput,
  RefreshAuthTokenUserUsecaseoutput
> {
  public constructor(
    private readonly userGateway: UserGateway,
    private readonly jwtService: JwtService,
  ) {}

  public async execute({
    refreshToken,
  }: RefreshAuthTokenUserUsecaseInput): Promise<RefreshAuthTokenUserUsecaseoutput> {
    const { authToken, userId } =
      await this.jwtService.generateAuthTokenWithRefreshToken(refreshToken);

    const anUser = await this.userGateway.findById(userId);

    if (!anUser) {
      throw new CredentialsNotValidUseCaseException(
        `User not found while refreshing auth token with token ${authToken} and id ${userId} at ${RefreshAuthTokenUserUsecase.name}`,
        `Credenciais invalidas`,
        RefreshAuthTokenUserUsecase.name,
      );
    }

    const output: RefreshAuthTokenUserUsecaseoutput = {
      authToken,
    };

    return output;
  }
}
