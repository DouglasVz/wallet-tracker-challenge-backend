import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../../auth/entities/user/user.entity';
import { Transaction } from '../transactions/transactions.entity';

@Entity()
export class Wallet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    address: string;

    @ManyToOne(() => User, user => user.wallets)
    user: User;

    @OneToMany(() => Transaction, transaction => transaction.wallet)
    transactions: Transaction[]

}

