'use strict';

class Repository{

constructor(){

this.url='';

}

set(url){

this.url=url;

}

get(){

return this.url;

}

}

module.exports=Repository;
