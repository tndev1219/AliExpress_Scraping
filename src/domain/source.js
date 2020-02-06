class Source {

    constructor() {
        
    }

    getAddSourceSQL() {
        let sql = `INSERT INTO sources SET ?`
        return sql;
    }

    static getSourceByIdSQL() {
        let sql = `SELECT * FROM sources WHERE id=?`;
        return sql;
    }

    static deleteSourceByIdSQL() {
        let sql = `DELETE FROM sources WHERE id=?`;
        return sql;
    }

    static getAllSourceSQL() {
        let sql = `SELECT * FROM sources`;
        return sql;
    }

    static getSourceByFieldNameSQL(fieldName) {
        let sql = `SELECT * FROM sources WHERE ${fieldName}=?`
        return sql;
    }
}

module.exports = Source