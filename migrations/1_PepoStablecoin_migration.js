var PepoStablecoinContract = artifacts.require("PepoStablecoin");
var MockAggregatorV3Contract = artifacts.require("MockAggregatorV3");

module.exports = async function (deployer) {
  // Deploy MockAggregatorV3
  await deployer.deploy(MockAggregatorV3Contract);
  const mockAggregatorInstance = await MockAggregatorV3Contract.deployed();

  // Deploy PepoStablecoinContract with the address of MockAggregatorV3
  await deployer.deploy(PepoStablecoinContract, mockAggregatorInstance.address);
};
