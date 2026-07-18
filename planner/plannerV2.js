"use strict";

class PlannerV2 {

  build(input = "") {

    input = input.trim();

    const tasks = [];

    if (/api/i.test(input)) {
      tasks.push("express");
      tasks.push("routes");
      tasks.push("controllers");
    }

    if (/web|site|html/i.test(input)) {
      tasks.push("frontend");
    }

    if (/test/i.test(input)) {
      tasks.push("test");
    }

    if (/git/i.test(input)) {
      tasks.push("git_commit");
    }

    if (tasks.length === 0) {
      tasks.push("project");
      tasks.push("code");
    }

    return {
      goal: input,
      tasks
    };
  }

}

module.exports = PlannerV2;
