const PepoStablecoin = artifacts.require("PepoStablecoin");
const MockAggregatorV3 = artifacts.require("MockAggregatorV3");

contract("PepoStablecoin", (accounts) => {
  let pepoStablecoin;
  let mockAggregator;

  beforeEach(async () => {
    mockAggregator = await MockAggregatorV3.new();

    // Deploy PepoStablecoin contract with MockAggregatorV3 address
    pepoStablecoin = await PepoStablecoin.new(mockAggregator.address);
  });
  describe("borrow function", function () {
    it("should get debt is 1000 when borrow with 50% ratio and collateral 1 eth at 2000 usd/eth.", async () => {
      const ratio = 50;
      const collateralAmount = web3.utils.toWei("1", "ether");
      const ethPrice = 2000;
      await mockAggregator.setEthPrice(ethPrice);

      await pepoStablecoin.borrow(ratio, {
        value: collateralAmount,
        from: accounts[1],
      });

      const expectedDebt = 1000;
      const actualDebt = await pepoStablecoin.getDebt(accounts[1]);
      assert.equal(
        expectedDebt,
        actualDebt,
        `expected ${expectedDebt} but got ${actualDebt}`
      );
    });

    it("should get debt is 1675 when borrow with 75% ratio and collateral 1 eth at 2234 usd/eth.", async () => {
      const ratio = 75;
      const collateralAmount = web3.utils.toWei("1", "ether");
      const ethPrice = 2234;
      await mockAggregator.setEthPrice(ethPrice);

      await pepoStablecoin.borrow(ratio, {
        value: collateralAmount,
        from: accounts[1],
      });

      const expectedDebt = 1675;
      const actualDebt = await pepoStablecoin.getDebt(accounts[1]);
      assert.equal(
        expectedDebt,
        actualDebt,
        `expected ${expectedDebt} but got ${actualDebt}`
      );
    });

    it("should revert when borrowing with invalid ratio", async () => {
      const invalidRatio = 76; // Set an invalid collateral ratio (greater than 75)

      await expectRevert(
        pepoStablecoin.borrow(invalidRatio, {
          value: web3.utils.toWei("1", "ether"),
          from: accounts[0],
        }),
        "ratio must less than equal 75%"
      );
    });
  });
});

// Helper function to handle reverts in Truffle tests
async function expectRevert(promise, errorMessage) {
  try {
    await promise;
    assert.fail("Expected revert not received");
  } catch (error) {
    // assert.include check if error.message contain errorMessage or not
    assert.include(
      error.message,
      errorMessage,
      `Expected error message "${errorMessage}" not found`
    );
  }
}
