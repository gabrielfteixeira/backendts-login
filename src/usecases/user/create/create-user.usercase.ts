import { User } from 'src/domain/entities/user.entity';
import { UserGateway } from 'src/domain/repositories/user.gateway';
import { EmailAlreadyExistsUseCaseException } from 'src/shared/exceptions/email-already-exists.usecase.exception';
import { UseCase } from 'src/usecases/usecase';

export type CreateUserInput = {
  email: string;
  password: string;
};

export type CreateUserOutput = {
  id: string;
};

export class CreateUserUseCase implements UseCase<
  CreateUserInput,
  CreateUserOutput
> {
  public constructor(private readonly userGateway: UserGateway) {}

  public async execute({
    email,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    const existingUser = await this.userGateway.findByEmail(email);
    if (existingUser) {
      throw new EmailAlreadyExistsUseCaseException(
        `Email already exists while create user with email: ${email} in ${CreateUserUseCase.name}`,
        'Email already exists',
        CreateUserUseCase.name,
      );
    }
    const anUser = User.create({ email, password });

    //aqui salva no banco de dados
    await this.userGateway.create(anUser);

    const output: CreateUserOutput = {
      id: anUser.getId(),
    };

    return output;
  }
}
