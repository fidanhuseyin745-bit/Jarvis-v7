'use strict';

const Run = require('./run');
const Help = require('./help');
const Git = require('./git');
const Status = require('./status');

class Registry {

    constructor(projects, builder) {

        this.projects = projects;
        this.builder = builder;

        this.run = new Run();
        this.help = new Help();
        this.git = new Git();
        this.status = new Status();

    }

    async execute(input) {

        switch (input.toLowerCase()) {

            case 'yardım':
            case 'help':
                this.help.show();
                return;

            case 'durum':
            case 'status':
                this.status.show();
                return;

            case 'çalıştır':
            case 'run':
                return this.run.execute(
                    this.projects.getCurrent()
                );

            case 'git':
                return await this.git.push(
                    this.projects.getCurrent()
                );

            default:
                return await this.builder.build(input);

        }

    }

}

module.exports = Registry;
