import z from 'zod';
import { User } from '../entities/user.entity';
import { Validator } from '../shared/validators/validator';
import { ZodUtils } from '../../shared/utils/zod-utils';
import { ValidatorDomainException } from '../shared/exceptions/validator-domain.exception';
import { DomainException } from '../shared/exceptions/domain.exception';

export class UserZodValidator implements Validator<User> {
  private constructor() {}

  public static create(): UserZodValidator {
    return new UserZodValidator();
  }

  public validate(input: User): void {
    try {
      this.getZodSchema().parse(input);
    } catch (error) {
      if (error instanceof z.ZodError) {
        //throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
        const message = ZodUtils.formatZodError(error);
        throw new ValidatorDomainException(
          `Error while validating user ${input.getId()}: ${message}`,
          `Os dados para criação do usuário são inválidos: ${message}`,
          UserZodValidator.name,
        );
      }
      const err = error as Error;

      throw new DomainException(
        `Error while validating user ${input.getId()}: ${err.message}`,
        `Houve um erro inesperado ao validar os dados do usuário: ${err.message}`,
        UserZodValidator.name,
      );
    }
  }

  private getZodSchema() {
    const zodSchema = z.object({
      id: z.string().uuid(),
      email: z.string().email(),
      password: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    });

    return zodSchema;
  }
}
