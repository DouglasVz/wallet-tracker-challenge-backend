import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexedColumnsTransactions1756998612409 implements MigrationInterface {
    name = 'AddIndexedColumnsTransactions1756998612409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_ff4e41d516ecb646faaeb088b1\` ON \`transactions\` (\`tx_hash\`, \`walletId\`, \`log_index\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_ff4e41d516ecb646faaeb088b1\` ON \`transactions\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

}
