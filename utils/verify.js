const { run } = require("hardhat")

const verify = async (contractaddress, args) => {
  console.log("verifying....")
  try {
    await run("verify:verify", {
      address: contractaddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified")
    } else {
      console.log(e)
    }
  }
}

module.exports = {
  verify,
}
