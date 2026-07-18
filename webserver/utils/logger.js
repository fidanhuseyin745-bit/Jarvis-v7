'use strict';

const fs=require('fs');

module.exports=function(msg){

const line=
'['+
new Date().toISOString()+
'] '+
msg+
'\n';

fs.appendFileSync(
'webserver/logs/api.log',
line
);

};
