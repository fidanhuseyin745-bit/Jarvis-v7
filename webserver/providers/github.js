'use strict';
const request=require('../utils/request');

module.exports=async(q)=>{
try{

const r=await request.get(
'https://api.github.com/search/repositories',
{
params:{
q,
per_page:5,
sort:'stars'
},
headers:{
'User-Agent':'Jarvis'
},
timeout:5000
}
);

return r.data.items.map(x=>({
title:x.full_name,
url:x.html_url,
snippet:x.description||""
}));

}catch(e){
return [];
}
};
