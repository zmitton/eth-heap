pragma solidity 0.4.24;
// pragma experimental ABIEncoderV2;
import "./Heap.sol";

// kovan: 0x186c67B6c7f35C35f1Ac87Fb659681aA96b16fFb
contract BountyHeap{
    using Heap for Heap.Data;
    Heap.Data public data;

    uint public createdAt;
    address public author;

    constructor() public {
        data.init();
        createdAt = now;
        author = msg.sender;
    }

    function () public payable{}

    function withdraw() public{
        require(now > createdAt + 2592000); //60*60*24*30 = 30 days
        author.transfer(address(this).balance);
    }
    function breakCompletenessTreeProperty(uint indexHole, uint indexNonHole, address recipient) public{
        if(data.getByIndex(indexHole).id == 0){ //hole exists
            if(data.getByIndex(indexNonHole).id != 0 && indexHole < indexNonHole){
                recipient.transfer(address(this).balance);
            }
        }
    }
    function breakParentsHaveGreaterPriorityProperty(uint indexChild, address recipient) public{
        if(data.nodes.length > indexChild && indexChild > 1){ // parent 
            if(data.nodes[indexChild].priority > data.nodes[indexChild/2].priority){
                recipient.transfer(address(this).balance);
            }
        }
    }
    function breakIdMaintenanceProperty(int128 id, address recipient) public{
        if(data.indices[id] != 0){ // id exists in mapping structure
            if(data.nodes[data.indices[id]].id != id){ //but refers to wrong or absent node in array
                recipient.transfer(address(this).balance);
            }
        }
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
    // // unfortunately the function below requires the experimental compiler
    // // which cant be verified on etherscan. Hopefully soon it will be standard.
    // function dump() public view returns(Heap.Node[]){
    //     return data.dump();
    // }
    function getMax() public view returns(int128){
        return data.getMax().priority;
    }
    function getById(int128 id) public view returns(int128){
        return data.getById(id).priority;
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
