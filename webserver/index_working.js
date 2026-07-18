const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Sunucu çalışıyor");
});

app.listen(3000, () => {
    console.log("🌐 Jarvis Web API http://localhost:3000");
});

setInterval(() => {}, 1000);
