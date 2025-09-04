import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { Wallet } from './entities/wallet/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './services/token.service';
import { Transaction } from './entities/transactions/transactions.entity';
import { PortfolioSnapshot } from './entities/portfolio-snapshots/portfolio-snapshots.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction, PortfolioSnapshot])],
  providers: [PortfolioService, TokenService],
  controllers: [PortfolioController]
})
export class PortfolioModule {}
