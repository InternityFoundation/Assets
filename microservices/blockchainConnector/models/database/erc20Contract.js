const seneca = require('seneca');
const config = require('../../config/index');

const databaseSenecaClient = seneca({ timeout: config.databaseMicroService.timeout })
  .client(config.databaseMicroService);

const getErc20ContractDetails = tokenId => new Promise((resolve, reject) => {
  databaseSenecaClient.act({
    role: 'erc20Contract',
    cmd: 'getErc20ContractDetails',
    tokenId,
  }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});


const getAllErc20ContractDetails = () => new Promise((resolve, reject) => {
  databaseSenecaClient.act({
    role: 'erc20Contract',
    cmd: 'getAllErc20ContractDetails',
  }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  });
});

module.exports = {
  getErc20ContractDetails,
  getAllErc20ContractDetails,
};
