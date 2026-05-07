import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsUUID,
  IsBoolean,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Vestidos', maxLength: 100 })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'Vestidos para toda ocasión',
    required: false,
    nullable: true,
  })
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
