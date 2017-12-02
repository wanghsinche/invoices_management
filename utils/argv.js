const fs = require('fs');
const path = require('path');
function simpleArgvMatch(argvls){
    let argvmap = {}, name='', value='', matchResult;
    const regexp = /^\-([a-zA-z_]+)\=([a-zA-z0-9\.\/\:]+)/;
    argvls.forEach((val)=>{
        matchResult = val.match(regexp);
        if(matchResult && matchResult.length>2){
            name = matchResult[1];
            value = matchResult[2];   
            argvmap[name] = value;
        }
    });
    return argvmap;
}
let argvMap = simpleArgvMatch(process.argv);
module.exports.loadFromConfig = function(){
    let config;
    if(!!argvMap.config){
        try{
            config = fs.readFileSync(path.resolve(__dirname,'../', argvMap.config), 'utf8');
            config = JSON.parse(config);
        }
        catch(e){
            console.error(e);
        }
    }
    return config;
};
module.exports.getArgvMap = function(){
    return argvMap;
};