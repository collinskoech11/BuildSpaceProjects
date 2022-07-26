// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

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

    string baseSVg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstwords = ["Hello", "world", "why", "say", "the", "heck"];
    string[] secondwords = ["Hello", "world", "why", "say", "the", "heck"];
    string[] thirdwords = ["Hello", "world", "why", "say", "the", "heck"];

    //pass name of our NFT tokens and its symbol.
    constructor() ERC721 ("SquareNFT", "SQUARE") {
        console.log("This is the nft contract");
    }

    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % firstwords.length + 1;
        return firstwords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondwords.length + 1;
        return secondwords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdwords.length + 1;
        return thirdwords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    //A function out user will hit to get their NFT
    function makeAnEpicNft() public {
        // Get the current token ID's, this starts with 0
        uint256 newItemId = _tokenIds.current();//_nftTokenId is a state variable which means if altered the value is stored on the contract directly
        // get one word from each of the three arrays and
        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);

        // concatenate it all together, and then close the text and svg tags
        string memory finalSvg = string(abi.encodePacked(baseSVg, first, second, third, "</text></svg>"));

        console.log("\n------------------------");
        console.log(finalSvg);
        console.log("--------------------------\n");
        //Actually mint the NFT to the sender using msg.sender
        _safeMint(msg.sender, newItemId);// mint the ntf with the id of newItemId
        //set the  NFT data to the
        _setTokenURI(newItemId, "data:application/json;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4KICAgIDxzdHlsZT4uYmFzZSB7IGZpbGw6IHdoaXRlOyBmb250LWZhbWlseTogc2VyaWY7IGZvbnQtc2l6ZTogMTRweDsgfTwvc3R5bGU+CiAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJibGFjayIgLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+Cjwvc3ZnPg==");
        console.log("An NFT with ID %s has been minted to %s", newItemId, msg.sender);
        //increment the counter for when the next NFT is minted.
        _tokenIds.increment();//move to the next NFT
        console.log("AnNFT w/ ID  %s has been minted to %s", newItemId, msg.sender);
    }
}
// https://gateway.pinata.cloud/ipfs/QmbyvSoqT5LmEe12bjrSAVnzji13sUBXnz4Zi3pK4thSdS