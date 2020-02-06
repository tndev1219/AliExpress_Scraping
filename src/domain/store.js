class Store {

    constructor() {
        
    }

    getAddStoreSQL() {
        let sql = `INSERT INTO stores SET ?`
        return sql;
    }

    static getStoreByIdSQL() {
        let sql = `SELECT * FROM stores WHERE id=?`;
        return sql;
    }

    static deleteStoreByIdSQL() {
        let sql = `DELETE FROM stores WHERE id=?`;
        return sql;
    }

    static getAllStoreSQL() {
        let sql = `SELECT * FROM stores`;
        return sql;
    }
}

module.exports = Store
