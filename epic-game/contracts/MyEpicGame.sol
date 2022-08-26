// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";


contract MyEpicGame {

    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string ImageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;


    CharacterAttributes[] defaultCharacters;

    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    mapping(address => uint256) public nftHolders;

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint[] memory characterHp,
        uint[] memory characterAttackDmg
    )
    ERC721("Heroes", "HERO")
    {
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
        uint256 newItemId = _tokenIds.curent();
        _safeMint(msg.sender, newItemId);

        nftHolderAttributes[newItemId] =  CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage
        });
        console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);
        nftHolders[msg.sender] = newItemId;

        _tokenIds.increment();
    }
}