import { MigrationInterface, QueryRunner } from "typeorm";

export class WalletTableCreated1756929688868 implements MigrationInterface {
    name = 'WalletTableCreated1756929688868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`wallet\` (\`id\` int NOT NULL AUTO_INCREMENT, \`address\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_1dcc9f5fd49e3dc52c6d2393c5\` (\`address\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`wallet\` ADD CONSTRAINT \`FK_35472b1fe48b6330cd349709564\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wallet\` DROP FOREIGN KEY \`FK_35472b1fe48b6330cd349709564\``);
        await queryRunner.query(`DROP INDEX \`IDX_1dcc9f5fd49e3dc52c6d2393c5\` ON \`wallet\``);
        await queryRunner.query(`DROP TABLE \`wallet\``);
    }

}
