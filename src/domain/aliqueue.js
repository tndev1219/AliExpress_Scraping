class AliQueue {

    constructor(){

    }

    getAddAliQueueSQL() {
        let sql = `INSERT INTO ali_queue SET ?`;
        return sql;
    }

    static getAliQueueByIdSQL() {
        let sql = `SELECT * FROM ali_queue WHERE id=?`;
        return sql;
    }

    static getAliQueueByFieldNameSQL(sql) {
        return sql;
    }

    static getAliQueueSQL() {
        let sql = `SELECT * FROM ali_queue WHERE product_code=? AND language=? AND product_info_payload IS NULL`;
        return sql;
    }

    static updateAliQueueByFieldNameSQL(fields, condition){
        let sql = `UPDATE ali_queue SET ${fields} WHERE ${condition}`;
        return sql;
    }

    static deleteAliQueueByIdSQL() {
        let sql = `DELETE FROM ali_queue WHERE id=?`;
        return sql;
    }

    static getAllAliQueueSQL() {
        let sql = `SELECT * FROM ali_queue`;
        return sql;
    }    
}

module.exports = AliQueue;