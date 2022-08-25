
const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');//compile MyEpicGame.sol contract
    const gameContract = await gameContractFactory.deploy()// create local ethereum network
    await  gameContract.deployed();//wait for tx to be mined
    console.log("Contract deployed to:", gameContract.address);//log the address of the deployed smart contract
};


const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

runMain();