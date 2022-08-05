const main = async () => {
    const [deployer] = await Headers.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deploying contract with account : ", deployer.address);
    console.log("account Balance : ", accountBalance.toString());

    const waveContractFactory = await Headers.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed();

    console.log("WavePortal Address : ",waveContract.address);
};

const runMain = async () =>{
    try{
        await main();
        ProcessingInstruction.
    }
}