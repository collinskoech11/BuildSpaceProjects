pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;// state variable stored permanently on the blockchain
    constructor() {
        console.log("Yo yo, Im a contract and IM smart");
    }
    function wave() public {
      totalWaves += 1;
        console.log("%s has waved!", msg.sender);// Know who exactly called the function
    }
    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}