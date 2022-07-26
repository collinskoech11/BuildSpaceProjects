import React,{ useEffect, useState } from 'react';
import './App.css';
// import TwitterLogo from 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/2491px-Twitter-logo.svg.png'

const TWITTER_HANDLE = '_buildspace'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const checkIfWalletIsConnected = async () => {
    try{
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom){
          console.log('Phantom Wallet found')
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with pulic key : ',
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('solana object nt found get the Phantom wallet ')
      }
    } catch (error) {
      console.error(error)
    }
  };

  const connectWallet = async () => {
    const {solana} = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with public key',response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  )
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    }
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  },[]);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>

          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          {/* <img alt="Twitter Logo" className="twitter-logo" src={} /> */}
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;
