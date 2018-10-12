var Migrations = artifacts.require("./Migrations.sol");
var BountyHeap = artifacts.require("./BountyHeap.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations);
  deployer.deploy(BountyHeap, "0x1f4e7db8514ec4e99467a8d2ee3a63094a904e7a")
};
