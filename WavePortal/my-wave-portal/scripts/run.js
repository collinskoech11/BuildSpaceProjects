const main = async () => {
    // const [owner, randomPerson] = await hre.ethers.getSigners()
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");//compiem our contract store files under artifacts
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1'),
    });//hardhat creates  local ethereum network
    await waveContract.deployed();//wait till the contract is deployed 
    console.log("Contract address : ", waveContract.address);
    // console.log("Contract deployed by", owner.address);//address of the person deploying the cpontract

    // let waveCount;
    // waveCount = await waveContract.getTotalWaves();//check wave count total
    // console.log(waveCount.toNumber());
    let contractBalance= await hre.ethers.provider.getBalance(
        waveContract.address
    );

    console.log(
        "Contract Balance :",
        hre.ethers.utils.formatEther(contractBalance)
    );

    //send a few waves

    let waveTxn = await waveContract.wave("Tingiza Mti");//make a new wave
    await waveTxn.wait();//wait for the transaction to be mined 



    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract Balance:",
        hre.ethers.utils.formatEther(contractBalance)
    )

    // waveCount = await waveContract.getTotalWaves();//recheck the number of waves

    // const [_, randomPerson] = await hre.ethers.getSigners();
    // // waveTxn = await waveContract.connect(randomPerson).wave();//random person makes a new wave 
    // waveTxn = await waveContract.connect(randomPerson).wave("Another banga");
    // await waveTxn.wait();

    let allWaves = await waveContract.getAllWaves();
    // waveCount = await waveContract.getTotalWaves();
    console.log(allWaves);
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