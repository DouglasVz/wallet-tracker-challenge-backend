import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { User } from '../../../auth/entities/user/user.entity';

@Entity('portfolio_snapshots')
@Index(['user', 'created_at'])
export class PortfolioSnapshot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.snapshots, { onDelete: 'CASCADE' })
  user: User;

  @Column('numeric', { precision: 20, scale: 2 })
  total_value_usd: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
