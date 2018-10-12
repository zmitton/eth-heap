const BountyHeap = artifacts.require("BountyHeap");
const Helpers = require("../index")
const Heap = Helpers.Heap
const Node = Helpers.Node

contract('BountyHeap',  async(accounts) => {
  it("should be heap-like", async() => {
    let heap, max, oldMax, size, gas
    let getByIndexSig = ""
    let insertCosts = [] 
    let insertSize = [] 
    let extractMaxCosts = []
    let extractMaxSize = []
    let extractByIdCosts = []
    let extractByIdSize = []
    let i = 0
    let k = 101
    let vals = Array.from({length: 50}, () => Math.floor(Math.random() * 100000))
    // let vals = Array.from({length: 50}, ()=>{return k--})

    async function insertOne(val){
      txHash = await heap.insert.sendTransaction(vals[i++], {from: accounts[0]})
      // console.log("insert => gasUsed: ", val, " => ",txHash.receipt.gasUsed)
      insertCosts.push(txHash.receipt.gasUsed)
      insertSize.push(size.toNumber())
    }
    async function extractOne(){
      let extractionIndex = Math.floor(Math.random() * Math.abs((size.toNumber() - 2))) + 1
      let extractionId = await heap.getIdByIndex.call(extractionIndex)
      // console.log("extractionId/index: ", extractionId.toNumber(), "/", extractionIndex)
      txHash = await heap.extractById.sendTransaction(extractionId.toNumber(), {from: accounts[0]})
      // console.log("EXTRACTING INDEX => gasUsed: ", extractionIndex, " => ",txHash.receipt.gasUsed)
      extractByIdCosts.push(txHash.receipt.gasUsed)
      extractByIdSize.push(size.toNumber())
    }
    async function extractMax(){
      // txHash = await heap.insert.sendTransaction(k--, {from: accounts[0]})
      txHash = await heap.extractMax.sendTransaction({from: accounts[0]})
      // console.log("EXTRACTING MAX gasUsed: ",txHash.receipt.gasUsed)
      extractMaxCosts.push(txHash.receipt.gasUsed)
      extractMaxSize.push(size.toNumber())
    }

    async function processHeap(vals){
      // for(const item of vals){
      //   size = await heap.size.call()
      //   if(size.toNumber() == 0 || Math.random() > 0.5){
      //     await insertOne(item);
      //   }else if(Math.random() > 0.5){
      //     await extractOne();
      //   }else{
      //     await extractMax();
      //   }
      // }
      for(const item of vals){
        size = await heap.size.call()
        // if(size.toNumber()%5 == 0){
        //   await extractMax()
        // }
        await insertOne(item);
      }
      console.log("GAS COSTS")
      console.log("insert Average Gas Costs:      ", ave(insertCosts))
      let inserts = zip(insertSize, insertCosts)
      console.log("inserts: \n", inserts)


      max = await heap.getMax.call()
      let s = size.toNumber()
      for (var j = s; j > 1; j--) {
        size = await heap.size.call()
        await extractMax()
        oldMax = max
        max = await heap.getMax.call()
        assert.isTrue(oldMax.toNumber() >= max.toNumber())
      }

      console.log("GAS COSTS")
      console.log("extractMax Average Gas Costs:  ", ave(extractMaxCosts))
      let extracts = zip(extractByIdSize, extractByIdCosts)
      console.log("extracts: \n", extracts)


    }

    function ave(arr){
      let sum = 0
      arr.forEach((elem)=>{
        sum += elem
      })
      return Math.floor(sum/arr.length)
    }
    function zip(arr1, arr2){
      let str = "ListLinePlot[{"
      for (var i = 0; i < arr1.length; i++) {
        str += "{" + arr1[i] + "," + arr2[i] + "},"
      }
      return str.slice(0,str.length-1) + "}, PlotRange -> {{0, 600}, {0, 300000}}, PlotStyle -> Red]"
    }

    heap = await BountyHeap.new(accounts[0])
    await processHeap(vals)

  });
});

