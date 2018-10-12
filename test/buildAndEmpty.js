const BountyHeap = artifacts.require("BountyHeap");
const Helpers = require("../index")
const Heap = Helpers.Heap
const Node = Helpers.Node

contract('BountyHeap',  async(accounts) => {
  let heap, size
  let vals = Array.from({length: 250}, () => Math.floor(Math.random() * 100000 - 50000))

  it("should keep its max property during all insertion/deletions ", async() => {
    console.log("\n  Reticulating splines...")
    heap = await BountyHeap.new()
    await processHeap(vals)

    async function processHeap(vals){
      let max = await heap.getMax.call()
      max = max.toNumber()
      let temp = max
      for(const item of vals){
        size = await heap.size.call()
        size = size.toNumber()
        // console.log("SIZE:  ", size)

        if(Math.random() > 0.5){
          max = max > item && size != 0 ? max : item
          txHash = await heap.insert.sendTransaction(item, {from: accounts[0]})
        }else{
          temp = await heap.getMax.call()
          temp = temp.toNumber()

          assert.isTrue(temp == max, "temp is != max before extractMax")

          txHash = await heap.extractMax.sendTransaction({from: accounts[0]})

          temp = await heap.getMax.call()
          temp = temp.toNumber()
          size = await heap.size.call()
          size = size.toNumber()
          // console.log("SIZE/TEMP/MAX:  ", size, "/", temp, "/", max)

          assert.isTrue(temp <= max || size == 0, "temp is > max after extractMax")
          max = temp
        }
      }
    }
  });
});

