'use strict';

let aiManager=null;

try{
    aiManager=require('../core/aiManager');
}catch(e){}


async function summarize(query,results){

if(!results.length){

return{
query,
summary:"Sonuç bulunamadı.",
sources:[]
};

}

const sources=[];

let text="";

for(const r of results.slice(0,8)){

text+=r.title+". ";

if(r.snippet)
text+=r.snippet+". ";

sources.push({
title:r.title,
url:r.url
});

}

if(aiManager && typeof aiManager.ask==='function'){

try{

return{

query,

summary:await aiManager.ask(
"Bu internet sonuçlarını özetle:\n\n"+text
),

sources

};

}catch(e){}

}

return{

query,

summary:text.trim(),

sources

};

}

module.exports={summarize};
