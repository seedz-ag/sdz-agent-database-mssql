import { AbstractRepository } from "sdz-agent-types";

export default class SQLRepository extends AbstractRepository {
    execute(query: string, page?: number, limit?: number): Promise<any> {
        const statement = [
          query,
          "undefined" !== typeof page && limit ? `ORDER BY	(SELECT NULL) OFFSET ${page * limit} ROWS FETCH NEXT ${limit} ROWS ONLY` : null,
        ]
        
          .filter((item) => !!item)
          .join(" ");
        return this.getConnector().execute(statement);
      }

      async count(entity: string): Promise<number> {
        const resultSet = await this.execute(`SELECT COUNT (*) AS total FROM (${this.loadFile(entity)}) as tab1`);
        const obj:any = {}
        Object.keys(resultSet).map((key) =>  obj[key.toLowerCase()] = resultSet[key])
        return obj.total;
      }
}