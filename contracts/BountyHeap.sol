pragma solidity 0.4.24;
import "./Heap.sol";

contract BountyHeap{
  using Heap for Heap.Data;
  Heap.Data public data;

  uint public createdAt;
  address public author;

  constructor(address _author) public {
    data.init();
    createdAt = now;
    author = _author;
  }

  function () public payable{}

  function endBounty() public{
    require(now > createdAt + 2592000); //60*60*24*30 = 2592000 = 30 days
    author.transfer(address(this).balance); //any remaining ETH goes back to me
  }

  function breakCompleteness(uint holeIndex, uint filledIndex, address recipient) public{
    require(holeIndex > 0); // 0 index is empty by design (doesn't count)
    require(data.getByIndex(holeIndex).id == 0); //holeIndex has nullNode
    require(data.getByIndex(filledIndex).id != 0); // filledIndex has a node
    require(holeIndex < filledIndex); //HOLE IN MIDDLE OF HEAP!
    recipient.transfer(address(this).balance);
  }
  function breakParentsHaveGreaterPriority(uint indexChild, address recipient) public{
    Heap.Node memory child = data.getByIndex(indexChild);
    Heap.Node memory parent = data.getByIndex(indexChild/2);

    require(Heap.isNode(child));
    require(Heap.isNode(parent));
    require(child.priority > parent.priority); // CHILD PRIORITY LARGER THAN PARENT!
    recipient.transfer(address(this).balance);
  }
  function breakIdMaintenance(int128 id, address recipient) public{
    require(data.indices[id] != 0); //id exists in mapping
    require(data.nodes[data.indices[id]].id != id); // BUT NODE HAS CONTRIDICTORY ID!
    recipient.transfer(address(this).balance);
  }
  function breakIdMaintenance2(uint index, address recipient) public{
    Heap.Node memory n = data.getByIndex(index);

    require(Heap.isNode(n)); //node exists in array
    require(index != data.indices[n.id]); // BUT MAPPING DOESNT POINT TO IT!
    recipient.transfer(address(this).balance);
  }
  function breakIdUniqueness(uint index1, uint index2, address recipient) public{
    Heap.Node memory node1 = data.getByIndex(index1);
    Heap.Node memory node2 = data.getByIndex(index2);

    require(Heap.isNode(node1));
    require(Heap.isNode(node2));
    require(index1 != index2);     //2 different positions in the heap
    require(node1.id == node2.id); //HAVE 2 NODES WITH THE SAME ID!
    recipient.transfer(address(this).balance);
  }

  function heapify(int128[] priorities) public {
    for(uint i ; i < priorities.length ; i++){
      data.insert(priorities[i]);
    }
  }
  function insert(int128 priority) public returns(int128){
    return data.insert(priority).id;
  }
  function extractMax() public returns(int128){
    return data.extractMax().priority;
  }
  function extractById(int128 id) public returns(int128){
    return data.extractById(id).priority;
  }
  //view
  // // Unfortunately the function below requires the experimental compiler
  // // which cant be verified on etherscan or used natively with truffle.
  // // Hopefully soon it will be standard.
  // function dump() public view returns(Heap.Node[]){
  //     return data.dump();
  // }
  function getIdMax() public view returns(int128){
    return data.getMax().id;
  }
  function getMax() public view returns(int128){
    return data.getMax().priority;
  }
  function getById(int128 id) public view returns(int128){
    return data.getById(id).priority;
  }
  function getIdByIndex(uint i) public view returns(int128){
    return data.getByIndex(i).id;
  }
  function getByIndex(uint i) public view returns(int128){
    return data.getByIndex(i).priority;
  }
  function size() public view returns(uint){
    return data.size();
  }
  function idCount() public view returns(int128){
    return data.idCount;
  }
  function indices(int128 id) public view returns(uint){
    return data.indices[id];
  }
}
