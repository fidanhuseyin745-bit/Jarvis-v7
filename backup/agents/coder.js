'use strict';

const fs=require('fs');

class AgentCoder{

create(file,code){

fs.writeFileSync(file,code);

console.log('🤖',file,'oluşturuldu');

}

append(file,code){

fs.appendFileSync(file,"\n"+code);

console.log('➕',file,'güncellendi');

}

}

module.exports=AgentCoder;
