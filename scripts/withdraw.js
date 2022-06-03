const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
  const { deployer } = getNamedAccounts()
  const fundme = await ethers.getContract("FundMe", deployer)
  console.log("withdrawing..._")
  const resp = await fundme.withdraw()
  await resp.wait(1)
  console.log("Withdrawn")
}
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
