import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovetransactionIndex1756998383710 implements MigrationInterface {
    name = 'RemovetransactionIndex1756998383710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0deaa0ee5092d45fac99139de7\` ON \`transactions\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_0deaa0ee5092d45fac99139de7\` ON \`transactions\` (\`tx_hash\`)`);
    }

}
