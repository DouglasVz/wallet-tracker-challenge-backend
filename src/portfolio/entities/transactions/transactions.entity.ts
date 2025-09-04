import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';

@Entity('transactions')
@Index(['tx_hash', 'wallet', 'log_index'], {unique: true})
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wallet, wallet => wallet.transactions, { onDelete: 'CASCADE' })
  wallet: Wallet;

  @Column({ length: 66 })
  tx_hash: string;

  @Column({ type: 'int' })
  log_index: number;

  @Column({ length: 42 })
  from_address: string;

  @Column({ length: 42 })
  to_address: string;

  @Column('numeric', { precision: 38, scale: 18 })
  amount: string;

  @Column({ length: 10 })
  direction: 'sent' | 'received';

  @Column({ type: 'timestamp' })
  created_at: Date;
}
