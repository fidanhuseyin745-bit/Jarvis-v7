'use strict';
const request=require('../utils/request');

module.exports=async(q)=>{
try{
const r=await request.get(
'https://registry.npmjs.org/-/v1/search',
{
params:{text:q,size:5},
timeout:5000
});

return r.data.objects.map(x=>({
title:x.package.name,
url:x.package.links.npm,
snippet:x.package.description||''
}));

}catch(e){
return [];
}
};
