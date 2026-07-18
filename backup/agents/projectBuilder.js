'use strict';

const fs=require('fs');
const path=require('path');

class ProjectBuilder{

constructor(projects){
this.projects=projects;
}

build(prompt){

if(!this.projects.hasProject())
this.projects.create('project-'+Date.now());

const dir=this.projects.getCurrent();

let template='index.js';

const p=prompt.toLowerCase();

if(p.includes('express')) template='express.js';
else if(p.includes('react')) template='react.js';
else if(p.includes('flask')) template='flask.py';
else if(p.includes('fastapi')) template='fastapi.py';

const src=path.join(__dirname,'..','templates',template);

const code=fs.readFileSync(src,'utf8');

let target='index.js';

if(template==='flask.py') target='app.py';
if(template==='fastapi.py') target='main.py';

fs.writeFileSync(path.join(dir,target),code);

fs.writeFileSync(
path.join(dir,'README.md'),
fs.readFileSync(
path.join(__dirname,'..','templates','readme.md'),
'utf8'
)
);

fs.writeFileSync(
path.join(dir,'.gitignore'),
fs.readFileSync(
path.join(__dirname,'..','templates','gitignore'),
'utf8'
)
);

if(template==='express.js'){

fs.writeFileSync(
path.join(dir,'package.json'),
JSON.stringify({
name:'jarvis-app',
version:'1.0.0',
main:'index.js',
scripts:{
start:'node index.js'
},
dependencies:{
express:'^5.1.0'
}
},null,2)
);

}

console.log('✅ Proje oluşturuldu.');

}

}

module.exports=ProjectBuilder;
