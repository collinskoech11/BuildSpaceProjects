const main = async () => {
    const WaveContractFactory = await hre.ethers.getContractFactory("WavePortal");//lookfor this contract & compile it to produce abi
    const WaveContract = await WaveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),//parse ether to the contract while deploying
    });// hardhat creates a local ethereum network
    await WaveContract.deployed();//wait till the contract is deployed to the blockchain
    console.log("Contract deployed to ", WaveContract.address);//gives the address of the deployed contract


    let contractBalance = await hre.ethers.provider.getBalance(
        WaveContract.address
    )
    console.log(
        "Contract Balance : ", 
        hre.ethers.utils.formatEther(contractBalance)
    );

    let waveCount; 
    waveCount = await WaveContract.getTotalWaves();
    console.log(waveCount.toNumber())

    //send a few waves
    let waveTxn = await WaveContract.wave("A message!");
    await waveTxn.wait();// wait for the transacrtion to be mined 

    const [_, randomPerson] = await hre.ethers.getSigners();
    waveTxn = await WaveContract.connect(randomPerson).wave("Another message");
    await waveTxn.wait(); //wait for the transaction to be mined
    
    let allWaves = await WaveContract.getAllWaves();
    console.log(allWaves)
};

const runMain =  async () => {
    try{
        await main();
        process.exit(0);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
};

runMain();