const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "unimarket"
});

db.connect((err) => {
    if (err) {
        console.log("Errore di connessione DB", err);
    } else {
        console.log("Connesso a MySQL");
    }
});

module.exports = db;