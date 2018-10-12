const BountyHeap = artifacts.require("BountyHeap");
const Helpers = require("../index")
const Heap = Helpers.Heap
const Node = Helpers.Node

async function increaseTime(duration) {
  const id = Date.now()
  await new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) return reject(err1)

      web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: (duration-id)/15,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res)
      })
    })
  })
}
async function assertRevert(promise, ...txArgs) {
  let msg = "tx didnt REVERT as expected"
  let reverted = true
  try {
    await promise(...txArgs);
    reverted = false
  } catch (e) {
    if(e.toString().match("revert")){
    }else{
      msg = "tx threw error but didnt REVERT expected"
      reverted = false
    }
  }
  assert(reverted, msg)
}

let bountyHeap, max, createdAt, author, time0, time1, bountyAddress, bountyBal, tenEth,
  myPromise, size, idCount, nodeId2, authorBal, authorAddress

contract('BountyHeap', async(accounts) => {
  it("should be empty to start, then hold max", async() => {
    bountyHeap = await BountyHeap.deployed();
    max = await bountyHeap.getMax.call()
    assert.equal(max.toNumber(), 0);

    await bountyHeap.insert.sendTransaction(160, {from: accounts[0]})
    max = await bountyHeap.getMax.call()
    assert.equal(max.toNumber(), 160);
  });
  it("should keep max, after small insert and change after bigger insert", async() => {
    max = await bountyHeap.getMax.call()
    assert.equal(max.toNumber(), 160);

    await bountyHeap.insert.sendTransaction(159, {from: accounts[0]})
    max = await bountyHeap.getMax.call()
    assert.equal(max.toNumber(), 160);

    await bountyHeap.insert.sendTransaction(161, {from: accounts[0]})
    max = await bountyHeap.getMax.call()
    assert.equal(max.toNumber(), 161);
  });
  it("should hold ETH", async() => {
    bountyAddress = await bountyHeap.address
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, 0)

    tenEth = 10 * 1e18
    await bountyHeap.sendTransaction({value: tenEth, from: accounts[0]})
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth)
  });
  it("should not be able to immediatly end by me", async() => {
    authorAddress = "0x0000000000000000000000000000000000000123"
    time0 = Date.now()/1000
    createdAt = await bountyHeap.createdAt.call()
    expect(createdAt.toNumber()).to.be.closeTo(time0, 5)

    author = await bountyHeap.author.call()
    assert.equal(author, authorAddress);

    myPromise = bountyHeap.endBounty.sendTransaction
    await assertRevert(myPromise, {from: accounts[0]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")

    authorBal = await web3.eth.getBalance(authorAddress)
    assert.equal(authorBal, 0, "author should have no ETH yet")

  });
  it("should fast forward and eventually be endable", async() => {
    await increaseTime(2592001)
    await bountyHeap.endBounty.sendTransaction({from: accounts[0]})
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    size = await bountyHeap.size.call()
    assert.equal(bountyBal, 0, "ETH should be gone")

    authorBal = await web3.eth.getBalance(authorAddress)
    assert.equal(authorBal, tenEth, "author should have the ETH back in his account")
  });
});

