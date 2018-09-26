# Eth-Heap
## What?
A [Binary Heap](https://en.wikipedia.org/wiki/Binary_heap) data structure is the simplest implementation of a Priority Queue (for instance order-books). It "partially sorts" data so that the highest priority item can always be found instantly at the root.

## Why?
#### Block-Gas-Limit and the iteration problem
Allowing users to insert data into a contract can result in an issue where it costs too much gas to iterate through. This is a gas-limit-attack.

If directly using an array, an attacker can fill the array to the point where iterating through it will cost more gas than is allowed in a single transaction (the `block-gas-limit` *currently 8 million*). A Heap mitigates these issues because the structure does not require any iteration through all the elements.

#### Data structures to the rescue
Unfortunately, even though many tree structures have O log(n) costs under normal circumstances, they are **not** safe to use in public Ethereum contracts, because attackers can find conditions that *degenerate* the tree toward O(n) costs. Degenerating a tree is when you make one branch get really long.

*Self Balancing* trees solve this issue, because they cannot degenerate. They rotate or swap nodes during insertion to stay balanced, thus preserving their O log(n) costs even under **worst-case** conditions.

#### Options
A Binary Heap is a *partially-sorted*, self balancing tree that has worst-case characteristics proportional to O log(n).

If you need a *fully sorted* self balancing tree, you can use a 2-3-4 Tree, Red Black Tree, or an AVL Tree. Piper Merriam wrote [an AVL Tree](https://github.com/pipermerriam/ethereum-grove) in Solidity that he's used for the Ethereum Alarm Clock.

#### Fully-sorted vs Partially-sorted?
A Heap allows you to quickly find the *largest* of some property. It is not as quick however as the other trees at *iterating from* largest to smallest.

#### For example: 
The Heap was built to accommodate the *order-book* for a decentralized exchange where. 
- Users can make (and remove) as many orders as they wish
- The contract has to automatically match the highest order

When someone creates a sell-order, the contract must find the highest price buy-order to see if it matches (and vice-versa). If there is not a match, we do not need to find the *next* highest price buy-order, so a heap will suffice. If there *is* a match, we `extractMax()`, and the heap will re-adjust so the new highest-price order is at the top.

The more I think about it, the more I think you can solve on Ethereum using this Heap. Remember, the cost reduction requirement is only relevant to logic that's executed **on-chain**. Off-chain we can easily iterate through all the data and locally cache it however appropriate. There is a `dump()` function for doing just that. There is also an `index.js` file that can rebuild the heap in javascript and print it visually.
```javascript
const TestHeap = artifacts.require("TestHeap");
const Helpers = require("../index") // or `require("eth-heap")` from a project using npm
const Heap = Helpers.Heap
const Node = Helpers.Node
// create a testHeap contract and fill it with data
let dumpSig = "0xe4330545" //keccak("dump()")[0-8]
let response = await web3.eth.call({to:heap.address, data: dumpSig})
new Heap(response).print()
```
The only benefit of a fully-sorted tree, is that you can iterate through it from greatest to least... but that just brings back the block-gas-limit attack problem. I cant think of an application that would require an AVL Tree or a Red-Black Tree, but wouldn't run into the gas-limit attack problem.

## How? (to use)
```
npm install eth-heap --save
```
Then from a truffle contract, `import` the library
```solidity
import "eth-heap/contracts/Heap.sol";

```
#### Initialize 
Call `init()` once on the library before use

#### Data Store
Heaps allow for **insertion**, **extraction**, and **extraction of the Maximum**.

This particular heap also supports **getById**, and **extractById** which solves race conditions. `struct Node`s are `id`, `priority` pairs, but you can extend this to any arbitrary data by pointing to a `struct` that you define in a separate `mapping`, with matching `id` from the heap.

Think of it simply as a data store. `insert()` things into it, `remove()`, or find or remove the largest element in the heap (`getMax()` / `extractMax()`). Don't manipulate the data except through the API, or risk corrupting the heap integrity.

#### Max-heap / Min-heap. 
This is a *max-Heap*, if you would like to use it as a *min-heap*, simply reverse the sign before inputing (multiply by -1 (Although I haven't tested this yet)).

#### Error Handling
Bad input will result in returning the (default) zero set. For the most part, the functions will not throw errors. This allows you to handle errors in your own flexible way. When returning a node, check for `node.id == 0`.

#### API. 
*Note that if you want to return the `Heap.Node` data types from a public function, you have to use the experimental ABIEncoderV2 for now.*

```solidity
    struct Data{
        int128 idCount;
        Node[] nodes; // root is index 1; index 0 not used
        mapping (int128 => uint) indices;   // unique id => node index
    }
    struct Node{
        int128 id; //use with a mapping to store arbitrary object types
        int128 priority;
    }

    function init(Data storage self) internal {}

    function insert(Data storage self, int128 priority) internal returns(Node){}
    function extractMax(Data storage self) internal returns(Node){}
    function extractById(Data storage self, int128 id) internal returns(Node){}

    function dump(Data storage self) internal view returns(Node[]){}
    function getById(Data storage self, int128 id) internal view returns(Node){}
    function getByIndex(Data storage self, uint i) internal view returns(Node){}
    function getMax(Data storage self) internal view returns(Node){}
    function size(Data storage self) internal view returns(uint){}
```

## Gas Tests 
All gas costs rise logarithmically at worst

#### performed on 500 item sets
- `extractById()` Average Gas Costs:   69461
- `insert()` Average Gas Costs:       101261
- `extractMax()` Average Gas Costs:   170448


*Heuristic: The cost of these functions goes up by about 20,000 gas every time you double the number of data items.*

- red lines => worst-case data
- green lines => best-case data
- blue dots (insert/extractMax) => randomized data
- brown dots (extractById) => randomized data

![Insert Stats](https://raw.githubusercontent.com/zmitton/eth-heap/master/img/insertStats.png)

![Extract Stats](https://raw.githubusercontent.com/zmitton/eth-heap/master/img/extractStats.png)

This alone will never exceed the block-gas-limit and "lock-up" given Ethereum's current architecture.

