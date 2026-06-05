import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'Juan Perez',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'juan@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]+$/,
    {
      message:
        'Password must contain uppercase, lowercase, number and special character',
    },
  )
  password!: string;

  @ApiProperty({
    example: '76543210',
  })
  @IsString()
  @IsNotEmpty()
  cellphone!: string;
}
