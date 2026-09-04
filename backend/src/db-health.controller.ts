import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

type DatabaseInfo = {
  version: string;
  databaseName: string;
};

@Controller('db-health')
export class DbHealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async checkDatabase() {
    const rows = await this.dataSource.query<DatabaseInfo[]>(
      'SELECT VERSION() AS version, DATABASE() AS databaseName',
    );

    return {
      connected: true,
      version: rows[0].version,
      database: rows[0].databaseName,
    };
  }
}
