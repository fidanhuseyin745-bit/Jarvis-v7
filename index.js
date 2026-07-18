const {spawn}=require('child_process');
'use strict';

let WEB_API_STARTED=false;

function startWebApi(){

 if(WEB_API_STARTED) return;
 WEB_API_STARTED=true;


 try{

  spawn(
    process.execPath,
    ['index.js'],
    {
      cwd:require('path').join(__dirname,'webserver'),
      detached:true,
      stdio:'ignore'
    }
  ).on('error',()=>{}).unref();

  console.log('🌐 Web API başlatılıyor...');

 }catch(e){}

}

startWebApi();



require('dotenv').config();

const App=require('./core/app');

new App().start();
