// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

//inherit the contract we just imported. This means we'll have access to the inherited contract methods
// Openzeplin implements the NFT standard for us and lets us write logic on top of it to customize it 
contract MyEpicNFT  is ERC721URIStorage {
    // inherit from openzeplin contract => importing functions for us to use
    // Open zeplin helps us keep track of the tokenIDs
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    //pass name of our NFT tokens and its symbol.
    constructor() ERC721 ("SquareNFT", "SQUARE") {
        console.log("This is the nft contract");
    }
    //A function out user will hit to get their NFT
    function makeAnEpicNft() public {
        // Get the current token ID's, this starts with 0
        uint256 newItemId = _tokenIds.current();//_nftTokenId is a state variable which means if altered the value is stored on the contract directly
        //Actually mint the NFT to the sender using msg.sender
        _safeMint(msg.sender, newItemId);// mint the ntf with the id of newItemId
        //set the NFT data to the
        _setTokenURI(newItemId, "../Data/data.json");
        console.log("An NFT with ID %s has been minted to %s", newItemId, msg.sender);
        //increment the counter for when the next NFT is minted.
        _tokenIds.increment();//move to the next NFT
    }
}