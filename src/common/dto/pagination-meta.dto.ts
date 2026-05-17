import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 30, description: 'Total de registros' })
  total!: number;

  @ApiProperty({ example: 1, description: 'Página actual' })
  page!: number;

  @ApiProperty({ example: 10, description: 'Registros por página' })
  limit!: number;

  @ApiProperty({ example: 3, description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ example: false, description: 'Tiene página anterior' })
  hasPreviousPage!: boolean;

  @ApiProperty({ example: true, description: 'Tiene página siguiente' })
  hasNextPage!: boolean;
}
