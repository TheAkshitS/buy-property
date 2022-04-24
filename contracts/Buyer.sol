// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Buyer {
    address[100] public buyers;

    // Buying a property
    function buy(uint256 propertyId) public returns (uint256) {
        require(propertyId >= 0 && propertyId <= 99);

        buyers[propertyId] = msg.sender;

        return propertyId;
    }

    // Retrieving the buyers
    function getBuyers() public view returns (address[100] memory) {
        return buyers;
    }
}
