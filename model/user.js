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
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT rowid as userid, name FROM users WHERE rowid = ' + userid, (err, row) => {
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
                database.get('SELECT userid FROM superusers WHERE userid = ' + people.userid, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (!row) {
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
                    database.all('SELECT rowid as userid, name FROM users', (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!rows) {
                                reject(err);
                            } else {
                                msg.accessList = rows;
                                resolve(msg);
                            }
                        }
                    });

                });
            } else {
                return new Promise((resolve, reject) => {
                    database.get('SELECT rowid as userid, name FROM users WHERE rowid = ' + msg.info.userid, (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (!row) {
                                reject(err);
                            } else {
                                msg.accessList = [row];
                                resolve(msg);
                            }
                        }
                    });

                });
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