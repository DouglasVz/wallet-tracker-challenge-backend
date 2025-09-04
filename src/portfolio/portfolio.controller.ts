import { Controller, Post, Get, Request, Param, Delete, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { TokenService } from './services/token.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddWalletDto } from './dto/add-wallet.dto';

ApiTags('Portfolio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
    constructor(
        private readonly portfolioService: PortfolioService,
        private readonly tokenService: TokenService
    ) {}

    @Post('wallets')
    @ApiOperation({ summary: 'Add a wallet to the user portfolio' })
    @ApiResponse({ status: 201, description: 'Wallest added successfully',
        schema: {
            type: 'object',
            example: {
                message: "Wallest added successfully",
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Invalid wallet address or already exists' })
    async addWallet(@Body() dto: AddWalletDto, @Request() req) {
        return this.portfolioService.addWallet(req.user.userId, dto.address);
    }

    @Post('snapshots')
    @ApiOperation({ summary: 'Create a portfolio snapshot for the authenticated user' })
    @ApiResponse({ status: 201, description: 'Snapshot created successfully' })
        async createSnapshot(@Request() req) {
        return this.portfolioService.createSnapshot(req.user.userId);
    }

    @Get('wallets')
    @ApiOperation({ summary: 'Get all wallets for the authenticated user' })
    @ApiResponse({ status: 200, description: 'List of wallets returned',
        schema: {
            type: 'Array of Objects',
            example: [
                {
                    id: "number",
                    address: "string"
                }
            ]
        }
    })
    async getWallets(@Request() req) {
        return this.portfolioService.getWallets(req.user.userId);
    }

    @Get('wallets/:address')
    @ApiOperation({ summary: 'Get a wallet by address.' })
    @ApiResponse({ status: 200, description: 'Wallet returned', 
        schema: {
            type: 'Object',
            example: {
                id: "number",
                address: "string"
            }
        }
    })
    async getMyWalletByAddress(
        @Param('address') address: string,
        @Request() req,
    ) {
        const userId = req.user.userId;
        return this.portfolioService.getWalletByAddress(address, userId);
    }

    @Get('wallets/:id/balance')
    @ApiOperation({ summary: 'Get ERC20 token balance for a wallet' })
    @ApiResponse({
        status: 200,
        description: 'Token balance returned',
        schema: {
            type: 'object',
            example: {
                balance: "0.00",
                symbol: "USDC",
                name: "USDC"
            },
        },
    })
    async getTokenBalance(@Param('id') walletId: number, @Request() req) {
        const wallet = await this.portfolioService.getWalletById(req.user.userId, walletId);
        return this.tokenService.getTokenBalance(wallet.address, process.env.ERC20_TOKEN_ADDRESS ?? '');
    }

    @Get('wallets/:id/transactions')
    @ApiOperation({ summary: 'Sync and store ERC20 transactions for a wallet' })
    @ApiResponse({ 
        status: 201, 
        description: 'Transactions stored successfully', 
        schema: {
                type: 'Array of objects',
                example: [{
                    tx_hash: 'string',
                    from_address: 'string',
                    to_address: 'string',
                    amount: 'number',
                    direction: 'send | received',
                    created_at: 'MM/DD/YYYY HH:mm:ss',
                } ] 
            } 
        })
        async syncTransactions(@Param('id') walletId: number, @Request() req) {
        return this.portfolioService.syncTransactions(req.user.userId, walletId);
    }

    @Delete('wallets/:id')
    @ApiOperation({ summary: 'Remove a wallet from the user portfolio' })
    @ApiResponse({ status: 200, description: 'Wallet removed successfully',
        schema: {
            type: 'Object',
            example: {
                address: "0X100034567788999087000000",
                message: "Wallet removed successfully."
            }
        }
     })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    async removeWallet(@Param('id') id: number, @Request() req) {
        return this.portfolioService.removeWallet(req.user.userId, id);
    }
}
