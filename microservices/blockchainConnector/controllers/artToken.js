const { getContractInstances } = require('../lib/contractFactory');
const { executeRawTransaction, getEncodeABI } = require('../lib/util')
const { generateSHA3 } = require('../lib/hashing_json/createHash/createJSONHash')
const { artToken } = getContractInstances();

const mintToken = async ({
    to,
    tokenDetails,
    price
},  callback) => {
    const tokenDetailsHash =  generateSHA3(tokenDetails);
    const returnVal= await executeRawTransaction({
        to : artToken.address,
        encodedABI : getEncodeABI(artToken, 'mintToken', [ to, tokenDetailsHash, parseInt(price,10)]),
    });
    callback(null, returnVal);
}

const getAllTokensOf = async ({
    owner
}, callback) => {
    const allTokens = artToken.getAllTokensOf.call(owner);
    callback(null, allTokens);
}

const buyToken = async ({
    tokenId,
    sender
}, callback) => {
    const allTokens = artToken.getAllTokensOf.call(owner);
    callback(null, allTokens);
}


module.exports = {
    mintToken,
    getAllTokensOf,
}