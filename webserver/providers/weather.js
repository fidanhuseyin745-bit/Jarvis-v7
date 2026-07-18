'use strict';

const request=require('../utils/request');

module.exports=async(city)=>{

try{

const r=await request.get(
'https://wttr.in/'+encodeURIComponent(city),
{
params:{
format:'j1'
}
}
);

const c=r.data.current_condition[0];

return [{

title:"Hava Durumu",

url:"https://wttr.in",

snippet:
c.temp_C+"°C | "+
c.weatherDesc[0].value

}];

}catch(e){

return [];

}

};
