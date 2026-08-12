import { UseCaseException } from 'src/usecases/exceptions/usecase.exception';

export class EmailAlreadyExistsUseCaseException extends UseCaseException {
  public constructor(
    internalMessage: string,
    externalMessage: string,
    context: string,
  ) {
    super(internalMessage, externalMessage, context);
    this.name = EmailAlreadyExistsUseCaseException.name;
  }
}
