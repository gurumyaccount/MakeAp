// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MUTToken is ERC20 {
    address public owner;

    address mutToken = 0x2DB32Df980080758d6b522964ec23806E8Eb3CD1;

    constructor() ERC20("Make Up Token dev", "MUTD") {
        _mint(msg.sender, 200 * 10**18);
        owner = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "You're not the owner");
        _mint(to, amount);
    }
}
