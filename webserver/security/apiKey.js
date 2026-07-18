'use strict';

module.exports=(req,res,next)=>{

const key=req.headers['x-api-key'];

if(!key){
return res.status(401).json({error:'API KEY gerekli'});
}

if(key!=='jarvis-local-2026'){
return res.status(403).json({error:'API KEY hatalı'});
}

next();

};
