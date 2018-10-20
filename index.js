const treeify = require('treeify');

class Heap extends Array{
    constructor(rpcResponse, numStructItems = 2){
      super(0)
      for (var i = 130; i < rpcResponse.length ; i=i+64*numStructItems){
        super.push(new Node(rpcResponse.slice(i, i+64*numStructItems)))
      }
    }
    print(){
        console.log("\n warning: left/right children might appear switched")
        var arr = this.map((node)=>{ return node.priority })
        var obj = {}
        obj[arr[1]] = Heap._toObject(arr, 1)
        console.log(treeify.asTree(obj, false));
    }

    static _toObject(arr, i) {
    var obj = {}
    if(i*2 < arr.length) obj[arr[i*2]] = Heap._toObject(arr, i*2)
    if(i*2+1 < arr.length) obj[arr[i*2+1]] = Heap._toObject(arr, i*2+1)
    return obj
  }
}

class Node{
    // numStructItems is 4 for the orderBookHeap, 2 otherwise
    constructor(rpcResponse, numStructItems = 2){
        if(rpcResponse.slice(0,2) == "0x" ){
            rpcResponse = rpcResponse.slice(2, rpcResponse.length)
        }
        this.id = parseInt("0x" + rpcResponse.slice(0, 66))
        this.priority = parseInt("0x" + rpcResponse.slice(66, 130))
    }
    id(){ return parseInt(this[0]) }
    priority(){ return parseInt(this[1]) }
    price(){ return this.priority() }//alias
    user(){ return this[2].slice(26, this[2].length) }
    volume(){ return parseInt(this[3]) }

    print(){
      let str = "(" + this.id.toString() + ")" + this.priority.toString() + " "
      process.stdout.write(str)
    }
}




module.exports = {Heap, Node}
