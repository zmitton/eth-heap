var Migrations = artifacts.require("./Migrations.sol");
var Heap = artifacts.require("./Heap.sol");
var HeapClient = artifacts.require("./HeapClient.sol");

module.exports = function(deployer, network) {
  deployer.deploy(Migrations);
  deployer.deploy(Heap);
  deployer.deploy(HeapClient, Heap)
};
