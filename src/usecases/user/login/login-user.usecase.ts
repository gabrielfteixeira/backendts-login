import { UserGateway } from 'src/domain/repositories/user.gateway';
import { JwtService } from 'src/infra/services/jwt/jwt.service';
import { CredentialsNotValidUseCaseException } from 'src/usecases/exceptions/credentials-not-valid.usecase.exception';
import { UseCase } from 'src/usecases/usecase';

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginOutput = {
  generateAuthToken: string;
  refreshToken: string;
};

export class LoginUserUseCase implements UseCase<LoginInput, LoginOutput> {
  public constructor(
    private readonly userGateway: UserGateway,
    private readonly jwtService: JwtService,
  ) {}

  public async execute({ email, password }: LoginInput): Promise<LoginOutput> {
    const anUser = await this.userGateway.findByEmail(email);
    if (!anUser) {
      throw new CredentialsNotValidUseCaseException(
        `User not found with email ${email} during login at ${LoginUserUseCase.name}`,
        `Credenciais invalidas. Por favor, verifique seu email e senha e tente novamente.`,
        LoginUserUseCase.name,
      );
    }
    const isPasswordValid = anUser.comparePassword(password);

    if (!isPasswordValid) {
      throw new CredentialsNotValidUseCaseException(
        `Password ${password} is not valid for user with email ${email} and ${anUser.getId()} in ${LoginUserUseCase.name} `,
        `Credenciais invalidas. Por favor, verifique seu email e senha e tente novamente.`,
        CredentialsNotValidUseCaseException.name,
      );
    }

    const generateAuthToken = await this.jwtService.generateAuthToken(
      anUser.getId(),
    );

    const refreshToken = await this.jwtService.generateRefreshToken(
      anUser.getId(),
    );

    const output: LoginOutput = { generateAuthToken, refreshToken };

    return output;
  }
}
