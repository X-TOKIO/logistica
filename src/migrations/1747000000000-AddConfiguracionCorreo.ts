import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConfiguracionCorreo1747000000000 implements MigrationInterface {
  name = 'AddConfiguracionCorreo1747000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ConfiguracionCorreo" (
        "ID_Config" SERIAL NOT NULL,
        "Host"      character varying(255) NOT NULL,
        "Port"      integer               NOT NULL DEFAULT 25565,
        "Usuario"   character varying(255) NOT NULL,
        "Password"  character varying(500) NOT NULL DEFAULT '',
        CONSTRAINT "PK_ConfiguracionCorreo" PRIMARY KEY ("ID_Config")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "ConfiguracionCorreo"`);
  }
}
