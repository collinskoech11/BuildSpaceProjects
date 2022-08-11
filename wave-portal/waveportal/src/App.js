import './App.css';
import {useEffect, useState} from 'react'
import { ethers } from 'ethers';
// import { Contract } from 'ethers';
import abi from "./utils/WavePortal.json"

function App() {
  const contractABI = abi.abi;
  const contractAddress = "0xaCFaef0E39B91b23E9BFa172Ad37c30378ffC946"
  const [currentAccount, setCurrentAccount] = useState("")
  const checkIfWalletIsConnected = async() => {
    try{
      const {ethereum} = window;
      if (!ethereum) {
        console.log("Make sure you have metamask");
      } else {
        console.log("We have the ethereum object", ethereum);
      }
  
      const accounts = await ethereum.request({method: "eth_accounts"});
  
      if (accounts.length !== 0){
        const account = accounts[0];
        console.log("Found and authorized account : ", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account available")
      }
    } catch(error){
      console.log(error)
    }


    
  }
  const connectWallet = async() => {
    try{
      const {ethereum} = window;

      if(!ethereum) {
        alert("Get Metamask");
        return;
      }
      const accounts = await ethereum.request({ method:"eth_requestAccounts"});

      console.log("connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch(error){
      console.log(error)
    }
  }
  const wave = async() => {
    try{
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer= provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retreived total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash)

        count = await wavePortalContract.getTotalWaves();
        console.log('Retreived totalWave count...', count.toNumber())
      } else {
        console.log("Ethereum object does not exist")
      }
    } catch (error){
      console.log(error)
    }
  }
  useEffect(() =>{
    checkIfWalletIsConnected();
  }, [])
  return (
    <div className="App">
       <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
          👋 Hey there!
          </div>

          <div className="bio">
            I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
          </div>

          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
          {/**render connect button if there is no account */}
          {!currentAccount && (
            <button onClick={connectWallet}> connect Wallet</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
