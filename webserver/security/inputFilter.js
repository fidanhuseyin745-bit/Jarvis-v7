'use strict';

module.exports=(req,res,next)=>{

const q=(req.query.q||'').trim();

if(q.length>200){
return res.status(400).json({error:'Sorgu çok uzun'});
}

req.query.q=q;

next();

};
