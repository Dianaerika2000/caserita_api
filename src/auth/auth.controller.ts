import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { ResponseMessages } from '../common/enums/response-messages.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Customer login',
  })
  @ApiResponse({
    status: 200,
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @Post('customer/login')
  async loginCustomer(@Body() dto: LoginDto): Promise<ApiResponseDto<any>> {
    const result = await this.authService.loginCustomer(dto);

    return ApiResponseDto.ok(result, ResponseMessages.LOGIN_SUCCESS);
  }

  @ApiOperation({
    summary: 'Store login',
  })
  @ApiResponse({
    status: 200,
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @Post('store/login')
  async loginStore(@Body() dto: LoginDto): Promise<ApiResponseDto<any>> {
    const result = await this.authService.loginStore(dto);

    return ApiResponseDto.ok(result, ResponseMessages.LOGIN_SUCCESS);
  }
}
