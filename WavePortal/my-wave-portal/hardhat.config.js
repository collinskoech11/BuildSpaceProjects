require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env"})
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY]
    },
    // mainnet: {
    //   chainId: 1,
    //   url: "https://eth-mainnet.g.alchemy.com/v2/scs-t-DA9_YbvqqY4HllXqUhvA6KvVoA",
    //   accounts: ["42132572d56ce0b2571ac849428bc81aff5c00f934753f7840972da21d974e99"],
    // }
  },
};
