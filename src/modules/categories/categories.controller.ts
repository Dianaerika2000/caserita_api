import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { ResponseMessages } from '../../common/enums/response-messages.enum';

/**
 * 分类控制器
 * 提供分类的创建、查询、更新和删除等RESTful API接口
 */
@ApiTags('categories') // Swagger API文档标签，标记为categories分类
@ApiBearerAuth('JWT-auth') // Swagger API文档认证方式，标记为JWT认证
@Controller('categories') // 控制器路由前缀，所有接口路径以/categories开头
export class CategoriesController {
  // 依赖注入CategoriesService服务
  constructor(private readonly categoriesService: CategoriesService) {}

  // ─── Crear ────────────────────────────────────────────────────
  @ApiOperation({ summary: 'Crear nueva categoría o subcategoría' })
  @ApiResponse({ status: 201, type: ApiResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post()
  async create(
    @Body() dto: CreateCategoryDto,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    const category = await this.categoriesService.create(dto);
    return ApiResponseDto.ok(category, ResponseMessages.CATEGORY_CREATED);
  }

  // ─── Listar ───────────────────────────────────────────────────
  @ApiOperation({
    summary: 'Listar categorías con filtros y paginación',
    description:
      'Por defecto retorna categorías raíz con sus subcategorías. Usar parentId para filtrar por categoría padre.',
  })
  @ApiResponse({ status: 200, type: PaginatedResponseDto })
  @Get()
  async findAll(
    @Query() query: CategoryQueryDto,
  ): Promise<PaginatedResponseDto<CategoryResponseDto>> {
    const { data, total } = await this.categoriesService.findAll(query);
    return PaginatedResponseDto.ok(
      data,
      total,
      query.page ?? 1,
      query.limit ?? 10,
      ResponseMessages.CATEGORIES_FOUND,
    );
  }

  // ─── Obtener uno ──────────────────────────────────────────────
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    const category = await this.categoriesService.findOne(id);
    return ApiResponseDto.ok(category, ResponseMessages.CATEGORY_FOUND);
  }

  // ─── Actualizar ───────────────────────────────────────────────
  @ApiOperation({ summary: 'Actualizar categoría' })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    const category = await this.categoriesService.update(id, dto);
    return ApiResponseDto.ok(category, ResponseMessages.CATEGORY_UPDATED);
  }

  // ─── Eliminar ─────────────────────────────────────────────────
  @ApiOperation({ summary: 'Eliminar categoría (soft delete)' })
  @ApiResponse({ status: 204, description: 'Categoría eliminada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
