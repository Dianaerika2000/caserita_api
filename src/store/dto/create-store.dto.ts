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

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  cellphone: string;

  @IsString()
  @IsNotEmpty()
  galleryName: string;

  @IsString()
  @IsNotEmpty()
  storeNumber: string;

  @IsOptional()
  @IsString()
  locationLink?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PaymentType, {
    each: true,
  })
  paymentTypes: PaymentType[];

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(SaleType, {
    each: true,
  })
  saleTypes: SaleType[];

  @IsBoolean()
  hasDelivery: boolean;

  @IsUUID()
  categoryId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateStoreScheduleDto)
  schedules: CreateStoreScheduleDto[];
}
