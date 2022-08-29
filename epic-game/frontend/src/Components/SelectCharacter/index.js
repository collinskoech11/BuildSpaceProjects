import React, {useEffect, useState} from 'react';
import './SelectCharacter.css';
import {ethers} from "ethers";
import {CONTRACT_ADDRESS, transformCharacterData} from "../../constants"
import myEpicGame from "../../utils/MyEpicGame.json"



const SelectCharacter = ({ setCharacterNFT }) => {
    const [characters, setCharacters] = useState([])
    const [gameContract, setGameContract] = useState(null);

    const renderCharacters = () => 
    characters.map((character, index) => (
        <div className="character-item" key={character.name}>
        <div className="name-container">
            <p>{character.name}</p>
        </div>
        <img src={`${character.imageURI}`} alt={character.name} />
        <button
            type="button"
            className="character-mint-button"
            onClick={()=> mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ));

    const mintCharacterNFTAction = async (characterId) => {
        try{
            if(gameContract) {
                console.log('Minting character in progres ...');
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
                console.log('mintTxn :', mintTxn);
            }
        } catch(error){
            console.warn("mintCharacterActionError", error)
        }
    };

    useEffect(() => {
        const {ethereum} = window;

        if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );

            setGameContract(gameContract);
        } else {
            console.log("Ethereum object was not found")
        }
    }, [])
    useEffect(() => {
        const getCharacters = async () => {
            try{
                console.log('Getting contract characters to mint');
                // call contract to get all mintable characters
                const charactersTxn = await gameContract.getAllDefaultCharacters();
                console.log('charactersTxn', charactersTxn);
                //go through all our characters and transform the data 
                const characters = charactersTxn.map((characterData) => 
                    transformCharacterData(characterData)
                );
                // set all mintable characters in the state 
                setCharacters(characters);
            } catch(error){
                console.error('Something went wrong while fetching all minted data', error);
            }
        };
        // add callback method that will fire when this event is received
        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(
                `CharacterNFTMinted - sender : ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );

            if(gameContract) {
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log('CharacterNFT : ', characterNFT);
                setCharacterNFT(transformCharacterData(characterNFT));
            }
        };

        if(gameContract){
            getCharacters();
            // setup NFT MInted Listener
            gameContract.on('CharacterNFTMinted',onCharacterMint);
        }

        return () =>{
            //when component unmounts clean up the listener
            if(gameContract) {
                gameContract.off('CharacterNFTMinted', onCharacterMint);
            }
        };
    }, [gameContract])
    return (
        <div className="select-character-container">
            <h2>Mint Your Hero Choose Wisely.</h2>
            {/* Only show this when characters are in state */}
            {characters.length > 0 && (
                <div className="character-grid">{renderCharacters()}</div>
            )}
        </div>
    )
}

export default SelectCharacter;