function getPSWD(database) {
    return (userid) => {
        console.log('getPSWD read data base', userid);
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT pswd FROM users WHERE rowid = ' + userid, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if(!row){
                        reject(err);
                    }
                    else{
                        resolve(row&&row.pswd);
                    }
                    
                }
            });
        });
        return bigPromise;
    };
}



module.exports.getPSWD = getPSWD;