/* eslint-disable global-require */
const Web3 = require('web3');
const { networks } = require('../truffle-config');


const contractJSON = {
  ArtToken: require('../build/contracts/ArtToken'),
  AssetToken: require('../build/contracts/AssetToken'),
};

const networkIds = {
  goerli: 5,
  ganache: 5777,
  localPoA: 7777,
  development: 5777
};

let ENVIRONMENT = 'development';
if (process.env.TEST_NETWORK !== undefined) {
  ENVIRONMENT = networks[process.env.TEST_NETWORK].name;
}


const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `${networks[ENVIRONMENT].protocol
    }://${
      networks[ENVIRONMENT].host
    }:${
      networks[ENVIRONMENT].port}`,
  ),
);
/**
 * Function that gets the contract address as per the network given
 * */

const getContractAddress = (contractJson, networkId) => ((contractJson.networks[networkId])
  ? contractJson.networks[networkId].address : null);


/**
 * Function that gets the contract address as per the contract name
 * */
const getAddress = (contractName) => (networkIds[ENVIRONMENT]
  ? getContractAddress(contractJSON[contractName], networkIds[ENVIRONMENT])
  : 'TEST_NETWORK_INVALID');
const getInstance = (abi, address) => web3.eth.contract(abi).at(address);

// const funderEscrowInstance = getInstance(contractJSON.FunderEscrow.abi, getAddress('FunderEscrow'));
const artTokenInstance = getInstance(contractJSON.ArtToken.abi, getAddress('ArtToken'));
const assetTokenInstance = getInstance(contractJSON.AssetToken.abi, getAddress('AssetToken'));

/**
 * Function that returns all the contract instances
 * */
const getContractInstances = function () {
  return ({
    // funderEscrow: funderEscrowInstance,
    artToken: artTokenInstance,
    assetToken: assetTokenInstance,
  });
};

// const getSalesContractInstance = (address) => getInstance(contractJSON.SalesContract.abi, address);


/**
 * Function that gets the web3 instance
 * */
const getWeb3Instance = function () {
  return web3;
};


/*
* Gets all the accounts
* */
const getAccounts = () => new Promise((resolve, reject) => {
  web3.eth.getAccounts((error, ethAccounts) => {
    if (error) {
      reject(error);
    } else {
      resolve({
        status: 'success',
        message: 'Fetched ethereum accounts are: ',
        data: ethAccounts,
      });
    }
  });
});


/**
 *  Function that deploys and returns the sales contract
 *  @param params JSON containing tokenId, basePrice,
 * tokenOwner, coinbase, checkMining, lockAccount, unlockAccount
 *  {
 *  tokenId: number, basePrice: number, tokenOwner: address, coinbase: address,
 *  checkMining: function, lockAccount: function, unlockAccount: function
 *  }
 * */
const deploySalesContract = async function (params) {
  try {
    const {
      tokenId, basePrice, tokenOwner, coinbase, checkMining, lockAccount, unlockAccount,
    } = params;
    const SalesContract = web3.eth.contract(contractJSON.SalesContract.abi);
    await unlockAccount({ account: coinbase, password: 'password', seconds: 30 });
    const contract = await SalesContract.new(
      artTokenInstance.address, assetTokenInstance.address, tokenId, basePrice, tokenOwner, {
        from: coinbase,
        data: contractJSON.SalesContract.bytecode,
        gas: 8000000,
      },
    );
    console.log('ETTY_deploySalesContract sales contract deployment transaction hash: ', contract.transactionHash);
    await checkMining(contract.transactionHash);
    const receipt = await web3.eth.getTransactionReceipt(contract.transactionHash);
    console.log('ETTY_deploySalesContract  sales contract deployed successfully at: ', receipt.contractAddress);
    await lockAccount({ account: coinbase });
    return ({
      txHash: contract.transactionHash,
      address: receipt.contractAddress,
      tag: 'ETTY_deploySalesContract',
    });
  } catch (e) {
    console.log('ETTY_deploySalesContract error in deploySalesContract: ', e);
    throw (e);
  }
};


module.exports = {
  // getSalesContractInstance,
  getContractInstances,
  getWeb3Instance,
  getAccounts,
  deploySalesContract,
};