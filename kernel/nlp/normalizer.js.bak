"use strict";

const aliases={
youtube:["youtube","yt","yutub","yotube","you tube"],
whatsapp:["whatsapp","wp","watsap","whatsap"],
google:["google","gogle","googl"],
camera:["kamera","camera","cam"],
settings:["ayarlar","settings","ayar"]
};

const verbs={
aç:["aç","ac","başlat","çalıştır","gir"],
kapat:["kapat","çık","sonlandır"]
};

function normalize(text){

let t=text.toLowerCase();

for(const [real,list] of Object.entries(aliases)){

for(const a of list){

t=t.replaceAll(a,real);

}

}

for(const [real,list] of Object.entries(verbs)){

for(const a of list){

t=t.replaceAll(a,real);

}

}

return t;

}

module.exports={normalize};
