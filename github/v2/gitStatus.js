"use strict";
const { execSync } = require("child_process");

module.exports = {
  status() {
    try {
      return execSync("git status", { encoding: "utf8" });
    } catch (e) {
      return e.message;
    }
  }
};
