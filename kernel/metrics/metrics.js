"use strict";

class Metrics{

constructor(){

this.data={

requests:0,

errors:0,

success:0

};

}

ok(){

this.data.requests++;
this.data.success++;

}

fail(){

this.data.requests++;
this.data.errors++;

}

stats(){

return this.data;

}

}

module.exports=new Metrics();
