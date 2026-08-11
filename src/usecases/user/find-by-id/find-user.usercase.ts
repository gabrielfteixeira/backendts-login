import { UserGateway } from 'src/domain/repositories/user.gateway';
import { UserNotFoundUseCaseException } from 'src/usecases/exceptions/user-not-found.usecase.exception';
import { UseCase } from 'src/usecases/usecase';

export type FindUserInput = {
  id: string;
};

export type FindUserOutput = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export class FindUserUseCase implements UseCase<FindUserInput, FindUserOutput> {
  public constructor(private readonly userGateway: UserGateway) {}

  public async execute({ id }: FindUserInput): Promise<FindUserOutput> {
    const user = await this.userGateway.findById(id);

    if (!user) {
      throw new UserNotFoundUseCaseException(
        `User not found while finding user with id: ${id} in ${FindUserUseCase.name}`,
        'Usuario não encontrado',
        FindUserUseCase.name,
      );
    }

    const output: FindUserOutput = {
      id: user.getId(),
      email: user.getEmail(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
    return output;
  }
}
