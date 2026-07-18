'use strict';

class Logger{

static info(msg){
console.log('ℹ',msg);
}

static ok(msg){
console.log('✅',msg);
}

static error(msg){
console.log('❌',msg);
}

}

module.exports=Logger;
