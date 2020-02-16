const ArtTokenContract = artifacts.require('ArtToken');
const AssetTokenContract = artifacts.require('AssetToken');

module.exports = async function (deployer, networks, accounts) {
    const owner = accounts[0];
    
    const deployerDetails = {
        from: owner,
        gas: 8000000
    };

    await deployer.deploy(AssetTokenContract, 'Asset', 'AST', 8, owner, 100000000, deployerDetails)

    await deployer.deploy(ArtTokenContract, 'Art', 'ART', deployerDetails);
}