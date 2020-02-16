const { 
    mintToken,
    getAllTokensOf 
} = require('../../controllers/artToken');

// eslint-disable-next-line func-names
module.exports = function () {
    const seneca = this;
    seneca.add({ role: 'artToken', cmd: 'mintToken' }, mintToken);
    seneca.add({ role: 'artToken', cmd: 'getAllTokensOf' }, getAllTokensOf);
};
