class User {

    constructor(){

    }

    getAddUserSQL() {
        let sql = `INSERT INTO users SET ?`;
        return sql;
    }

    static getUserByIdSQL() {
        let sql = `SELECT * FROM users WHERE id=?`;
        return sql;
    }

    static getUserByFieldNameSQL(fieldName) {
        let sql = `SELECT * FROM users WHERE ${fieldName}=?`;
        return sql;
    }

    static updateUserByFieldNameSQL(fields, condition){
        let sql = `UPDATE users SET ${fields} WHERE ${condition}`;
        return sql;
    }

    static deleteUserByIdSQL() {
        let sql = `DELETE FROM users WHERE id=?`;
        return sql;
    }

    static getAllUserSQL() {
        let sql = `SELECT * FROM users`;
        return sql;
    }    
}

module.exports = User;