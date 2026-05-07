import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Operación exitosa' })
  message!: string;

  @ApiProperty({ nullable: true })
  data!: T | null;

  static ok<T>(data: T, message = 'Operación exitosa'): ApiResponseDto<T> {
    const response = new ApiResponseDto<T>();
    response.success = true;
    response.message = message;
    response.data = data;
    return response;
  }

  static error<T>(message: string): ApiResponseDto<T> {
    const response = new ApiResponseDto<T>();
    response.success = false;
    response.message = message;
    response.data = null;
    return response;
  }
}
