## This is a Binary Heap

### How?
```
npm install eth-heap --save
```
Then from a truffle contract, `import` the library
```
import "eth-heap/contracts/Heap.sol";

```

### Why?

Allowing users to insert data into a contract can result in an issue where it costs too much gas to iterate through. This is a gas-limit attack.

A Heap is the *simplest data structure* to solve this issue because it is a tree that has **worst-case** characteristics that are proportional to the log of the number of items.

Heaps allow for insertion, deletion removing, and finding the Maximum

This particular heap also supports findById, and remove by id which solves race conditions while preserving the logarithmic upper-bound.
But you can extend this to any arbitrary data by pointing to a struct that you define yourself in a separate mapping.

These characteristics could also be achieved by an AVL Tree or a Red-Black Tree, but they are much more complicated (possibly buggy), and have an overhead of about 300k gas. This contract can do it in about 100k (depends on the function of course. extractMax is cheapest).

This approach is a good middle ground between optimization and security. The more you try to add optimizations the more complicated the logic can get, and therefore, the (potentially) less secure the contract could be. This contract is both simpler, and cheaper than an AVL tree. However, heaps are only partially sorted, if you need full sorting use the grove AVL tree by Piper.

The GAS costs of this are as follows:
```
  insert  extractMax (gas/tx)
====================
113513  112639/67639
```
This can be expected to rise very modestly. probably never more than 200k. I plan to make some charts on this to clarify.

The Heap was built to accommodate the "order book" (priority queue) for a decentralized exchange where. 
  - Users can make (and remove) as many orders as they wish
  - The contract has to automatically match the highest order

On Ethereum this sets up an issue. How do you find the "highest order"? You can *not* iterate through a dynamic array who's size is increased publicly by its users. If you do, an attacker can fill the array to the point where the iteration process will cost more gas than is allowed (block-gas-limit *currently 8 million*). A Heap mitigates these issues because the structure does not require any iteration through all the elements.

Think of it simply as a data store. `insert()` things into it, `remove()`, or find or remove the largest element in the heap (`getMax()` / `extractMax()`).

Here is the API. note that if you want to return the `Heap.Node` data types from a public function, you have to use the experimental ABIEncoderV2 for now.

```solidity

pragma experimental ABIEncoderV2;

library Heap{ // max-heap

    uint constant ROOT_INDEX = 1;

    struct Data{
        int128 idCount;
        Node[] nodes; // root is index 1; index 0 not used
        mapping (int128 => uint) indices;   // unique id => node index
    }
    struct Node{
        int128 id; //use with a mapping to store arbitrary object types
        int128 priority;
    }

    function insert(Data storage self, int128 priority) internal returns(Node){}

    function extractMax(Data storage self) internal returns(Node){}
    function remove(Data storage self, int128 id) internal returns(Node){}

    function dump(Data storage self) internal view returns(Node[]){}
    function getById(Data storage self, int128 id) internal view returns(Node){}
    function getByIndex(Data storage self, uint i) internal view returns(Node){}
    function getMax(Data storage self) internal view returns(Node){}
    function size(Data storage self) internal view returns(uint){}
}

```
See contracts/HeapClient.sol for how to hook into the library.

This is a max-heap. If you would like to use it as a min-heap, simply reverse the sign before inputing by multiplying by -1 (Although I haven't tested that yet).
