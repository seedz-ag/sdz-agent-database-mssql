"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdz_agent_types_1 = require("sdz-agent-types");
class SQLRepository extends sdz_agent_types_1.AbstractRepository {
    execute(query, page, limit) {
        const statement = [
            query,
            "undefined" !== typeof page && limit ? `ORDER BY	(SELECT NULL) OFFSET ${page * limit} ROWS FETCH NEXT ${limit} ROWS ONLY` : null,
        ]
            .filter((item) => !!item)
            .join(" ");
        return this.getConnector().execute(statement);
    }
    async count(entity) {
        const resultSet = await this.execute(`SELECT COUNT (*) AS total FROM (${this.loadFile(entity)}) as tab1`);
        const obj = {};
        Object.keys(resultSet).map((key) => obj[key.toLowerCase()] = resultSet[key]);
        return obj.total;
    }
}
exports.default = SQLRepository;
