const treeify = require('treeify');

class Heap extends Array{
    constructor(rpcResponse){
      super(0)
      super.push(new Node("0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"))
      this.parse(rpcResponse)
    }
    parse(rpcResponse){
        for (var i = 258; i < rpcResponse.length ; i=i+128){
            super.push(new Node(rpcResponse.slice(i, i+128)))
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
    constructor(rpcResponse){
        if(rpcResponse.slice(0,2) != "0x" ){
            rpcResponse = "0x" + rpcResponse
        }
        this.id = parseInt(rpcResponse.slice(0, 66))
        this.priority = parseInt("0x" + rpcResponse.slice(66, 130))
    }
    print(){
      let str = "(" + this.id.toString() + ")" + this.priority.toString() + " "
      process.stdout.write(str)
    }
}


module.exports = {Heap, Node}
