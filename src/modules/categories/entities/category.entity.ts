import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Store } from '../../../store/entities/store.entity';

@Entity('categories')
export class Category {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'Mujer' })
  @Column({ length: 100 })
  name!: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive!: boolean;

  // ─── Relación jerárquica padre/hijos ──────────────────────────
  @ApiProperty({ nullable: true })
  @Column({ nullable: true, name: 'parent_id' })
  parentId!: string | null;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent!: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];

  // ─── Auditoría ─────────────────────────────────────────────────
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' }) // soft delete
  deletedAt!: Date | null;

  @OneToMany(() => Store, (store) => store.category)
  stores!: Store[];
}
