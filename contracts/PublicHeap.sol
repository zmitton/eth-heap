// pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;
import "./Heap.sol";

// this is a simple contract that uses the heap library.
// but it allows all data in the heap to be inserted and removed by anyone in the world!
// so you wouldnt write your contract like this, but it shows how to interactive with 
// the heap library. specifically you might use the "view" functions from below, but the 
// insert/extractMax/extractById functions you probably would put inside restrictive logic
contract PublicHeap{
  using Heap for Heap.Data;
  Heap.Data public data;

  constructor() public { data.init(); }

  function heapify(int128[] priorities) public {
    for(uint i ; i < priorities.length ; i++){
      data.insert(priorities[i]);
    }
  }
  function insert(int128 priority) public returns(Heap.Node){
    return data.insert(priority);
  }
  function extractMax() public returns(Heap.Node){
    return data.extractMax();
  }
  function extractById(int128 id) public returns(Heap.Node){
    return data.extractById(id);
  }
  //view
  function dump() public view returns(Heap.Node[]){
    return data.dump();
  }
  function getMax() public view returns(Heap.Node){
    return data.getMax();
  }
  function getById(int128 id) public view returns(Heap.Node){
    return data.getById(id);
  }
  function getByIndex(uint i) public view returns(Heap.Node){
    return data.getByIndex(i);
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
