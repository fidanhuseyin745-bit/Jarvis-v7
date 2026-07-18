'use strict';

class PlanBuilder {

    build(text) {

        text = text.toLowerCase();

        const plan = [];

        if (
            text.includes('araştır') ||
            text.includes('internette')
        ) {
            plan.push({
                agent: 'search',
                input: text
            });
        }

        if (
            text.includes('express') ||
            text.includes('blog') ||
            text.includes('proje') ||
            text.includes('kod')
        ) {
            plan.push({
                agent: 'coder',
                input: text
            });
        }

        if (
            text.includes('github')
        ) {
            plan.push({
                agent: 'github',
                input: text
            });
        }

        return plan;

    }

}

module.exports = PlanBuilder;
