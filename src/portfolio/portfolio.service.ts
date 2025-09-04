import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet/wallet.entity';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transactions/transactions.entity';
import { TokenService } from './services/token.service';
import { PortfolioSnapshot } from './entities/portfolio-snapshots/portfolio-snapshots.entity';

@Injectable()
export class PortfolioService {
    constructor(
        @InjectRepository(Wallet)
        private readonly walletRepo: Repository<Wallet>,
        private readonly tokenService: TokenService,
        @InjectRepository(Transaction)
        private readonly txRepo: Repository<Transaction>,
        @InjectRepository(PortfolioSnapshot)
        private readonly snapshotRepo: Repository<PortfolioSnapshot>
    ) {}

    async addWallet(userId: number, address: string) {
        const wallet = this.walletRepo.create({
            address,
            user: { id: userId },
        });

        try {
            return await this.walletRepo.save(wallet);
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new HttpException('Wallet address already exists', HttpStatus.CONFLICT);
            }

            console.error('Database error:', error);
            throw new HttpException('Failed to add wallet', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    async removeWallet(userId: number, walletId: number) {
        const wallet = await this.walletRepo.findOne({ where: { id: walletId, user: { id: userId } } });
        if (!wallet) throw new NotFoundException('Wallet not found');
        const removed = this.walletRepo.remove(wallet);
        if (!removed) throw new NotFoundException('Wallet not removed');
        return {
            address: wallet.address,
            message: "Wallet removed successfully."
        }
    }

    async getWallets(userId: number) {
        return this.walletRepo.find({
            where: { user: { id: userId } },
            order: { id: 'ASC' }, // Optional: sort by ID
        });
    }

    async getWalletById(userId: number, walletId: number): Promise<Wallet> {
        const wallet = await this.walletRepo.findOne({
            where: { id: walletId },
            relations: ['user']
        });
        if (!wallet) throw new NotFoundException('Wallet not found');
        if (wallet.user?.id !== userId) {
            throw new HttpException('This wallet does not belong to the logged-in user.', HttpStatus.FORBIDDEN);
        }
        return wallet;
    }

    async getWalletByAddress(address: string, userId: number) {
        const wallet = await this.walletRepo.findOne({
            where: { address },
            relations: ['user'],
        });
        if (!wallet) throw new NotFoundException('Wallet not found');
        if (wallet.user?.id !== userId) {
            throw new HttpException('This wallet does not belong to the logged-in user.', HttpStatus.FORBIDDEN);
        }
        return wallet;
    }

    async syncTransactions(userId: number, walletId: number, contractAddress: string): Promise<Transaction[]> {
        const wallet = await this.walletRepo.findOne({
            where: { id: walletId, user: { id: userId } },
        });
        if (!wallet) throw new NotFoundException('Wallet not found');

        const transfers = await this.tokenService.getTokenTransfers(wallet.address, contractAddress);

        const saved: Transaction[] = [];

        for (const tx of transfers) {
            const exists = await this.txRepo.findOne({ where: { tx_hash: tx.txHash, wallet: { id: wallet.id } } });
            const transaction = {
                wallet,
                tx_hash: tx.txHash,
                from_address: tx.from,
                to_address: tx.to,
                amount: tx.amount,
                direction: tx.direction,
                created_at: new Date(tx.timestamp),
            }
            if (!exists) {
                this.txRepo.create(transaction);
                saved.push(await this.txRepo.save(transaction));
            }else {
                saved.push(exists)
            }
            
            
        }

        return saved;
    }

    async createSnapshot(userId: number, contractAddress: string): Promise<PortfolioSnapshot> {
        const wallets = await this.walletRepo.find({ where: { user: { id: userId } } });
        const tokenPrice = await this.tokenService.getTokenPriceUSD(contractAddress);

        let totalValue = 0;

        for (const wallet of wallets) {
            const balanceStr = await this.tokenService.getTokenBalance(wallet.address, contractAddress);
            const {balance}= balanceStr;
            totalValue += parseFloat(balance) * tokenPrice;
        }

        const snapshot = this.snapshotRepo.create({
            user: { id: userId },
            total_value_usd: totalValue.toFixed(2),
        });

        return this.snapshotRepo.save(snapshot);
    }
}
