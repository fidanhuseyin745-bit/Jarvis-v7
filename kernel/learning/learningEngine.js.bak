"use strict";

class LearningEngine{

constructor(){
this.stats={
success:0,
fail:0
};
}

learn(success){

if(success){
this.stats.success++;
}else{
this.stats.fail++;
}

}

rate(){

const total=this.stats.success+this.stats.fail;

if(total===0) return 0;

return Math.round((this.stats.success/total)*100);

}

report(){

return{
success:this.stats.success,
fail:this.stats.fail,
accuracy:this.rate()
};

}

}

module.exports=new LearningEngine();
