import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { StoreSchedule } from './entities/store-schedule.entity';
import { CategoriesModule } from 'src/modules/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Store, StoreSchedule]), CategoriesModule],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
