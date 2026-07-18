"use strict";

class Reasoner{

constructor(){

this.rules=[];

}

register(name,check){

this.rules.push({
name,
check
});

}

analyze(text){

text=text.toLowerCase();

const result=[];

for(const rule of this.rules){

if(rule.check(text)){

result.push(rule.name);

}

}

if(result.length===0){

result.push("CHAT");

}

return result;

}

}

const reasoner=new Reasoner();

reasoner.register(
"PLAN",
t=>t.includes("oluştur")||
t.includes("yap")||
t.includes("geliştir")
);

reasoner.register(
"BUILD",
t=>t.includes("kod")||
t.includes("api")||
t.includes("proje")
);

reasoner.register(
"PHONE",
t=>t.includes("telefon")||
t.includes("whatsapp")||
t.includes("youtube")||
t.includes("spotify")
);

reasoner.register(
"SEARCH",
t=>t.includes("ara")||
t.includes("google")||
t.includes("web")
);

module.exports=reasoner;
