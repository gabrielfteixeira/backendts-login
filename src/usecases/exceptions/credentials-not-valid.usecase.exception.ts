import { Exception } from 'src/shared/exceptions/exception';

export class CredentialsNotValidUseCaseException extends Exception {
  public constructor(
    internalMessage: string,
    externalMessage: string,
    context: string,
  ) {
    super(internalMessage, externalMessage, context);
    this.name = CredentialsNotValidUseCaseException.name;
  }
}
