class AliRequest {

    constructor() {
    }

    getAddAliRequestSQL() {
        let sql = `INSERT INTO ali_requests SET ?`;
        return sql;
    }

    static getAliRequestByIdSQL() {
        let sql = `SELECT * FROM ali_requests WHERE id=?`;
        return sql;
    }

    static deleteAliRequestByIdSQL() {
        let sql = `DELETE FROM ali_requests WHERE id=?`;
        return sql;
    }

    static getAllAliRequestSQL() {
        let sql = `SELECT * FROM ali_requests`;
        return sql;
    }
}

module.exports = AliRequest;
