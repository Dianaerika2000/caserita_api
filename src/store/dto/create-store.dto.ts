import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { PaymentType } from '../enums/payment-type.enum';
import { SaleType } from '../enums/sale-type.enum';

import { CreateStoreScheduleDto } from './create-store-schedule.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({
    example: 'Tienda Rosita',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'rosita@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    example: '76543210',
  })
  @IsString()
  cellphone!: string;

  @ApiProperty({
    example: 'Galería Central',
  })
  @IsString()
  @IsNotEmpty()
  galleryName!: string;

  @ApiProperty({
    example: '12B',
  })
  @IsString()
  @IsNotEmpty()
  storeNumber!: string;

  @ApiProperty({
    example: 'https://maps.google.com/...',
    required: false,
  })
  @IsOptional()
  @IsString()
  locationLink?: string;

  @ApiProperty({
    example: ['CASH', 'QR'],
    enum: PaymentType,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PaymentType, {
    each: true,
  })
  paymentTypes!: PaymentType[];

  @ApiProperty({
    example: ['WHOLESALE', 'RETAIL'],
    enum: SaleType,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(SaleType, {
    each: true,
  })
  saleTypes!: SaleType[];

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  hasDelivery!: boolean;

  @ApiProperty({
    example: '21b361dd-6d5c-423c-9c18-ce8307882898',
  })
  @IsUUID()
  categoryId!: string;

  @ApiProperty({
    type: [CreateStoreScheduleDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateStoreScheduleDto)
  schedules!: CreateStoreScheduleDto[];
}
