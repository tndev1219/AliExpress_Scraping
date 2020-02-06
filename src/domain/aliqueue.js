class AliQueue {

    constructor(){

    }

    getAddAliQueueSQL() {
        let sql = `INSERT INTO ali_queue SET ?`
        return sql;
    }

    static getAliQueueByIdSQL() {
        let sql = `SELECT * FROM ali_queue WHERE id=?`;
        return sql;
    }

    static getAliQueueByFieldNameSQL(fieldName) {
        let sql = `SELECT * FROM ali_queue WHERE ${fieldName}=?`
        return sql;
    }

    static updateAliQueueByFieldNameSQL(fields, condition){
        let sql = `UPDATE ali_queue SET ${fields} WHERE ${condition}`
        return sql
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