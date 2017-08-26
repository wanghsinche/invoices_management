const CryptoJS = require('crypto-js');

function getPSWD(database) {
    return (usercode) => {
        console.log('getPSWD read data base');
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT pswd, rowid FROM users WHERE code = ?', usercode, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row) {
                        reject(err);
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
        console.log('get user list');
        var superls;
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT rowid as userid, name, code FROM users WHERE rowid = ' + userid, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            });
        }).then(function (people) {
            return new Promise((resolve, reject) => {
                console.log(people);
                database.all('SELECT userid FROM superusers', (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        superls = rows;
                        if (!superls.find(v=>v.userid === people.userid)) {
                            resolve({
                                'role': 'normaluser',
                                'info': people,
                                'accessToken': CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256('normaltoken', people.userid.toString(), nonce.toString()))
                            });
                        } else {
                            resolve({
                                'role': 'superuser',
                                'info': people,
                                'accessToken': CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256('supertoken', people.userid.toString(), nonce.toString()))
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
                // return new Promise((resolve, reject) => {
                //     database.get('SELECT rowid as userid, name, code FROM users WHERE rowid = ' + msg.info.userid, (err, row) => {
                //         if (err) {
                //             reject(err);
                //         } else {
                //             if (!row) {
                //                 reject(err);
                //             } else {
                //                 row.role = 'normaluser';
                //                 msg.accessList = [row];
                //                 resolve(msg);
                //             }
                //         }
                //     });

                // });
            }
        });
        return bigPromise;
    };
}

function getUserid(database) {
    return (usercode) => {
        console.log('getPSWD read data base');
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT rowid as userid FROM users WHERE code = ?',  usercode, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row) {
                        reject(err);
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
        console.log('create user ', usercode, username);
        var bigPromise = new Promise((resolve, reject) => {
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
        });
        return bigPromise;
    };
}

function changePSWD(database) {
    return (userid, password) => {
        console.log('change PSWD ');
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
        console.log('make super user ', userid);
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
        console.log('remove super user ', userid);
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
module.exports.createUser = createUser;
module.exports.changePSWD = changePSWD;
module.exports.makeSuper = makeSuper;
module.exports.removeSuper = removeSuper;