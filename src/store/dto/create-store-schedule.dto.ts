import { IsEnum, Matches } from 'class-validator';

import { DayOfWeek } from '../enums/day-of-week.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreScheduleDto {
  @ApiProperty({
    example: 'MONDAY',
    enum: DayOfWeek,
  })
  @IsEnum(DayOfWeek)
  dayOfWeek!: DayOfWeek;

  @ApiProperty({
    example: '08:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  openTime!: string;

  @ApiProperty({
    example: '18:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  closeTime!: string;
}
