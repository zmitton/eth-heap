const HeapClient = artifacts.require("HeapClient");
const Helpers = require("../index")
const Heap = Helpers.Heap
const Node = Helpers.Node

contract('Heap',  async(accounts) => {
  it("should be heap-like", async() => {
    let heap, max, oldMax, size
    let getSig = "0x6d4ce63c"

    heap = await HeapClient.new()

    txHash = await heap.push.sendTransaction(500, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(8, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(2, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(10, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(500, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(22, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(500, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(14, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(9, {from: accounts[0]})

    txHash = await heap.push.sendTransaction(122, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(98, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(47, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(218, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(118, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(500, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(319, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(316, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(313, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(359234, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(3592, {from: accounts[0]})

    txHash = await heap.push.sendTransaction(3529, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(359, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(2538, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(2538, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(2586, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(2185, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(2118, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(2138, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(2186, {from: accounts[0]})
    txHash = await heap.push.sendTransaction(59, {from: accounts[0]})
    
    getResponse = await web3.eth.call({to:heap.address, data: getSig})
    console.log(getResponse)
    new Heap(getResponse).print()

    max = await heap.max.call()
    assert.equal(max.toNumber(), 359234)

    txHash = await heap.remove.sendTransaction(5, {from: accounts[0]})
    txHash = await heap.remove.sendTransaction(20, {from: accounts[0]})
    txHash = await heap.remove.sendTransaction(25, {from: accounts[0]})
    txHash = await heap.remove.sendTransaction(15, {from: accounts[0]})
    txHash = await heap.remove.sendTransaction(7, {from: accounts[0]})
    txHash = await heap.remove.sendTransaction(9, {from: accounts[0]})
    txHash = await heap.remove.sendTransaction(3, {from: accounts[0]})
    txHash = await heap.remove.sendTransaction(2, {from: accounts[0]})
    txHash = await heap.remove.sendTransaction(12, {from: accounts[0]})
    txHash = await heap.remove.sendTransaction(1, {from: accounts[0]})

    txHash = await heap.pop.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.max.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.pop.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.max.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.pop.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.max.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.pop.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.max.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.pop.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.max.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.pop.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.max.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.pop.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.max.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.pop.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.max.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.pop.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.max.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.pop.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.max.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())

    size = await heap.size.call()
    assert.equal(size.toNumber(), 10)

    getResponse = await web3.eth.call({to:heap.address, data: getSig})
    console.log(getResponse)
    new Heap(getResponse).print()

  });





  // it("should assert true", function(done) {
  //   let heap, data
  //   // let nodes = [3,8,11,5,4,2,1]
  //   // let bnNodes = nodes.map((x)=>{return new BN(x)})
  //   HeapClient.new().then((_heap)=>{
  //     heap = _heap
  //     // data = encArgs("heapify(uint128[])", [1,2,30])
  //     // console.log("data", data);
  //     console.log("hererer", heap.address)
  //     // return web3.eth.sendTransaction({from: accounts[0], to:heap.address, data: data, gas:"1000000"})
  //   // }).then((txHash)=>{
  //     return heap.push.sendTransaction(5, {from: accounts[0]})
  //   }).then((txHash)=>{
  //     return heap.push.sendTransaction(8, {from: accounts[0]})
  //   }).then((txHash)=>{
  //     return heap.push.sendTransaction(2, {from: accounts[0]})
  //   }).then((txHash)=>{
  //     console.log("there");
  //     // console.log("txHash", txHash);
  //     return web3.eth.call({to:heap.address, data:"0x6d4ce63c"})
  //   }).then((rpcResponse)=>{
  //     console.log("rpcResponse", rpcResponse);
  //     // assert.isTrue(true);
  //     done();
  //   })
  // });
});


// 0x6d2e47b6
// 0000000000000000000000000000000000000000000000000000000000000020
// 0000000000000000000000000000000000000000000000000000000000000003
// 0000000000000000000000000000000000000000000000000000000000000001
// 0000000000000000000000000000000000000000000000000000000000000002
// 000000000000000000000000000000000000000000000000000000000000001e

