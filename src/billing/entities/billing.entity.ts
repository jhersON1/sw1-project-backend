import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ValidPlans, ValidPrices } from '../interfaces';

@Entity('billing')
export class Billing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.billing)
  @JoinColumn()
  user: User;

  @Column({ type: 'enum', enum: ValidPlans, default: ValidPlans.free })
  plan: string;

  @Column({ type: 'enum', enum: ValidPrices, default: ValidPrices.FREE })
  price: number;

  @Column({ type: 'int', default: 10 })
  imageQuantity: number;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  paymentMethod: string;

  @Column({ type: 'text', nullable: true })
  billingHistory: string;
}
