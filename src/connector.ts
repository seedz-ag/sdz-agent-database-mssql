import {
  ConnectorInterface,
  DatabaseRow,
} from "sdz-agent-types";

import  mssql, { ConnectionPool  } from "mssql";

export default class Connector implements ConnectorInterface {
  private connection: ConnectionPool;
  private config: any;

  constructor(config: any) {
    this.setConfig(config);
  }

  async connect(): Promise<any> {
    if (!this.connection) {
      try {
        console.log(this.config)
        return this.connection = await mssql.connect(this.config);
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
