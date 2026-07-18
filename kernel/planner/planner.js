"use strict";

class Planner{

plan(input){

const t=input.toLowerCase();

if(t.includes("oluştur")||t.includes("yap")){

return{
goal:input,
steps:[
"Amaç analiz ediliyor",
"Gerekli agent seçiliyor",
"İşlem hazırlanıyor",
"Çalıştırılıyor",
"Sonuç doğrulanıyor"
]
};

}

if(t.includes("aç")){

return{
goal:input,
steps:[
"Uygulama bulunuyor",
"ADB kontrol ediliyor",
"Uygulama açılıyor",
"Sonuç doğrulanıyor"
]
};

}

return{

goal:input,

steps:[
"Analiz",
"Karar",
"Çalıştır",
"Kontrol"

]

};

}

}

module.exports=new Planner();
