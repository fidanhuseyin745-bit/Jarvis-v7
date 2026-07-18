"use strict";

class TaskTree{

build(goal){

return{

goal,

steps:[
"Analiz",
"Plan",
"Çalıştır",
"Kontrol",
"Tamamla"
]

};

}

}

module.exports=new TaskTree();
