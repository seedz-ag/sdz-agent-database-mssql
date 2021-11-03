"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mssql_1 = __importDefault(require("mssql"));
class Connector {
    constructor(config) {
        this.setConfig(config);
    }
    async connect() {
        if (!this.connection) {
            try {
                return this.connection = await mssql_1.default.connect({
                    user: this.config.username,
                    password: this.config.password,
                    server: this.config.host,
                    database: this.config.schema,
                    port: this.config.port,
                    options: {
                        trustServerCertificate: true,
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    async close() {
        if (this.connection) {
            try {
                await this.connection.close();
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    async execute(query) {
        let resultSet = [];
        if (!this.connection) {
            await this.connect();
        }
        try {
            const response = await this.connection.query(query);
            if (response) {
                resultSet = response.recordset;
            }
        }
        catch (e) {
            console.log(e);
        }
        return resultSet;
    }
    setConfig(config) {
        this.config = config;
        return this;
    }
}
exports.default = Connector;
