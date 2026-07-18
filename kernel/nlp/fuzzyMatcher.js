"use strict";

const aliases={
youtube:["youtube","yotub","yutub","youtub","yt","you tube"],
whatsapp:["whatsapp","whatsap","watsap","vatsap","wp"],
google:["google","gogle","googl","googel"],
kamera:["kamera","kamerayi","camera","cam"],
ayarlar:["ayar","ayarlar","settings"]
};

function match(word){

word=word.toLowerCase();

for(const [real,list] of Object.entries(aliases)){

if(list.includes(word))
return real;

}

return word;

}

module.exports={match};
