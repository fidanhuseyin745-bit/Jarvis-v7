'use strict';

class Fixer{

fix(error){

console.log('🤖 AutoFix');

if(error.includes('Cannot find module'))
return 'missing-module';

if(error.includes('SyntaxError'))
return 'syntax';

return 'unknown';

}

}

module.exports=Fixer;
