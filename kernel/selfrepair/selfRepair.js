"use strict";

class SelfRepair{

repair(error){

console.log("🔧 Self Repair:",error);

return{
fixed:false,
message:"Alternatif yöntem denenebilir."
};

}

}

module.exports=new SelfRepair();
