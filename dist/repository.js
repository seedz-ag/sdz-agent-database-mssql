"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdz_agent_types_1 = require("sdz-agent-types");
class SQLRepository extends sdz_agent_types_1.AbstractRepository {
    execute(query, page, limit) {
        const statement = [
            this.buildQuery(query),
            "undefined" !== typeof page && limit ? `ORDER BY	(SELECT NULL) OFFSET ${page * limit} ROWS FETCH NEXT ${limit} ROWS ONLY` : null,
        ]
            .filter((item) => !!item)
            .join(" ");
        return this.getConnector().execute(statement);
    }
    async count(entity) {
        const resultSet = await this.execute(`SELECT COUNT (*) AS total FROM (${this.buildQuery(this.loadFile(entity))}) as tab1`);
        const obj = {};
        Object.keys(resultSet).map((key) => obj[key.toLowerCase()] = resultSet[key]);
        return obj[0].total;
    }
}
exports.default = SQLRepository;