contract('BountyHeap COMPLETENESS', async(accounts) => {
  //note: blockchain resets here; js vars dont
  it("should setup correctly", async() => {
    myPromise = bountyHeap.breakCompleteness.sendTransaction

    await bountyHeap.insert.sendTransaction(101, {from: accounts[1]})
    await bountyHeap.insert.sendTransaction(103, {from: accounts[2]})
    await bountyHeap.insert.sendTransaction(102, {from: accounts[3]})
    max = await bountyHeap.getMax.call()
    assert.equal(max.toNumber(), 103)

    bountyAddress = await bountyHeap.address
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, 0)

    tenEth = 10 * 1e18
    await bountyHeap.sendTransaction({value: tenEth, from: accounts[0]})
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth)
  });

  it("should REVERT when sent hole index of zero (or less)", async() => {
    await assertRevert(myPromise, 0, 1, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when no hole exists at argued holeIndex", async() => {
    await assertRevert(myPromise, 1, 2, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when filledIndex is empty", async() => {
    size = await bountyHeap.size.call()
    await assertRevert(myPromise, size + 1, size + 2, accounts[0],{from: accounts[3]})
    await assertRevert(myPromise, size + 1, size + 1, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when filledArg is < holeArg (cause thats not a hole)", async() => {
    await assertRevert(myPromise, size + 1, size - 1, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when sent negative index as hole", async() => {
    // the negative number gets interpreted as a very large uint. The line
    // `require(data.getByIndex(holeIndex).id == 0)` REVERTs because 
    // index is out of range
    await assertRevert(myPromise, -1, 1, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when hole index is greater than size", async() => {
    size = await bountyHeap.size.call()
    await assertRevert(myPromise, size + 1, 1, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
});

contract('BountyHeap PARENTS HAVE GREATER PRIORITY', async(accounts) => {

  it("should setup correctly", async() => {
    myPromise = bountyHeap.breakParentsHaveGreaterPriority.sendTransaction

    await bountyHeap.insert.sendTransaction(100, {from: accounts[1]})
    await bountyHeap.insert.sendTransaction(99, {from: accounts[2]})
    await bountyHeap.insert.sendTransaction(98, {from: accounts[3]})
    max = await bountyHeap.getMax.call()
    assert.equal(max.toNumber(), 100)

    bountyAddress = await bountyHeap.address
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, 0)

    tenEth = 10 * 1e18
    await bountyHeap.sendTransaction({value: tenEth, from: accounts[0]})
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth)
  });
  it("should REVERT when sent child index of 0 (child doesnt exist)", async() => {
    await assertRevert(myPromise, 0, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when child index is 1 or less (parent doesnt exist)", async() => {
    await assertRevert(myPromise, 1, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when parent is not less than child", async() => {
    await assertRevert(myPromise, 2, accounts[0],{from: accounts[3]})
    await assertRevert(myPromise, 3, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when child index is > size (child doesnt exist)", async() => {
    await assertRevert(myPromise, 4, accounts[0],{from: accounts[3]})
    await assertRevert(myPromise, 8, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
});

contract('BountyHeap ID MAINTINENCE', async(accounts) => {
  it("should setup correctly", async() => {
    myPromise = bountyHeap.breakIdMaintenance.sendTransaction

    await bountyHeap.insert.sendTransaction(95, {from: accounts[1]})
    await bountyHeap.insert.sendTransaction(94, {from: accounts[2]})
    await bountyHeap.insert.sendTransaction(96, {from: accounts[3]})
    max = await bountyHeap.getMax.call()
    assert.equal(max.toNumber(), 96)

    idCount = await bountyHeap.idCount.call()
    assert.equal(idCount.toNumber(), 3)

    bountyAddress = await bountyHeap.address
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, 0)

    tenEth = 10 * 1e18
    await bountyHeap.sendTransaction({value: tenEth, from: accounts[0]})
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth)
  });
  it("should REVERT when called with id outside of range", async() => {
    await assertRevert(myPromise, 0, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, -2, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, 4, accounts[0],{from: accounts[3]})

    nodeId2 = await bountyHeap.getById.call(2)
    assert.equal(nodeId2.toNumber(), 94)

    await bountyHeap.extractById.sendTransaction(2, {from: accounts[3]})
    size = await bountyHeap.size.call()
    nodeId2 = await bountyHeap.getById.call(2)
    assert.equal(size.toNumber(), 2)

    assert.equal(nodeId2.toNumber(), 0)

    await assertRevert(myPromise, 2, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when id array doesnt match mapping", async() => {
    await assertRevert(myPromise, 1, accounts[0],{from: accounts[3]})
    await assertRevert(myPromise, 3, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
});

contract('BountyHeap ID MAINTINENCE 2', async(accounts) => {
  it("should setup correctly", async() => {
    myPromise = bountyHeap.breakIdMaintenance2.sendTransaction

    await bountyHeap.insert.sendTransaction(-45, {from: accounts[1]})
    await bountyHeap.insert.sendTransaction(9, {from: accounts[3]})
    await bountyHeap.insert.sendTransaction(6, {from: accounts[2]})
    max = await bountyHeap.getMax.call()
    assert.equal(max.toNumber(), 9)

    bountyAddress = await bountyHeap.address
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, 0)

    tenEth = 10 * 1e18
    await bountyHeap.sendTransaction({value: tenEth, from: accounts[0]})
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth)
  });
  it("should REVERT when called with index implies a NULL node", async() => {
    await assertRevert(myPromise, 0, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, -2, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, 4, accounts[0],{from: accounts[3]})

    nodeId2 = await bountyHeap.getById.call(2)
    assert.equal(nodeId2.toNumber(), 9)

    await bountyHeap.extractById.sendTransaction(2, {from: accounts[3]})
    size = await bountyHeap.size.call()
    nodeId2 = await bountyHeap.getById.call(2)
    assert.equal(size.toNumber(), 2)

    assert.equal(nodeId2.toNumber(), 0)

    await assertRevert(myPromise, 3, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when id array doesnt match mapping", async() => {
    await assertRevert(myPromise, 1, accounts[0],{from: accounts[3]})
    await assertRevert(myPromise, 2, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should still hold the ETH", async() => {
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
});

contract('BountyHeap ID UNIQUENESS', async(accounts) => {
  it("should setup correctly", async() => {
    myPromise = bountyHeap.breakIdUniqueness.sendTransaction

    await bountyHeap.insert.sendTransaction(0, {from: accounts[3]})
    await bountyHeap.insert.sendTransaction(-5, {from: accounts[1]})
    await bountyHeap.insert.sendTransaction(2, {from: accounts[2]})
    max = await bountyHeap.getMax.call()
    assert.equal(max.toNumber(),2)

    bountyAddress = await bountyHeap.address
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, 0)

    tenEth = 10 * 1e18
    await bountyHeap.sendTransaction({value: tenEth, from: accounts[0]})
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth)
  });
  it("should REVERT when called with index implies a NULL node", async() => {
    // index1 out of range
    await assertRevert(myPromise, 0, 1, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, 4, 2, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, -2, 3, accounts[0],{from: accounts[3]})
    // index2 out of range
    await assertRevert(myPromise, 1, 5, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, 2, 0, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, 3, -3, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when index1 is == index2", async() => {
    await assertRevert(myPromise, 0, 0, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, 1, 1, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, 4, 4, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, -2, -2, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should REVERT when id uniqueness remains intact", async() => {
    await assertRevert(myPromise, 1, 2, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, 2, 3, accounts[0],{from: accounts[3]})

    await assertRevert(myPromise, 3, 1, accounts[0],{from: accounts[3]})

    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
  it("should still hold the ETH", async() => {
    bountyBal = await web3.eth.getBalance(bountyHeap.address)
    assert.equal(bountyBal, tenEth, "ETH should still be there")
  });
});
