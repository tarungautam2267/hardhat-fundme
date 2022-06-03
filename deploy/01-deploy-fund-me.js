const { networkconfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  //const ethUsdPriceFeedAddress = networkconfig[chainId]["ethUsdPriceFeed"]
  let ethUsdPriceFeedAddress
  if (developmentChains.includes(network.name)) {
    const ethusdaggregator = await get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethusdaggregator.address
  } else {
    ethUsdPriceFeedAddress = networkconfig[chainId]["ethUsdPriceFeed"]
  }
  const args = [ethUsdPriceFeedAddress]
  const fundme = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundme.address, args)
  }
  log("-_-_-_-_-_-_-_-_-_-_-_-_-_-_")
}

module.exports.tags = ["all", "fundme"]
