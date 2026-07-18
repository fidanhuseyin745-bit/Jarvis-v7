'use strict';
const request=require('../utils/request');

module.exports=async(q)=>{
try{
const r=await request.get(
'https://api.stackexchange.com/2.3/search',
{
params:{
order:'desc',
sort:'votes',
site:'stackoverflow',
intitle:q,
pagesize:5
},
timeout:5000
});

return r.data.items.map(x=>({
title:x.title,
url:x.link,
snippet:'Stack Overflow'
}));

}catch(e){
return [];
}
};
