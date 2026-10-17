const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
let db = null;

const getDb = async () => {
    if (db) return db;
    const SQL = await initSqlJs();
    if (fs.existsSync(dbPath)) {
        const filebuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(filebuffer);
    } else {
        db = new SQL.Database();
    }
    return db;
};

const saveDb = async () => {
    const dbInstance = await getDb();
    const data = dbInstance.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
};

module.exports = { getDb, saveDb };