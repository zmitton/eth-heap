import "./Heap.sol";

pragma experimental ABIEncoderV2;

contract HeapClient{
    using Heap for Heap.Data;
    Heap.Data public data;
    uint[] r;

    function heapify(uint128[] priorities) public {
        for(uint i ; i < priorities.length ; i++){
            data.push(priorities[i]);
        }
    }
    function push(uint128 priority) public returns(uint128){
        return data.push(priority).id;
    }
    function pop() public returns(uint128){
        return data.pop().priority;
    }
    function remove(uint128 id) public returns(uint128){
        return data.remove(id).priority;
    }
    function get() public view returns(Heap.Node[]){
        return data.get();
    }
    function getById(uint128 id) public view returns(uint128){
        return data.getById(id).priority;
    }
    function max() public view returns(uint128){
        return data.max().priority;
    }
    function size() public view returns(uint){
        return data.size();
    }
    function getByIndex(uint i) public view returns(uint128){
        return data.getByIndex(i).priority;
    }
    function idCount() public view returns(uint128){
        return data.idCount;
    }
    function indices(uint128 id) public view returns(uint){
        return data.indices[id];
    }
    
}
