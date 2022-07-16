const main = async () => {
    // Hardhat is the hre
    const nftContractFactory  = await hre.ethers.getContractFactory('MyEpicNFT');//compile ocontract generate byte code 
    const nftContract = await nftContractFactory.deploy();//create local network for deploying destroy when done 
    await nftContract.deployed();//wait until the contract is mined and deployed to the local blockchain
    console.log("Contract deployed to : ", nftContract.address)
   };

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();