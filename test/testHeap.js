const TestHeap = artifacts.require("TestHeap");
const Helpers = require("../index")
const Heap = Helpers.Heap
const Node = Helpers.Node

contract('TestHeap',  async(accounts) => {
  it("should be heap-like", async() => {
    let heap, max, oldMax, size, gas, vals
    let dumpSig = "0xe4330545" //keccak("dump")[0-8]

    vals = Array.from({length: 10000}, () => Math.floor(Math.random() * 100000))
    i = 0

    heap = await TestHeap.new()
    // await heap.init({from:accounts[0]})

    size = await heap.size.call()
    console.log("SIZE: ", size.toNumber())
    gas = await heap.insert.estimateGas(1023186, {from: accounts[0]})
    console.log("GAS insert", gas)
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    gas = await heap.insert.estimateGas(1023186, {from: accounts[0]})
    console.log("GAS: insert 10th", gas)
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    console.log("TXHASH", txHash.receipt.gasUsed)
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    gas = await heap.insert.estimateGas(1023186, {from: accounts[0]})
    console.log("GAS: insert 20th", gas)
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
    txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})

    getResponse = await web3.eth.call({to:heap.address, data: dumpSig})
    console.log(getResponse)
    new Heap(getResponse).print()

    max = await heap.getMax.call()
    assert.equal(max.toNumber(), Math.max(...vals.slice(0,i)))

    txHash = await heap.extractById.sendTransaction(5, {from: accounts[0]})
    txHash = await heap.extractById.sendTransaction(20, {from: accounts[0]})
    txHash = await heap.extractById.sendTransaction(25, {from: accounts[0]})
    txHash = await heap.extractById.sendTransaction(15, {from: accounts[0]})
    txHash = await heap.extractById.sendTransaction(7, {from: accounts[0]})
    txHash = await heap.extractById.sendTransaction(9, {from: accounts[0]})
    txHash = await heap.extractById.sendTransaction(3, {from: accounts[0]})
    txHash = await heap.extractById.sendTransaction(2, {from: accounts[0]})
    txHash = await heap.extractById.sendTransaction(12, {from: accounts[0]})
    txHash = await heap.extractById.sendTransaction(1, {from: accounts[0]})

    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.getMax.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.getMax.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.getMax.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.getMax.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.getMax.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.getMax.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.getMax.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.getMax.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.getMax.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await heap.getMax.call()
    assert.isTrue(oldMax.toNumber() >= max.toNumber())

    size = await heap.size.call()
    assert.equal(size.toNumber(), 10)

    getResponse = await web3.eth.call({to:heap.address, data: dumpSig})
    console.log(getResponse)
    new Heap(getResponse).print()

  });

});

