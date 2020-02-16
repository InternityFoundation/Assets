const userModel = require('../models/user');
const roleModel = require('../models/role');
const utils = require('../lib/utils');

const _ = require('lodash');
const userDetails = [{
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@yopmail.com',
  password: 'Test@1234',
  role: 1,
  contactNumber: '9898989801',
  address: {
    street: '1607 23rd Street NW',
    city: 'Washington',
    zipCode: '20008',
    state: ' DC',
    country: 'US',
  },
  publicKey: '0xf862b13d405f21086ffc468a48d7bd7c7701e86f',
}
]
exports.up = () => new Promise((resolve, reject) => {
  roleModel.find({ roleQueries: {} }, (roleErr, roles) => {
    userDetails.forEach(userDetail => {
      userDetail.role = _.find(roles, role => (role.code === userDetail.role))._id;
      userDetail.password = utils.generateBcryptHash(userDetail.password);
    });
    userModel.addMultiple({ userDetails }, (err, res) => {
      if (!err) {
        console.log(`Users Added!:${res}`);
        resolve();
      }
      else {
        console.log(`Users adding failed: ${err}`);
        reject(err);
      }
    })
  });
});

exports.down = db => null;

exports._meta = {
  version: 1,
};
