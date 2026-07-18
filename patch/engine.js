'use strict';

const Finder=require('./finder');
const Backup=require('./backup');
const Writer=require('./writer');
const Validator=require('./validator');

class PatchEngine{

constructor(root){

this.root=root;

this.finder=new Finder();
this.backup=new Backup();
this.writer=new Writer();
this.validator=new Validator();

}

appendAfter(fileName,search,content){

const file=this.finder.find(this.root,fileName);

if(!file){
console.log('❌ Dosya bulunamadı.');
return false;
}

const backup=this.backup.create(file);

if(!this.writer.appendAfter(file,search,content)){
console.log('❌ Ekleme yapılamadı.');
return false;
}

if(!this.validator.check(file)){

console.log('❌ Sözdizimi hatası oluştu.');

this.backup.restore(backup,file);

console.log('↩️ Geri alındı.');

return false;

}

console.log('✅ Patch başarıyla uygulandı.');

return true;

}

}

module.exports=PatchEngine;
