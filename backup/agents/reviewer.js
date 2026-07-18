'use strict';

class Reviewer{

review(code){

const issues=[];

if(code.includes('var '))
issues.push('var yerine const/let kullan.');

if(code.length<10)
issues.push('Kod çok kısa.');

return issues;

}

}

module.exports=Reviewer;
