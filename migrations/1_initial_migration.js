var Migrations = artifacts.require("./Migrations.sol");
var Heap = artifacts.require("./Heap.sol");
var TestHeap = artifacts.require("./TestHeap.sol");

module.exports = function(deployer, network) {
  deployer.deploy(Migrations);
  deployer.deploy(Heap);
  deployer.deploy(TestHeap)
};
