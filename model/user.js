const Crypto = require('crypto');

function getPSWD(database) {
    return (usercode) => {
        global.logger.info('getPSWD read data base');
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT pswd, rowid FROM users WHERE code = ?', usercode, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row) {
                        reject(-2);
                    } else {
                        resolve(row && {
                            userid: row.rowid,
                            usrpswd: row.pswd
                        });
                    }

                }
            });
        });
        return bigPromise;
    };
}

function getAccessls(database) {
    return (userid, nonce) => {
        global.logger.info('get user list');
        var superls;
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT rowid as userid, name, code FROM users WHERE rowid = ' + userid, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row) {
                        reject(-2);
                    } else {
                        resolve(row);
                    }
                }
            });
        }).then(function (people) {
            return new Promise((resolve, reject) => {
                global.logger.info(people);
                database.all('SELECT userid FROM superusers', (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        superls = rows;
                        if (!superls.find(v=>v.userid === people.userid)) {
                            resolve({
                                'role': 'normaluser',
                                'info': people,
                                'accessToken': Crypto.createHmac('sha256', 'normaltoken').update([people.userid, nonce].join('')).digest('base64')
                            });
                        } else {
                            resolve({
                                'role': 'superuser',
                                'info': people,
                                'accessToken': Crypto.createHmac('sha256', 'supertoken').update([people.userid, nonce].join('')).digest('base64')
                            });
                        }
                    }
                });
            });
        }).then(function (msg) {
            if (msg.role === 'superuser') {
                return new Promise((resolve, reject) => {
                    database.all('SELECT rowid as userid, name, code FROM users', (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!rows) {
                                reject(err);
                            } else {
                                msg.accessList = rows;
                                msg.accessList.forEach(v=>{
                                    if(superls.find(su=>su.userid === v.userid)){
                                        v.role = 'superuser';
                                    }
                                    else{
                                        v.role = 'normaluser';
                                    }
                                });
                                resolve(msg);
                            }
                        }
                    });

                });
            } else {
                var row = {userid: msg.info.userid, name: msg.info.name, code: msg.info.code};
                row.role = 'normaluser';
                msg.accessList = [row];
                return Promise.resolve(msg);
            }
        });
        return bigPromise;
    };
}

function getUserid(database) {
    return (usercode) => {
        global.logger.info('getPSWD read data base');
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT rowid as userid FROM users WHERE code = ?',  usercode, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row) {
                        reject(-2);
                    } else {
                        resolve(row && row.userid);
                    }

                }
            });
        });
        return bigPromise;
    };
}

function getUseridByCodeAndName(database){
    return (usercode, username) => {
        global.logger.info('getPSWD read data base');
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT rowid AS userid FROM users WHERE code = $usercode AND name = $username',  
                {$usercode: usercode, $username: username}, 
                (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row) {
                        reject(-2);
                    } else {
                        resolve(row && row.userid);
                    }

                }
            });
        });
        return bigPromise;
    };
}

function createUser(database) {
    return (usercode, username, password) => {
        global.logger.info('create user ', usercode, username);
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT rowid AS userid FROM users WHERE code = $usercode',  
                {$usercode: usercode}, 
                (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (row) {
                        reject(-1);
                    } else {
                        resolve();
                    }

                }
            });
        })
        .then(()=>new Promise((resolve, reject)=>{
            database.run('INSERT INTO users (name, pswd, code) VALUES ($username, $password, $usercode)', {
                $username: username,
                $password: password,
                $usercode: usercode
            }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID);
                }
            });
        }));
        return bigPromise;
    };
}

function changePSWD(database) {
    return (userid, password) => {
        global.logger.info('change PSWD ');
        var bigPromise = new Promise((resolve, reject) => {
            database.run('UPDATE users SET pswd = $password WHERE rowid = $userid', {
                $password: password,
                $userid: userid
            }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        return bigPromise;
    };
}

function makeSuper(database) {
    return (userid) => {
        global.logger.info('make super user ', userid);
        var bigPromise = new Promise((resolve, reject) => {
            database.run('INSERT INTO superusers (userid) VALUES ($userid)', {
                $userid:userid
            }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        return bigPromise;
    };
}


function removeSuper(database) {
    return (userid) => {
        global.logger.info('remove super user ', userid);
        var bigPromise = new Promise((resolve, reject) => {
            database.run('DELETE FROM superusers WHERE userid = $userid', {
                $userid:userid
            }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        return bigPromise;
    };
}


module.exports.getPSWD = getPSWD;
module.exports.getAccessls = getAccessls;
module.exports.getUserid = getUserid;
module.exports.getUseridByCodeAndName = getUseridByCodeAndName;
module.exports.createUser = createUser;
module.exports.changePSWD = changePSWD;
module.exports.makeSuper = makeSuper;
module.exports.removeSuper = removeSuper;