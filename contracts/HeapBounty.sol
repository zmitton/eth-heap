pragma experimental ABIEncoderV2;
import "./PublicHeap.sol";

contract HeapBounty is PublicHeap{
  uint public createdAt = now;
  address public author = 0x1F4E7Db8514Ec4E99467a8d2ee3a63094a904e7A;

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
}

