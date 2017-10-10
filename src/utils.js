let http = require('http');
let path = require('path');
let {app, dialog} = require('electron');
let fs = require('fs');
function downloadFile(url, dest){
    return new Promise(function(resolve, reject){
        let writeStream = require('fs').createWriteStream(dest);
        writeStream.on('close', function () {
            resolve();
          });
        writeStream.on('open', function () {
          require('http').get(url, function (data) {
            data.pipe(writeStream);
          }).on('error', function () {
            console.log(error);
            reject();
        });
        });
    });
    
}


module.exports.downloadResource=function(url, appPath){
    // get resource map
    http.get(url+'files.json',function(res){
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData);
            let curr = app.getVersion();
            let remote = parsedData.version;
            let fileLs = parsedData.list;
            if(remote > curr){
                dialog.showMessageBox({
                    type:'info',
                    title:'升级',
                    message:'即将升级到'+remote+'，更新程序将在后台运行，更新完成之前不要关闭程序。点击确定开始更新。',
                    buttons:['ok','cancel']
                }, response=>{
                    console.log(response);
                    if(response === 0){
                        // backup
                        if (!fs.existsSync(path.join(appPath,'backup'))){
                            fs.mkdirSync(path.join(appPath,'backup'));
                        }
                        fileLs.forEach(v=>{
                            try {
                                fs.renameSync(path.join(appPath,v),path.join(appPath,'backup',v));
                            } catch (error) {
                                console.log(error);
                            }
                        });
                        Promise.all(fileLs.map(v=>{
                            return downloadFile(url+v,path.join(appPath,v));
                        }))
                        .then(function(){
                            dialog.showMessageBox({
                                type:'info',
                                title:'升级',
                                message:'成功升级到'+remote,
                                buttons:['ok']
                            });
                        })
                        .catch(function(){
                            // restore
                            fileLs.forEach(v=>{
                                try {
                                    fs.renameSync(path.join(appPath,'backup',v),path.join(appPath,v));
                                } catch (error) {
                                    console.log(error);
                                }
                            });
                        });
                    }
                });
                
            }
            else{
                dialog.showMessageBox({
                    type:'info',
                    title:'升级',
                    message:'当前版本'+curr+'已经是最新',
                    buttons:['ok']
                });
            }
          } catch (e) {
            console.error(e.message);
          }
        });
    });
};