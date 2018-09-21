import "./Heap.sol";

contract Delegate{ // an upgradeable interface

  using Heap for Heap.Data;
  Heap.Data public data;

  struct MarketOrder{
    uint32 id;           // holds up to 2.4 billion 32
    uint64 price;        // implied market cap of 200 Billion 38
    uint64 amount;       // entire supply 52
    uint64 createdAt;    // thousand years 36
    address user;        //+160 = 318 bits :(
  }
  mapping(uint128 => MarketOrder) marketOrders; 

  address implementation;        // key: 0
  address collective;            // key: 1

  constructor(address _implementation, address _collective){ 
    implementation = _implementation; 
    collective   = _collective;
  }

  function () public payable{
    assembly{
      let m := mload(0x40)
      calldatacopy(m,0,calldatasize)
      let success := delegatecall(gas, sload(implementation_slot), m, calldatasize, m, 0)
      returndatacopy(m,0,returndatasize)

      switch success
      case 0 { revert(m, returndatasize()) }
      default { return(m, returndatasize()) }
    }
  }

}
