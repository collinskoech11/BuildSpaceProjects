pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;// state variable stored permanently on the blockchain
    event NewWave(address indexed from, uint256 timestamp, string message);//create an emit to store transaction logs
    struct Wave {//hashmap lookalike stores key value pairs
        address waver;//address of theuser who waved
        string message;// message taht the user sent 
        uint256 timestamp;// timestamp when the user waved
    }
    Wave[] waves;// declare variables waves that lets me store an array of structs
    constructor () payable {
        console.log("We have been constructed!");
    }
    function wave(string memory _message) public {//passed in the message that the user created 
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);// Know who exactly called the function
        waves.push(Wave(msg.sender, _message, block.timestamp));//store wave data to the aray waves 
        emit NewWave(msg.sender, block.timestamp, _message);// store the actual values of the transaction logs

        uint prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance, //check that prize amount is less than the balance of the contract
            "Tying to wothdraw more than the contract has"
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract");

    }
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }
    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}