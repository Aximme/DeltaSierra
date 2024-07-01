const mysql = require("mysql")

module.exports = async () => {

    let db = await mysql.createConnection({
        /*host:"51.83.69.163:3306",
        user:"u807_1EFb22EGyp",
        password:"^16A=e.pM@ZbOA8MJGBoHXoU",
        database:"s807_deltasierra"*/
        host:"localhost",
        user:"root",
        password:"",
        database:"deltasierra"
    })
    return db;
}