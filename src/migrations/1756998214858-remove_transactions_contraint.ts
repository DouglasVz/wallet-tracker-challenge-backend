import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTransactionsContraint1756998214858 implements MigrationInterface {
    name = 'RemoveTransactionsContraint1756998214858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_a88f466d39796d3081cf96e1b66\``);
        await queryRunner.query(`DROP INDEX \`IDX_721d88673fa46c47764a34f2a6\` ON \`transactions\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`walletId\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD UNIQUE INDEX \`IDX_0deaa0ee5092d45fac99139de7\` (\`tx_hash\`)`);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP INDEX \`IDX_0deaa0ee5092d45fac99139de7\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`walletId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_721d88673fa46c47764a34f2a6\` ON \`transactions\` (\`walletId\`, \`tx_hash\`)`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_a88f466d39796d3081cf96e1b66\` FOREIGN KEY (\`walletId\`) REFERENCES \`wallet\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
