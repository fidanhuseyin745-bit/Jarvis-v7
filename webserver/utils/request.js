'use strict';

const axios=require('axios');

const client=axios.create({

timeout:5000,

headers:{
'User-Agent':'Jarvis/1.0'
}

});

function sleep(ms){
return new Promise(r=>setTimeout(r,ms));
}

async function get(url,opt={}){

let err;

for(let i=0;i<3;i++){

try{

return await client.get(url,opt);

}catch(e){

err=e;

await sleep(500);

}

}

throw err;

}

module.exports={get};
