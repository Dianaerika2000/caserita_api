import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { Store } from './store.entity';

@Entity('store_schedules')
@Unique(['store', 'dayOfWeek'])
export class StoreSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'day_of_week',
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @Column({
    name: 'open_time',
    type: 'time',
    nullable: true,
  })
  openTime: string;

  @Column({
    name: 'close_time',
    type: 'time',
    nullable: true,
  })
  closeTime: string;

  @ManyToOne(() => Store, (store) => store.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'store_id',
  })
  store: Store;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
