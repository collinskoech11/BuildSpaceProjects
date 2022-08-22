// SPDX-Licennse-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves; 
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }
    Wave[] waves;

    constructor()payable{
        console.log("Wave portal");
        seed = (block.timestamp + block.difficulty) % 100;
    }
    
    function wave(string memory _message) public payable{
        totalWaves+=1;
        console.log("has waved", msg.sender, _message);
        waves.push(Wave(msg.sender, _message, block.timestamp));
        seed = (block.timestamp + block.difficulty) % 100;
        console.log("Random # generated %d", seed);
        if(seed < 50){
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0000000001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more than the contract has."
            );
            (bool success, )= (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw the money from teh smart contract");
        }
        emit NewWave(msg.sender, block.timestamp, _message);
    }
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }
    function getTotalWaves() public view returns (uint256) {
        console.log("we have waves ", totalWaves);
        return totalWaves;
    }
}