'use strict';

const request=require('../utils/request');

module.exports=async()=>{

try{

const r=await request.get(
'https://open.er-api.com/v6/latest/USD'
);

return [{

title:"USD/TRY",

url:"https://open.er-api.com",

snippet:
JSON.stringify(r.data.rates)

}];

}catch(e){

return [];

}

};
