import {
  ConnectorInterface,
  DatabaseRow,
  ConfigDatabaseInterface,
} from "sdz-agent-types";

import mssql, { ConnectionPool } from "mssql";

export default class Connector implements ConnectorInterface {
  private connection: ConnectionPool;
  private config: any;

  constructor(config: ConfigDatabaseInterface) {
    this.setConfig(config);
  }

  async connect(): Promise<any> {
    if (!this.connection) {
      try {
        return (this.connection = await mssql.connect({
          user: this.config.username,
          password: this.config.password,
          server: this.config.host,
          database: this.config.schema,
          port: Number(this.config.port),
          requestTimeout: 999999,
          options: {
            trustServerCertificate: true,
          },
        }));
      } catch (e) {
        console.log(e);
      }
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.close();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async execute(query: string): Promise<DatabaseRow[]> {
    let resultSet: DatabaseRow[] = [];
    if (!this.connection) {
      await this.connect();
    }
    try {
      const response = await this.connection.query(query);
      if (response) {
        resultSet = response.recordset;
      }
    } catch (e) {
      console.log(e);
    }
    return resultSet;
  }

  private setConfig(config: any): this {
    this.config = config;
    return this;
  }
}
