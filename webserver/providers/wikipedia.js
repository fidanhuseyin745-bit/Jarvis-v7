'use strict';
const request=require('../utils/request');

module.exports=async(q)=>{
try{
const r=await request.get(
'https://tr.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(q),
{timeout:5000}
);

return [{
title:r.data.title,
url:r.data.content_urls?.desktop?.page||"",
snippet:r.data.extract||""
}];

}catch(e){
return [];
}
};
