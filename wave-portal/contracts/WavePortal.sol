// SPDX-Licennse-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    constructor(){
        console.log("Wave portal");
    }
    uint256 totalWaves; 
    function wave() public{
        totalWaves+=1;
        console.log("has waved", msg.sender);
    }
    function getTotalWaves() public view returns (uint256) {
        console.log("we have waves ", totalWaves);
        return totalWaves;
    }
}