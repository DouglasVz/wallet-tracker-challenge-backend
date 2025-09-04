import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionPortfoliosnapCreateTable1756947143755 implements MigrationInterface {
    name = 'TransactionPortfoliosnapCreateTable1756947143755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`portfolio_snapshots\` (\`id\` int NOT NULL AUTO_INCREMENT, \`total_value_usd\` decimal(20,2) NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` int NULL, INDEX \`IDX_b05bf5e804d6e5cc1123293727\` (\`userId\`, \`created_at\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tx_hash\` varchar(66) NOT NULL, \`from_address\` varchar(42) NOT NULL, \`to_address\` varchar(42) NOT NULL, \`amount\` decimal(38,18) NOT NULL, \`direction\` varchar(10) NOT NULL, \`created_at\` timestamp NOT NULL, \`walletId\` int NULL, UNIQUE INDEX \`IDX_721d88673fa46c47764a34f2a6\` (\`walletId\`, \`tx_hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`portfolio_snapshots\` ADD CONSTRAINT \`FK_35bee2c1e38cf9298c2a5033406\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_a88f466d39796d3081cf96e1b66\` FOREIGN KEY (\`walletId\`) REFERENCES \`wallet\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_a88f466d39796d3081cf96e1b66\``);
        await queryRunner.query(`ALTER TABLE \`portfolio_snapshots\` DROP FOREIGN KEY \`FK_35bee2c1e38cf9298c2a5033406\``);
        await queryRunner.query(`DROP INDEX \`IDX_721d88673fa46c47764a34f2a6\` ON \`transactions\``);
        await queryRunner.query(`DROP TABLE \`transactions\``);
        await queryRunner.query(`DROP INDEX \`IDX_b05bf5e804d6e5cc1123293727\` ON \`portfolio_snapshots\``);
        await queryRunner.query(`DROP TABLE \`portfolio_snapshots\``);
    }

}
