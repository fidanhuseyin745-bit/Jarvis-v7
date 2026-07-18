'use strict';

const providers=require('./providers');

async function search(q){

const tasks=[

providers.wikipedia(q),

providers.github(q),

providers.youtube(q),

providers.reddit(q),

providers.stackoverflow(q),

providers.npm(q),

providers.news(q),
providers.weather(q),
providers.currency()

];

const results=await Promise.allSettled(tasks);

let out=[];

for(const r of results){

if(r.status==='fulfilled'){

out.push(...r.value);

}

}

const map=new Map();

for(const item of out){

if(item.url&&!map.has(item.url)){

map.set(item.url,item);

}

}

return [...map.values()].slice(0,20);

}

module.exports={search};
