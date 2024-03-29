import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import {CONTRACT_ADDRESS, transformCharacterData} from "./constants"
import {ethers} from "ethers"
import myEpicGame from './utils/MyEpicGame.json'
import Arena from "./Components/Arena"
// import { transform } from 'typescript';
// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;



const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);

  
  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== '4'){
        alert("Please connect to Rinkeby!")
      }
    } catch(error){
      console.log(error)
    }
  }
  const checkIfWalletIsConnected = async() => {
    try{
    const {ethereum } = window;
    if(!ethereum) {
      console.log("Make sure you have metamask installed!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      // check authorization to access the users wallet 
      const accounts = await ethereum.request({ method: 'eth_accounts'});
      //user can have multiple authorized accounts we grab the first one if its there
      if (accounts.length !== 0){
        const account = accounts[0];
        console.log('we found an authorized account :', account);
        setCurrentAccount(account);
      } else{
        console.log("No authorized accounts found")
      }
    } 
    }catch(error){
      console.log("err",error)
    }
  };
  const renderContent = () => {
    //scenio one
    if(!currentAccount){
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      )
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT}/>;
    }
  };

  const connectWalletAction = async () => {
    try{
      const {ethereum} = window;

      if(!ethereum){
        alert('Get Metamask');
        return;
      }
      //fancy method to request access to account
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      // Print the public address once we authorize metamask.
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address : ', currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer  =  provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No character NFT found");
      }
    };
    // we want to only run this if we have a connected wallet
    if(currentAccount){
      console.log('Current Account : ', currentAccount);
      fetchNFTMetadata();
    }
    checkIfWalletIsConnected();
  }, [currentAccount]);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
