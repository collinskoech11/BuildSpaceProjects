const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners()
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");//compiem our contract store files under artifacts
    const waveContract = await waveContractFactory.deploy();//hardhat creates  local ethereum network
    await waveContract.deployed();//wait till the contract is deployed 


    console.log("Contract deployed to : ", waveContract.address);
    console.log("Contract deployed by", owner.address);//address of the person deploying the cpontract

    let waveCount = 0;
    waveCount = await waveContract.getTotalWaves();//check wave count total

    let waveTxn = await waveContract.wave();//make a new wave
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();//recheck the number of waves

    waveTxn = await waveContract.connect(randomPerson).wave();//random person makes a new wave 
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();
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