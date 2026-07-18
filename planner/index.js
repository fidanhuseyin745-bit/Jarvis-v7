'use strict';

const PlannerManager = require('./plannerManager');
const PlanBuilder = require('./planBuilder');

const manager = new PlannerManager();
const builder = new PlanBuilder();

manager.register('search', require('./searchAgent'));
manager.register('coder', require('./coderAgent'));

module.exports = {

    async run(text) {

        const plan = builder.build(text);

        return await manager.execute(plan);

    }

};
