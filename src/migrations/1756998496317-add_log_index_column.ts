import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLogIndexColumn1756998496317 implements MigrationInterface {
    name = 'AddLogIndexColumn1756998496317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`log_index\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD \`walletId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`transactions\` ADD CONSTRAINT \`FK_a88f466d39796d3081cf96e1b66\` FOREIGN KEY (\`walletId\`) REFERENCES \`wallet\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_a88f466d39796d3081cf96e1b66\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` CHANGE \`created_at\` \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`walletId\``);
        await queryRunner.query(`ALTER TABLE \`transactions\` DROP COLUMN \`log_index\``);
    }

}
