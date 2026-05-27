import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreStatus } from './enums/store-status.enum';
import { CategoriesService } from '../modules/categories/categories.service';
import { StoreSchedule } from './entities/store-schedule.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(StoreSchedule)
    private readonly storeScheduleRepository: Repository<StoreSchedule>,
    private readonly configService: ConfigService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const { password, categoryId, schedules, ...storeData } = createStoreDto;

    const existingStore = await this.storeRepository.findOne({
      where: {
        email: createStoreDto.email,
      },
    });

    if (existingStore) {
      throw new ConflictException('Store email already exists');
    }

    const category =
      await this.categoriesService.findParentCategory(categoryId);

    const saltRounds = Number(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS', '10'),
    );
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const store = this.storeRepository.create({
      ...storeData,
      password: hashedPassword,
      category,
      schedules,
    });

    return this.storeRepository.save(store);
  }

  async findAll(): Promise<Store[]> {
    return this.storeRepository.find({
      relations: ['category', 'schedules'],
    });
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: {
        id,
      },
      relations: ['category', 'schedules'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);

    const { categoryId, schedules, ...storeData } = updateStoreDto;

    if (categoryId) {
      const category =
        await this.categoriesService.findParentCategory(categoryId);

      store.category = category;
    }

    if (schedules) {
      await this.storeScheduleRepository.delete({
        store: {
          id: store.id,
        },
      });

      store.schedules = schedules.map((schedule) =>
        this.storeScheduleRepository.create({
          ...schedule,
          store,
        }),
      );
    }

    Object.assign(store, storeData);

    return this.storeRepository.save(store);
  }

  async changeStatus(id: string, status: StoreStatus): Promise<Store> {
    const store = await this.findOne(id);

    store.status = status;

    return this.storeRepository.save(store);
  }
}
