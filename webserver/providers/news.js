'use strict';

const request=require('../utils/request');

module.exports=async(q)=>{

try{

const r=await request.get(
'https://news.google.com/rss/search',
{
params:{
q:q,
hl:'tr',
gl:'TR',
ceid:'TR:tr'
},
timeout:5000
}
);

const xml=r.data;

const out=[];

const re=/<item>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<link>(.*?)<\/link>/g;

let m;

while((m=re.exec(xml))&&out.length<5){

out.push({
title:m[1]
.replace(/<!\[CDATA\[/g,'')
.replace(/\]\]>/g,''),
url:m[2],
snippet:'Google News'
});

}

return out;

}catch(e){

return [];

}

};
