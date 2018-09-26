const TestHeap = artifacts.require("TestHeap");
const Helpers = require("../index")
const Heap = Helpers.Heap
const Node = Helpers.Node

contract('TestHeap',  async(accounts) => {
  it("should be heap-like", async() => {
    let heap, max, oldMax, size, gas
    let dumpSig = "0xe4330545" //keccak("dump()")[0-8]
    let getMaxSig = "0x3075f552" //keccak("getMax()")[0-8]

    let vals = Array.from({length: 10000}, () => Math.floor(Math.random() * 100000))
    let i = 0

    heap = await TestHeap.new()

    size = await heap.size.call()

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

    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.equal(new Node(max).priority, Math.max(...vals.slice(0,i)))

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
    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.isTrue(new Node(oldMax).priority >= new Node(max).priority)
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.isTrue(new Node(oldMax).priority >= new Node(max).priority)
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.isTrue(new Node(oldMax).priority >= new Node(max).priority)
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.isTrue(new Node(oldMax).priority >= new Node(max).priority)
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.isTrue(new Node(oldMax).priority >= new Node(max).priority)
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.isTrue(new Node(oldMax).priority >= new Node(max).priority)
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.isTrue(new Node(oldMax).priority >= new Node(max).priority)
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.isTrue(new Node(oldMax).priority >= new Node(max).priority)
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.isTrue(new Node(oldMax).priority >= new Node(max).priority)
    txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
    oldMax = max
    max = await web3.eth.call({to: heap.address, data: getMaxSig})
    assert.isTrue(new Node(oldMax).priority >= new Node(max).priority)

    size = await heap.size.call()
    assert.equal(size.toNumber(), 10)

    getResponse = await web3.eth.call({to:heap.address, data: dumpSig})
    console.log(getResponse)
    new Heap(getResponse).print()

  });
});

