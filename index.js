const Database = require("better-sqlite3");
const dgram = require("dgram");

// to maximize INSERTs/second, batch all INSERTs received within a given interval into a single transaction
// this makes a *huge* difference!
const TRANSACTION_INTERVAL = 5000;

// make database
const db = new Database("requests.db");
db.exec(`CREATE TABLE IF NOT EXISTS requests (
    timestamp INTEGER NOT NULL,
    requestLen INTEGER NOT NULL,
    status INTEGER NOT NULL,
    remoteAddr STRING NOT NULL,
    requestMethod STRING NOT NULL,
    requestUri STRING NOT NULL,
    protocol STRING NOT NULL,
    referrer STRING NOT NULL,
    userAgent STRING NOT NULL
)`);

const insertStmt = db.prepare("INSERT INTO requests (timestamp, requestLen, status, remoteAddr, requestMethod, requestUri, protocol, referrer, userAgent) VALUES (:timestamp, :requestLen, :status, :remoteAddr, :requestMethod, :requestUri, :protocol, :referrer, :userAgent)");

// start server
const server = dgram.createSocket("udp6");

server.on("error", console.error);
server.on("listening", () => console.log("Listening on port " + process.env.SYSLOG_PORT));

// periodically commit transaction
let inTransaction = false;
setInterval(() => {
    if(inTransaction) {
        db.prepare("COMMIT").run();
    }
}, TRANSACTION_INTERVAL);

server.on("message", msg => {
    
    const str = msg.toString("utf-8");
    const object = JSON.parse(str.slice(str.indexOf('{')));

    if(!inTransaction) {
        db.prepare("BEGIN").run();
        inTransaction = true;
    }

    insertStmt.run(object);

});

server.bind(process.env.SYSLOG_PORT);