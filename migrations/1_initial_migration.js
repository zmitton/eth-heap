var Migrations = artifacts.require("./Migrations.sol");
var Heap = artifacts.require("./Heap.sol");
var PublicHeap = artifacts.require("./PublicHeap.sol");

module.exports = function(deployer, network) {
  deployer.deploy(Migrations);
  deployer.deploy(Heap);
  deployer.deploy(PublicHeap, Heap)
};
