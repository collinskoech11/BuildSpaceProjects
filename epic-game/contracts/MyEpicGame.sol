// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./libraries/Base64.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";


contract MyEpicGame is ERC721 {

    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string ImageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }

    using Counters for Counters.Counter;//Nft unique identifier
    Counters.Counter private _tokenIds;


    CharacterAttributes[] defaultCharacters;

    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    mapping(address => uint256) public nftHolders;//store owner of the nft for easy later redferencing

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterHp,
        uint[] memory characterAttackDmg,
        string memory bossName,
        string memory bossImageURI,
        uint bossHp,
        uint bossAttackDamage

    )
    ERC721("Heroes", "HERO")
    {
        bigBoss = BigBoss({
            name: bossName,
            ImageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });
        console.log("Done initializing boss %s w/ HP %s, img %s", bigBoss.name, bigBoss.hp, bigBoss.ImageURI);
        for (uint i=0; i<characterNames.length; i+=1){
            defaultCharacters.push(CharacterAttributes({
                characterIndex: i,
                name: characterNames[i],
                ImageURI: characterImageURIs[i],
                hp: characterHp[i],
                maxHp: characterHp[i],
                attackDamage: characterAttackDmg[i]
            }));

            CharacterAttributes memory c = defaultCharacters[i];
            console.log("Done Initializing %s w/ HP %s", c.name, c.hp, c.ImageURI);
        }
        _tokenIds.increment();
    }

    function mintCharacterNFT(uint _characterIndex) external {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);// assigns token id to the cllers wallet address

        nftHolderAttributes[newItemId] =  CharacterAttributes({//mapnft attributes based on the character Id they send in 
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            ImageURI: defaultCharacters[_characterIndex].ImageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
        });

        console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);
        nftHolders[msg.sender] = newItemId;//easy way to see who owns the nft

        _tokenIds.increment();//Increment token id for the next person that uses it 
        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }



    struct BigBoss {
        string name;
        string ImageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }
    BigBoss public bigBoss;


    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];//retreives  specific NFT data by querying for its specific tokenId 

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

        string memory json = Base64.encode(//structuring data to follow a specific format
            abi.encodePacked(
                '{"name":"',
                charAttributes.name, 
                ' -- NFT #: ',
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                charAttributes.ImageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage, '} ]}'
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,",json)
        );
        return output;
    }
    function attackBoss() public{
        // get the state of the players nft
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
        console.log("\n PLayer w/ character %s about  to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
        console.log("Boss %s has  %s HP and %s AD", bigBoss.name,bigBoss.hp, bigBoss.attackDamage);
        // make sure the player has more than 0 hp
        require(
            player.hp > 0,
            "Error: character must have HP to attack boss"
        );
        // make sure the boss has more than 0 hp
        require(
            bigBoss.hp > 0,
            "Error:boss must have hp to attack character"
        );
        // allow the boss to attack the boss
        if( bigBoss.hp < player.attackDamage) {
            bigBoss.hp = 0;
        } else {
            bigBoss.hp = bigBoss.hp - player.attackDamage;
        }
        // allow theboss to attack a player 
        if(player.hp < bigBoss.attackDamage) {
            player.hp = 0;
        } else {
            player.hp = player.hp - bigBoss.attackDamage;
        }

        console.log("Player attacked Boss. New boss hp : %s", bigBoss.hp);
        console.log("Boss has attacked player. New player hp: %s\n", player.hp);
        // tomato entry flash raw quote print uncover glad west stand join cream
        emit AttackComplete(msg.sender, bigBoss.hp, player.hp);
    }

    function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
        // get the token id of the users character NFT
        uint256 userNftTokenId = nftHolders[msg.sender];
        // If the user has a tokenId in the map, return their character
        if ( userNftTokenId >0){
            return nftHolderAttributes[userNftTokenId];
        }
        // Else, return an empty character
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }
    //retreive all the default characters
    function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
        return defaultCharacters;
    }
    //retreive boss
    function getBigBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }
    event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
    event AttackComplete(address sender, uint newBossHp, uint newPlayerHp);  
}