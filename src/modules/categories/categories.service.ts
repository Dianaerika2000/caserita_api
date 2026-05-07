import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like, FindManyOptions } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ResponseMessages } from '../../common/enums/response-messages.enum';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // ─── Mapper entidad → DTO ──────────────────────────────────────
  private toResponseDto(category: Category): CategoryResponseDto {
    const dto = new CategoryResponseDto();
    dto.id = category.id;
    dto.name = category.name;
    dto.isActive = category.isActive;
    dto.parentId = category.parentId;
    dto.createdAt = category.createdAt;
    dto.updatedAt = category.updatedAt;

    if (category.children) {
      dto.children = category.children.map((child) =>
        this.toResponseDto(child),
      );
    }

    return dto;
  }

  // ─── Crear ────────────────────────────────────────────────────
  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    if (dto.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new BadRequestException(
          `La categoría padre con id ${dto.parentId} no existe`,
        );
      }
    }

    const category = this.categoryRepository.create({
      ...dto,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.categoryRepository.save(category);
    return this.toResponseDto(saved);
  }

  // ─── Listar con filtros y paginación ──────────────────────────
  async findAll(query: CategoryQueryDto): Promise<{
    data: CategoryResponseDto[];
    total: number;
  }> {
    const { page = 1, limit = 10, name, onlyActive, parentId } = query;

    const where: FindManyOptions<Category>['where'] = {};

    if (parentId) {
      where.parentId = parentId;
    } else {
      where.parentId = IsNull(); // por defecto solo categorías raíz
    }

    if (name) {
      where.name = Like(`%${name}%`);
    }

    if (onlyActive) {
      where.isActive = true;
    }

    const [categories, total] = await this.categoryRepository.findAndCount({
      where,
      relations: ['children'],
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: categories.map((c) => this.toResponseDto(c)),
      total,
    };
  }

  // ─── Obtener uno ──────────────────────────────────────────────
  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['children', 'parent'],
    });

    if (!category) {
      throw new NotFoundException(ResponseMessages.CATEGORY_NOT_FOUND);
    }

    return this.toResponseDto(category);
  }

  // ─── Actualizar ───────────────────────────────────────────────
  async update(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(ResponseMessages.CATEGORY_NOT_FOUND);
    }

    if (dto.parentId && dto.parentId === id) {
      throw new BadRequestException(
        'Una categoría no puede ser su propio padre',
      );
    }

    if (dto.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new BadRequestException(
          `La categoría padre con id ${dto.parentId} no existe`,
        );
      }
    }

    Object.assign(category, dto);
    const saved = await this.categoryRepository.save(category);
    return this.toResponseDto(saved);
  }

  // ─── Eliminar (soft delete en cascada) ───────────────────────
  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!category) {
      throw new NotFoundException(ResponseMessages.CATEGORY_NOT_FOUND);
    }

    // soft delete en cascada a los hijos
    if (category.children && category.children.length > 0) {
      await this.categoryRepository.softDelete({
        parentId: id,
      });
    }

    await this.categoryRepository.softDelete(id);
  }
}
