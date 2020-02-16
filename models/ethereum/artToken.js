const seneca = require('seneca');
const config = require('../../config/index');

const ethereumSenecaClient = seneca({ timeout: config.blockchainMicroService.timeout })
  .client(config.blockchainMicroService);


const mintToken = data => new Promise((resolve, reject) => {
  ethereumSenecaClient.act({
    role: 'artToken',
    cmd: 'mintToken',
    ...data,
  }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});

const getAllTokensOf = owner => new Promise((resolve, reject) => {
  ethereumSenecaClient.act({
    role: 'artToken',
    cmd: 'getAllTokensOf',
    owner,
  }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});

module.exports = {
  mintToken,
  getAllTokensOf
};
