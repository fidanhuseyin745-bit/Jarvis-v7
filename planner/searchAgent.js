'use strict';

class SearchAgent {

    async execute(input) {

        return {
            action: 'search',
            query: input,
            status: 'ok'
        };

    }

}

module.exports = new SearchAgent();
