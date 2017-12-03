const config = require('../../utils/config.js').getConfig();
const assert = require('assert');
describe('test config',function(){
    it('should be a object with necessary properties',function(){
        assert(config.real);
        assert(config.nonce);
        assert(config.logfile);
        assert(config.linkRecv);
        assert(config.port);
    });
});


