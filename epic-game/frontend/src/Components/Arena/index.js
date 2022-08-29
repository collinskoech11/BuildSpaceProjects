import React, {useState, useEffect} from "react";
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS, transformCharacterData} from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css'

// we pass our characterNFT mertadata so we can show a cool card in our UI
const Arena   = ({ characterNFT }) => {
    const [gameContract, setGameContract] = useState(null)
    //boss state
    const [boss, setBoss]= useState(null)

    //render content
    // const renderContent = () => {
    //     if(!currentAccount){
    //     return (
    //         <div className="connect-wallet-container">
    //             <img
    //             src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
    //             alt="Monty Python Gif"
    //             />
    //             <button
    //             className="cta-button connect-wallet-button"
    //             onClick={connectWalletAction}
    //             >
    //             Connect Wallet To Get Started
    //             </button>
    //         </div>
    //     );
    //     } else if (currentAccount && !characterNFT) {
    //         return (
    //             <SelectCharacter setCharacterNFT={setCharacterNFT} /> 
    //         );
    //     } else if (currentAccount){
    //         return <Arena characterNFT={characterNFT}/>
    //     }
    // }

    //useEffects
    useEffect(() => {
        const {ethereum} = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );
            setGameContract(gameContract);
        } else {
            console.log('Ethereum Object found')
        }
    },[]);

    useEffect(() =>{
        //setup async function that will get boss fromour contract
        const fetchBoss = async () =>{
            const bossTxn = await gameContract.getBigBoss();
            console.log('Boss : ', bossTxn);
            setBoss(transformCharacterData(bossTxn));
        };

        if(gameContract) {
            //lets fetch our boss
            fetchBoss();
        }
    },[gameContract])

    return (
        <div className="arena-container">
            {/* Boss Goes gere */}
            <p>Boss Goes here</p>
            {/* Character NFT  */}
            <p>Character NFT goes here</p>
        </div>
    );
};
export default Arena;