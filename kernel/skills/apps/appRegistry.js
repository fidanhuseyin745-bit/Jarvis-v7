"use strict";

const apps={

youtube:{
package:"com.google.android.youtube",
aliases:["youtube","yt","yutub"]
},

chrome:{
package:"com.android.chrome",
aliases:["chrome","tarayıcı","google"]
},

kamera:{
package:"com.oplus.camera",
aliases:["kamera","camera","cam"]
},

galeri:{
package:"com.coloros.gallery3d",
aliases:["galeri","gallery","fotoğraflar"]
},

ayarlar:{
package:"com.android.settings",
aliases:["ayarlar","ayar","settings"]
},

spotify:{
package:"com.spotify.music",
aliases:["spotify","müzik"]
},

hesapmakinesi:{
package:"com.coloros.calculator",
aliases:["hesap makinesi","calculator","hesap"]
}

};

function find(name){

name=name.toLowerCase();

for(const app of Object.values(apps)){

if(app.aliases.includes(name))
return app;

}

return null;

}

module.exports={apps,find};
