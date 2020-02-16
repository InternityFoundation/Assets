const artToken = require('../../models/ethereum/artToken');
const logger = require('../../lib/logger');

const mintToken =async (params) => {
    try {
        await artToken.mintToken(params);
        return {
            message : 'Art Token created Successfully'
        }
    } catch (error) {
        logger.error('Something went wrong in Mint token');
    }
}

const allTokensOf = async (owner) => {
    try {
        return (await artToken.getAllTokensOf(owner));
    } catch (error) {
        logger.error('Something went wrong in fetching the art tokens');
    }
}

module.exports = {
    allTokensOf,
    mintToken
}