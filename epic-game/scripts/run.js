
const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');//compile MyEpicGame.sol contract
    const gameContract = await gameContractFactory.deploy(
        ["Leo", "Aang", "Pikachu"],
        ["https://i.imgur.com/pKd5Sdk.png","https://i.imgur.com/xVu4vFL.png","https://i.imgur.com/WMB6g9u.png"],
        [100, 200, 300],//hp
        [100, 50, 25],//attack damage
        "Elon Musk",
        "https://i.imgur.com/AksR0tt.png",
        10000,
        50
    );// create local ethereum network
    await  gameContract.deployed();//wait for tx to be mined
    console.log("Contract deployed to:", gameContract.address);//log the address of the deployed smart contract

    // let txn;
    // txn = await gameContract.mintCharacterNFT(2);
    // await txn.wait();

    // txn = await gameContract.attackBoss();
    // await txn.wait();

    // txn = await gameContract.attackBoss();
    // await txn.wait();


    // let returnedTokenUri = await gameContract.tokenURI(1);
    // console.log("Token URI : ", returnedTokenUri);
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