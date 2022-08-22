import './App.css';
import {useEffect, useState} from 'react'
import { ethers } from 'ethers';
// import { Contract } from 'ethers';
import abi from "./utils/WavePortal.json"

function App() {
  const contractABI = abi.abi;
  const contractAddress = "0x4B57fde21Be0109BDC9C36DC38e8d95702C7A5E7"
  const [currentAccount, setCurrentAccount] = useState("")
  const [allWaves, setAllWaves] = useState([])
  const [message, setMessage] = useState("")
  


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
    console.log("CLICKED")
    try{
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer= provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retreived total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(message);
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
  const handleMessage =  (e) =>{
    setMessage(e.target.value);
  }
  const getAllWaves = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp* 1000),
            message: wave.message
          });
        });
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object does not exist")
      }
    } catch(error){
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
          <input type="text" onChange={handleMessage}/>
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
          <button onClick={getAllWaves}>get</button>
          {/**render connect button if there is no account */}
          {!currentAccount && (
            <button onClick={connectWallet}> connect Wallet</button>
          )}

          {allWaves.map((wave, index) => {
            return (
              <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
