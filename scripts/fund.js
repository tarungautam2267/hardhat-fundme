const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
  const { deployer } = getNamedAccounts()
  const fundme = await ethers.getContract("FundMe", deployer)
  console.log("funding....")
  const resp = await fundme.fund({ value: ethers.utils.parseEther("0.1") })
  await resp.wait(1)
  console.log("Funded")
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
