//const Database = require("better-sqlite3");
const dgram = require("dgram");

// start server
const server = dgram.createSocket("udp6");

server.on("error", console.error);

server.on("message", msg => {
    
    const str = msg.toString("utf-8");
    const object = JSON.parse(str.slice(str.indexOf('{')));
    console.log(object);

});

server.on("listening", () => console.log("Listening on port " + process.env.SYSLOG_PORT));
server.bind(process.env.SYSLOG_PORT);
