import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginatedResponseDto<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Datos obtenidos correctamente' })
  message!: string;

  @ApiProperty({ isArray: true })
  data!: T[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;

  static ok<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Datos obtenidos correctamente',
  ): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(total / limit);
    const response = new PaginatedResponseDto<T>();
    response.success = true;
    response.message = message;
    response.data = data;
    response.meta = {
      total,
      page,
      limit,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
    return response;
  }
}
