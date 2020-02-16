require('dotenv').config({ path: '.env' });

let seneca = require('seneca');
const config = require('./config/index');

seneca = seneca({ timeout: config.blockchainMicroService.timeout });
const logger = require('./lib/logger');
const assetToken = require('./services/assetToken/index');

logger.init();
seneca.use(assetToken);

// seneca.use(users);
seneca.listen(config.blockchainMicroService);
logger.info(`Started blockchainConnector micro-service on port: ${config.blockchainMicroService.port}`);
