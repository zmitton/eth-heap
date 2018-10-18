const BountyHeap = artifacts.require('BountyHeap');

// Number of tests to run
const testCount = 3;

// Max elements to generate
const maxNumberOfNewElements = 4;

// Max number of combined tests
const maxCombinedTests = 4;

// Max numbers used in tests
const maxNumberRange = 20;

// Owner of contract
let owner;

// Player
let player;

contract('BountyHeap', async (accounts) => {
  owner = accounts[0];
  player = accounts[1];

  it('fuzzy test: add, remove, extract max, extract by id', async () => {
    await repeatTest(
      async () => {
        const bountyHeap = await BountyHeap.new(owner, { from: owner });

        let elements = await addRandomElements([], bountyHeap);

        // Check size
        assert.strictEqual(
          elements.length,
          (await bountyHeap.size.call()).toNumber(),
          'size not as expected',
        );

        // Do all validity checks before starting to extract max
        await checkAll(elements, bountyHeap);

        const combinedTestCount = Math.floor(Math.random() * maxCombinedTests) + 1;

        for (let i = 0; i < combinedTestCount; i++) {
          // Sort and extract the maximum element
          await elements.sort((a, b) => a - b);
          const maxElementExpected = elements.pop();

          // Read max element
          const maxElement = (await bountyHeap.extractMax.call()).toNumber();
          // Pop max element
          await bountyHeap.extractMax();

          // Check max element
          assert.equal(
            maxElement,
            maxElementExpected,
            'Max element incorrect',
          );

          // Do all checks after max was extracted
          await checkAll(elements, bountyHeap);

          // Add a few random elements and check again
          elements = await addRandomElements(elements, bountyHeap);

          // Do all checks after a few more elements were added
          await checkAll(elements, bountyHeap);

          // Remove a random element with extractById()
          const randomIndex = Math.floor(Math.random() * (await bountyHeap.size.call()).toNumber()) + 1;
          const randomID = (await bountyHeap.getIdByIndex.call(randomIndex)).toNumber();
          const extracted = (await bountyHeap.extractById.call(randomID)).toNumber();

          // Extract the element
          await bountyHeap.extractById(randomID);

          // Remove the element from the array representation
          const extractedIndex = elements.indexOf(extracted);
          elements.splice(extractedIndex, 1);

          // Run a consistency check again
          await checkAll(elements, bountyHeap);

          // Add another element
          elements = await addRandomElements(elements, bountyHeap, 1);

          // Run a consistency check again
          await checkAll(elements, bountyHeap);
        }
      },
      testCount,
    );
  });
});

const addRandomElements = async (
  elements,
  bountyHeap,
  howMany = Math.floor(Math.random() * maxNumberOfNewElements) + 1,
) => {
  const elementsCount = howMany;

  const randomElements = [];
  for (let i = 0; i < elementsCount; i++) {
    const newElement = Math.floor(Math.random() * maxNumberRange - (maxNumberRange / 2));
    randomElements.push(newElement);
  }

  for (let i = 0; i < randomElements.length; i++) {
    // Generate a number between -maxNumberRange to +maxNumberRange
    const newElement = randomElements[i];
    elements.push(newElement);

    console.log(`Adding ${newElement}`);

    await bountyHeap.insert(newElement);
  }

  return elements;
};

const repeatTest = async (runnable, count) => {
  try {
    for (let i = 0; i < count; i++) {
      console.log('==================');
      console.log(`Running test: ${i}`);
      await runnable();
    }
  } catch (error) {
    console.log('Error running test');
    console.log(error);
  }
};

const checkParentPriority = async (elements, bountyHeap) => {
  console.log('Checking parent priority');

  const sortedElements = elements.slice(0).sort((a, b) => a - b).reverse();

  for (let i = 2; i <= sortedElements.length; i++) {
    const child = (await bountyHeap.getByIndex.call(i)).toNumber();
    const parent = (await bountyHeap.getByIndex.call(Math.floor(i / 2))).toNumber();

    assert.isAtMost(
      child,
      parent,
      `parent: ${parent} -> child: ${child}`,
    );
  }

  console.log('Passed');
};

const checkCompleteness = async (elements, bountyHeap) => {
  console.log('Checking completeness');

  for (let i = 1; i <= elements.length - 1; i++) {
    for (let j = i + 1; j <= elements.length; j++) {
      const beforeID = (await bountyHeap.getIdByIndex.call(i)).toNumber();
      const afterID = (await bountyHeap.getIdByIndex.call(j)).toNumber();

      if ((beforeID == 0) && (afterID != 0)) {
        assert.fail(
          beforeID,
          afterID,
          `beforeID: ${beforeID} -> afterID: ${afterID}`,
        );
      }
    }
  }

  console.log('Passed');
};

const checkIdMaintenance = async (elements, bountyHeap) => {
  console.log('Checking id maintenance');

  for (let i = 1; i <= elements.length; i++) {
    assertRevert(
      bountyHeap.breakIdMaintenance(i, player),
      `failed for ${i}`,
    );
  }

  console.log('Passed');
};

const checkIdMaintenance2 = async (elements, bountyHeap) => {
  console.log('Checking id maintenance 2');

  for (let i = 1; i <= elements.length; i++) {
    assertRevert(
      bountyHeap.breakIdMaintenance2(i, player),
      `failed for ${i}`,
    );
  }

  console.log('Passed');
};

const checkIdUniqueness = async (elements, bountyHeap) => {
  console.log('Checking id uniqueness');

  for (let i = 1; i <= elements.length; i++) {
    for (let j = i + 1; j <= elements.length; j++) {
      const node1ID = (await bountyHeap.getIdByIndex.call(i)).toNumber();
      const node2ID = (await bountyHeap.getIdByIndex.call(j)).toNumber();

      assert.notEqual(
        node1ID,
        node2ID,
        `failed for index: ${i}, id: ${node1ID} and index: ${j}, id: ${node2ID}`,
      );
    }
  }

  console.log('Passed');
};

const checkAll = async (elements, bountyHeap) => {
  console.log(`Checking validity for ${elements}`);

  await checkParentPriority(elements, bountyHeap);
  await checkCompleteness(elements, bountyHeap);
  await checkIdMaintenance(elements, bountyHeap);
  await checkIdMaintenance2(elements, bountyHeap);
  await checkIdUniqueness(elements, bountyHeap);
};

// assertRevert expects a revert, fails otherwise
const assertRevert = async (promise, message = 'Expected revert not received') => {
  try {
    await promise;
  } catch (error) {
    const revertFound = error.message.search('revert') >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
    return;
  }
  assert.fail(message);
};
