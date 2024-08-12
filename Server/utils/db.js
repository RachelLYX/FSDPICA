import mysql from 'mysql';

const con = mysql.createConnection({
    host: "127.0.0.1",   // MySQL server address, usually localhost or 127.0.0.1 for local development
    user: "root",        // MySQL username
    password: "ma0307ni", // MySQL password
    database: "employeems", // Name of the database you want to connect to
    port: 3306           // MySQL server port, usually 3306
});

console.log("Attempting to connect to the database...");

con.connect(function(err) {
    if (err) {
        console.error('Connection error:', err);
    } else {
        console.log("Connected to the database");
    }
});

console.log("Database connection attempt finished.");

export default con;

