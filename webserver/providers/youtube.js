'use strict';
const request=require('../utils/request');

module.exports=async(q)=>{
try{

const r=await request.get(
'https://www.youtube.com/results',
{
params:{search_query:q},
timeout:5000
}
);

const out=[];
const re=/\"videoId\":\"([^\"]+)\".*?\"text\":\"([^\"]+)\"/g;

let m;

while((m=re.exec(r.data))&&out.length<5){

out.push({
title:m[2],
url:'https://www.youtube.com/watch?v='+m[1],
snippet:'YouTube'
});

}

return out;

}catch(e){
return [];
}
};
