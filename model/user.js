function getPSWD(database) {
    return (userid) => {
        console.log('getPSWD read data base', userid);
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT pswd FROM users WHERE rowid = ' + userid, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row) {
                        reject(err);
                    } else {
                        resolve(row && row.pswd);
                    }

                }
            });
        });
        return bigPromise;
    };
}

function getAccessls(database) {
    return (username) => {
        console.log('get user list');
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT rowid as userid, name FROM users WHERE name = ' + username, (err, row) => {
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
        }).then(function(people) {
            return new Promise((resolve, reject) => {
                database.get('SELECT userid FROM superusers WHERE userid = ' + people.userid, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (!row) {
                            resolve({
                                'role': 'normaluser',
                                'info': people
                            });
                        } else {
                            resolve({
                                'role': 'superuser',
                                'info': people
                                //add token
                            });
                        }
                    }
                });
            });
        }).then(function(msg) {
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

module.exports.getPSWD = getPSWD;
module.exports.getAccessls = getAccessls;