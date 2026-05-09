import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { Store } from './entities/store.entity';
import { ResponseMessages } from 'src/common/enums/response-messages.enum';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiOperation({
    summary: 'Register a new store',
  })
  @ApiResponse({
    status: 201,
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Store email already exists',
  })
  @Post()
  async create(
    @Body() createStoreDto: CreateStoreDto,
  ): Promise<ApiResponseDto<Store>> {
    const store = await this.storeService.create(createStoreDto);

    return ApiResponseDto.ok(store, ResponseMessages.STORE_CREATED);
  }

  @ApiOperation({
    summary: 'Get all stores',
  })
  @ApiResponse({
    status: 200,
    type: ApiResponseDto,
  })
  @Get()
  async findAll(): Promise<ApiResponseDto<Store[]>> {
    const stores = await this.storeService.findAll();

    return ApiResponseDto.ok(stores, ResponseMessages.STORES_FOUND);
  }

  @ApiOperation({
    summary: 'Get store by id',
  })
  @ApiResponse({
    status: 200,
    type: ApiResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<ApiResponseDto<Store>> {
    const store = await this.storeService.findOne(id);

    return ApiResponseDto.ok(store, ResponseMessages.STORE_FOUND);
  }

  @ApiOperation({
    summary: 'Update store',
  })
  @ApiResponse({
    status: 200,
    type: ApiResponseDto,
  })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe)
    id: string,

    @Body()
    updateStoreDto: UpdateStoreDto,
  ): Promise<ApiResponseDto<Store>> {
    const store = await this.storeService.update(id, updateStoreDto);

    return ApiResponseDto.ok(store, ResponseMessages.STORE_UPDATED);
  }
}
