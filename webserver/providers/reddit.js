'use strict';
const request=require('../utils/request');

module.exports=async(q)=>{
try{
const r=await request.get(
'https://www.reddit.com/search.json',
{
params:{q,limit:5},
headers:{'User-Agent':'Jarvis'},
timeout:5000
});

return r.data.data.children.map(x=>({
title:x.data.title,
url:'https://reddit.com'+x.data.permalink,
snippet:x.data.subreddit_name_prefixed
}));

}catch(e){
return [];
}
};
