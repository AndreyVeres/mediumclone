import { ArgumentMetadata, PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class AppValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);

    console.log(object ,'<<<<<<object')

    const errors = await validate(object);

    console.log(errors, '<<,');
    if (!errors.length) return value;

    throw new UnprocessableEntityException({ errors: this.buildErrors(errors) });
  }

  private buildErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints);

      return acc;
    }, {});
  }
}
