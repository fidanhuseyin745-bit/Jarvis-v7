"use strict";

class SelfRepair{

fix(err){

if(!err) return null;

const t=String(err);

if(t.includes("MODULE_NOT_FOUND"))
return "Eksik modül tespit edildi.";

if(t.includes("ADB"))
return "ADB bağlantısı kontrol edilmeli.";

if(t.includes("network"))
return "Ağ bağlantısı kontrol edilmeli.";

return "Bilinmeyen hata.";

}

}

module.exports=new SelfRepair();
