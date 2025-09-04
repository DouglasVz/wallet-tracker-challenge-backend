import { Injectable, BadRequestException } from '@nestjs/common';
import { ethers } from 'ethers';
import axios from 'axios';

@Injectable()
export class TokenService {
  private provider: ethers.Provider;

    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL); // e.g. Sepolia
    }

    async getTokenBalance(walletAddress: string, tokenAddress: string): Promise<{balance:string, symbol:string, name:string}> {
        const abi = [
        'function balanceOf(address) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)',
        'function name() view returns (string)',
        ];

        const contract = new ethers.Contract(tokenAddress, abi, this.provider);

        const [balance, decimals, name, symbol] = await Promise.all([
        contract.balanceOf(walletAddress),
        contract.decimals(),
        contract.name(),
        contract.symbol(),
        ]);

        const formatted = ethers.formatUnits(balance, decimals);
        return {
            balance: formatted,
            symbol,
            name
        };
    }

    async getTokenTransfers(walletAddress: string, contractAddress: string): Promise<any[]> {
        const abi = [
            'event Transfer(address indexed from, address indexed to, uint256 value)',
        ];
        try {
            const contract = new ethers.Contract(contractAddress, abi, this.provider);
            const latestBlock = await this.provider.getBlockNumber();
            const fromBlock = latestBlock - 9;
            const toBlock = latestBlock;

            const filter = contract.filters.Transfer(null, null);
            const logs = await contract.queryFilter(filter, fromBlock, toBlock); 

            const transfers = await Promise.all(
                logs.map(async log => {
                    const [ from, to, value ] = (log as ethers.EventLog).args;
                    const block = await this.provider.getBlock(log.blockNumber);

                    const direction = walletAddress.toLowerCase() === from.toLowerCase()
                    ? 'sent'
                    : walletAddress.toLowerCase() === to.toLowerCase()
                    ? 'received'
                    : 'other';

                    return {
                        txHash: log.transactionHash,
                        timestamp: block ? new Date(block.timestamp * 1000).toISOString() : 'unknown',
                        from,
                        to,
                        amount: ethers.formatUnits(value, 6),
                        direction,
                    };
                })
            );
            // console.log(transfers)
            //Now you can safely filter:
            // const filteredTransfers = transfers.filter(tx =>
            //     tx.from.toLowerCase() === walletAddress.toLowerCase() ||
            //     tx.to.toLowerCase() === walletAddress.toLowerCase()
            // );
            return transfers;
        }catch(error) {
            throw new BadRequestException({
                message: 'Failed to fetch token transfers',
                details: error?.message || 'Unknown error',
            });
        }

    }

    async getTokenPriceUSD(contractAddress: string): Promise<number> {
    try {
        const tokenAddress = contractAddress?.toLowerCase();
        if (!tokenAddress) throw new Error('Token address not set');

        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`);

        const normalizedKey = Object.keys(response.data).find(
            key => key.toLowerCase() === tokenAddress?.toLowerCase()
        );
        const price = normalizedKey ? response.data[normalizedKey].usd : null;
        // const price = response.data[tokenAddress]?.usd;
        if (!price) throw new Error('Price not found');

        return price;
    } catch (error) {
        throw new BadRequestException({
            message: 'Failed to fetch token price',
            details: error?.message || 'Unknown error',
        });
    }
    }


}