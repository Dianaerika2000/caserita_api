import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { ResponseMessages } from '../common/enums/response-messages.enum';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({
    summary: 'Register a new customer',
  })
  @ApiResponse({
    status: 201,
    type: ApiResponseDto,
  })
  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<ApiResponseDto<any>> {
    const customer = await this.customerService.create(createCustomerDto);

    return ApiResponseDto.ok(customer, ResponseMessages.CUSTOMER_CREATED);
  }

  @ApiOperation({
    summary: 'Get all customers',
  })
  @ApiResponse({
    status: 200,
    type: ApiResponseDto,
  })
  @Get()
  async findAll(): Promise<ApiResponseDto<any>> {
    const customers = await this.customerService.findAll();

    return ApiResponseDto.ok(customers, ResponseMessages.CUSTOMERS_FOUND);
  }

  @ApiOperation({
    summary: 'Get customer by id',
  })
  @ApiResponse({
    status: 200,
    type: ApiResponseDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponseDto<any>> {
    const customer = await this.customerService.findOne(id);

    return ApiResponseDto.ok(customer, ResponseMessages.CUSTOMER_FOUND);
  }

  @ApiOperation({
    summary: 'Update customer',
  })
  @ApiResponse({
    status: 200,
    type: ApiResponseDto,
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<ApiResponseDto<any>> {
    const customer = await this.customerService.update(id, updateCustomerDto);

    return ApiResponseDto.ok(customer, ResponseMessages.CUSTOMER_UPDATED);
  }
}
