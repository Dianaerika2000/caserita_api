import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { StoreStatus } from '../enums/store-status.enum';
import { PaymentType } from '../enums/payment-type.enum';
import { SaleType } from '../enums/sale-type.enum';

import { StoreSchedule } from './store-schedule.entity';
import { Category } from '../../modules/categories/entities/category.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column()
  cellphone: string;

  @Column({
    name: 'gallery_name',
  })
  galleryName: string;

  @Column({
    name: 'store_number',
  })
  storeNumber: string;

  @Column({
    name: 'location_link',
    nullable: true,
  })
  locationLink: string;

  @Column({
    type: 'enum',
    enum: StoreStatus,
    default: StoreStatus.ACTIVE,
  })
  status: StoreStatus;

  @Column({
    name: 'payment_types',
    type: 'enum',
    enum: PaymentType,
    array: true,
  })
  paymentTypes: PaymentType[];

  @Column({
    name: 'sale_types',
    type: 'enum',
    enum: SaleType,
    array: true,
  })
  saleTypes: SaleType[];

  @Column({
    name: 'has_delivery',
    default: false,
  })
  hasDelivery: boolean;

  @Column({
    default: false,
  })
  verified: boolean;

  /*
   * CATEGORY RELATION
   */
  @ManyToOne(() => Category, (category) => category.stores, {
    nullable: false,
  })
  @JoinColumn({
    name: 'category_id',
  })
  category: Category;

  /*
   * STORE SCHEDULES
   */
  @OneToMany(() => StoreSchedule, (schedule) => schedule.store, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  schedules: StoreSchedule[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
