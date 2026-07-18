'use strict';

const simpleGit=require('simple-git');

class Git{

constructor(project){

this.git=simpleGit(project);

}

async init(){

await this.git.init();

}

async add(){

await this.git.add('.');

}

async commit(msg){

await this.git.commit(msg);

}

}

module.exports=Git;
