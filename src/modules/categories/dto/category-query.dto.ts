import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class CategoryQueryDto extends PaginationQueryDto {
  @ApiProperty({ required: false, description: 'Filtrar por nombre' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: 'Solo categorías activas' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value === 'true')
  @IsBoolean()
  onlyActive?: boolean;

  @ApiProperty({ required: false, description: 'Filtrar por categoría padre' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
