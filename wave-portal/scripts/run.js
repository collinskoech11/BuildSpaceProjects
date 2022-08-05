const main = async () => {
    const WaveContractFactory = await hre.ethers.getContractFactory("WavePortal");//lookfor this contract & compile it to produce abi
    const WaveContract = await WaveContractFactory.deploy();// hardhat creates a local ethereum network
    await WaveContract.deployed();//wait till the contract is deployed to the blockchain
    console.log("Contract deployed to ", WaveContract.address);//gives the address of the deployed contract
};

const runMain =  async () => {
    try{
        await main();
        process.exit(0);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

runMain();