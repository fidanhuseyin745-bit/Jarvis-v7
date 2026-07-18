const express = require("express");

const app = express();

const server = app.listen(3000, () => {
    console.log("SERVER STARTED");
    console.log("Listening:", server.listening);
});

setInterval(() => {
    console.log("Alive", new Date().toLocaleTimeString());
}, 5000);

process.on("exit", (code) => {
    console.log("EXIT:", code);
});

process.on("beforeExit", (code) => {
    console.log("BEFORE EXIT:", code);
});
