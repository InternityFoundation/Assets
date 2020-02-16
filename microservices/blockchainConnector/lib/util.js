
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const bigNumber = require('bignumber.js');
const config = require('../config/index');
const logger = require('./logger');

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const coinbase =  '0x9c0a7d4355a057E73E387c2DaCd4CB0E4Aa7AC1A';
/**
   * This function is to check  for completion of given transaction
   * @param {String} txhash
   */
const checkForTransactionReceiptMined = txhash => new Promise((resolve, reject) => {
  web3.eth.getTransactionReceipt(txhash, (err, receipt) => {
    if (receipt && receipt.blockNumber && receipt.transactionHash.toLowerCase() === txhash.toLowerCase()) {
      resolve(receipt);
    } else {
      reject(false);
    }
  });
});

/**
   * This function is to watch for completion of given transaction
   * @param {object} receipt
   * @param {String} txhash
   * @param {boolean} isCallbackSent
   * @param {object} filter
   * @private
   */
const isTransactionConfirmed = (receipt, txhash, isCallbackSent, filter) => new Promise((resolve, reject) => {
  console.log('isTransactionConfirmed');
  if (receipt && receipt.transactionHash == txhash) {
    if (web3.eth.getTransaction(txhash).blockNumber) {
      console.log(`${'\nTransferred Mined : ' + ' Transaction '}${txhash} in Block ${web3.eth.getTransaction(txhash).blockNumber} at difficulty ${web3.eth.getBlock(web3.eth.getTransaction(txhash).blockNumber).difficulty}`);
      filter.stopWatching();
      isCallbackSent = true;
      resolve(isCallbackSent);
    } else {
      console.log(`\n${txhash} Not yet Mined`);
      filter.stopWatching();
      isCallbackSent = true;
    }
  }
});

/**
 * This function is to watch for completion of given transaction
 * @param {String} txhash
 * @private
 */
const applyWatch = txhash => new Promise((resolve, reject) => {
  const filter = web3.eth.filter('latest');
  const isCallbackSent = false;
  // waiting for mining
  filter.watch((error, result) => {
    web3.eth.getTransactionReceipt(txhash, (err, receipt) => {
      if (err) {
        reject(err);
      } else {
        isTransactionConfirmed(receipt, txhash, isCallbackSent, filter)
          .then((result) => {
            resolve(receipt);
          }).catch((err) => {
            reject(err);
          });
      }
    });
  });
});

/**
 * Fn to get the estimate gas limit for tx
 * @param {String} contractData
 */
const getEstimateGas = (contractData, to, from) => {
  let gasEstimate = 3000000;
  try {
    gasEstimate = web3.eth.estimateGas({ data: contractData, to, from });
  } catch (err) {
    logger.error('Error getting the gasEstimate');
  }
  return gasEstimate;
};

/**
 * Fn to sign the raw transaction in blockchain
 * @param {Object} data
 */
const executeRawTransaction = ({
  to,
  encodedABI
}) => new Promise((resolve, reject) => {
  const privateKey = Buffer.from(config.privateKey, 'hex');
  const rawTx = {
    from: coinbase,
    to,
    gas: getEstimateGas(encodedABI, to, coinbase),
    gasPrice: parseInt(web3.eth.gasPrice.toString()) + config.extraGasPrice,
    value: 0,
    data: encodedABI,
    nonce: web3.toHex(web3.eth.getTransactionCount(coinbase, 'pending')),
  };
  const tx = new Tx(rawTx);
  tx.sign(privateKey);
  const serializedTx = tx.serialize();
  web3.eth.sendRawTransaction(`0x${serializedTx.toString('hex')}`, (err, hash) => {
    if (!err) {
      logger.info(`Transaction signed successfully: ${hash}`);
      resolve(hash);
    } else {
      logger.error(`Transaction signed error: ${JSON.stringify(err)}`);
      const errObj = {
        status: 'failue',
        message: 'Error occured while executing the transaction in blockchain',
        err,
      };
      reject(errObj);
    }
  });
});

/**
 * Fn to get the encoded abi of requested fn call
 * @param {Object} data
 */
const getEncodeABI = (contractInstance, functionName, params) => {
  let encodedABI = '0x00';
  encodedABI = contractInstance[functionName].getData(...params);
  return encodedABI;
};


module.exports = {
  applyWatch,
  executeRawTransaction,
  getEncodeABI,
  checkForTransactionReceiptMined,
};
