import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Wallet } from "../../../portfolio/entities/wallet/wallet.entity";
import { PortfolioSnapshot } from "../../../portfolio/entities/portfolio-snapshots/portfolio-snapshots.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Wallet, wallet => wallet.user) 
    wallets: Wallet[];

    @OneToMany(() => PortfolioSnapshot, portfolioSnapshot => portfolioSnapshot.user)
    snapshots: PortfolioSnapshot[]

}