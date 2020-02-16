const responseModel = require('./../../models/response');

const confirmTransaction = (args, callback) => {
  responseModel.confirmTransaction(args.data)
    .then(res => callback(null, res))
    .catch(err => callback(err));
};

const revokeTransaction = (args, callback) => {
  responseModel.revokeTransaction(args.data)
    .then(res => callback(null, res))
    .catch(err => callback(err));
};

// eslint-disable-next-line func-names
module.exports = function () {
  const seneca = this;
  seneca.add({ role: 'response', cmd: 'confirmTransaction' }, confirmTransaction);
  seneca.add({ role: 'response', cmd: 'revokeTransaction' }, revokeTransaction);
};
