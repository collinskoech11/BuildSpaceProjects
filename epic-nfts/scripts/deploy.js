const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deploiyed();
  console.log("contract deployed to : ", nftConttract.address());
  let txn = await nftContract.makeAnEpicNft()

  await txn.wait();
  console.log("Minted an NFT #1")

  txn = await nftContract.makeAnEpicNft()
  await txn.wait();
  console.log("minted an NFT 2")
};

const runMain = async () => {
  try{ 
    await main();
    process.exit(0);
  } catch (error){
    console.log(error);
    process.exit(1)
  }
}