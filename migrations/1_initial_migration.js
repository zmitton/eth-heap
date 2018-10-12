var Migrations = artifacts.require("./Migrations.sol");
var BountyHeap = artifacts.require("./BountyHeap.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations);
  deployer.deploy(BountyHeap, "0x0000000000000000000000000000000000000123")
};
