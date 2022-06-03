const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async function () {
  let fundme
  let deployer
  let mockv3aggregator
  const sendval = ethers.utils.parseEther("1")
  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"])
    fundme = await ethers.getContract("FundMe", deployer)
    mockv3aggregator = await ethers.getContract("MockV3Aggregator", deployer)
  })

  describe("constructor", async function () {
    it("sets the pricefeed correctly", async function () {
      const resp = await fundme.priceFeed()
      assert.equal(resp, mockv3aggregator.address)
    })
  })

  describe("fund", async function () {
    it("fails to send eth", async function () {
      await expect(fundme.fund()).to.be.revertedWith(
        "You need to spend more ETH!"
      )
    })
    it("update the data structure", async function () {
      await fundme.fund({ value: sendval })
      const resp = await fundme.addressToAmountFunded(deployer)
      assert.equal(resp.toString(), sendval.toString())
    })
    it("adds funder successfully", async function () {
      await fundme.fund({ value: sendval })
      const funder = await fundme.funders(0)
      assert.equal(funder, deployer)
    })
  })

  describe("withdraw", async function () {
    beforeEach(async function () {
      await fundme.fund({ value: sendval })
    })

    it("withdraw funds for single user", async function () {
      const startingfundmebal = await fundme.provider.getBalance(fundme.address)
      const startingdeployerbal = await fundme.provider.getBalance(deployer)

      const resp = await fundme.withdraw()
      const resce = await resp.wait(1)

      const { gasUsed, effectiveGasPrice } = resce
      const gasCost = gasUsed.mul(effectiveGasPrice)

      const endingfundmebal = await fundme.provider.getBalance(fundme.address)
      const endingdeployerbal = await fundme.provider.getBalance(deployer)

      assert.equal(endingfundmebal, 0)
      assert.equal(
        startingfundmebal.add(startingdeployerbal).toString(),
        endingdeployerbal.add(gasCost).toString()
      )
    })

    it("only owner withdraws", async function () {
      const account = await ethers.getSigners()
      const attacker = account[1]
      const attackerconnected = await fundme.connect(attacker)
      await expect(attackerconnected.withdraw()).to.be.reverted
    })
  })
})
