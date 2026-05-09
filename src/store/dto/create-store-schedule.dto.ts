import { IsEnum, Matches } from 'class-validator';

import { DayOfWeek } from '../enums/day-of-week.enum';

export class CreateStoreScheduleDto {
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  openTime: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  closeTime: string;
}
