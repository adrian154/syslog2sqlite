const Database = require("better-sqlite3");
const dgram = require("dgram");

// start server
const server = dgram.createSocket("udp6");
server.bind(process.env.SYSLOG_PORT);

server.on("error", console.error);

server.on("message", msg => {
    
    const str = msg.toString("utf-8");
    const object = JSON.parse(str.slice(str.indexOf('{')));
    console.log(object);

});