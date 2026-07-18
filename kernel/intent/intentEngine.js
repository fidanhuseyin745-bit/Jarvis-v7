"use strict";

class IntentEngine{

detect(text){

text=text.toLowerCase();

if(text.includes("aç")||text.includes("başlat"))
return "OPEN_APP";

if(text.includes("oluştur")||text.includes("yap"))
return "BUILD";

if(text.includes("ara")||text.includes("bul"))
return "SEARCH";

if(text.includes("git"))
return "GIT";

if(text.includes("sil"))
return "DELETE";

if(text.includes("yardım"))
return "HELP";

return "CHAT";

}

}

module.exports=new IntentEngine();
