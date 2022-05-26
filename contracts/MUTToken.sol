// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MUTToken is ERC20 {
    address public owner;

    constructor() ERC20("Make Up Token dev", "MUTD") {
        _mint(msg.sender, 200 * 10**18);
        owner = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        //require(msg.sender == owner, "You're not the owner");
        _mint(to, amount * 10**18);
    }

    function transferTo(address to, uint256 amount) external {
        _transfer(msg.sender, to, amount * 10**18);
    }

    function transferToMulti(
        address from,
        address[] memory to,
        uint256 amount
    ) external {
        for (uint32 i = 0; i < to.length; i++) {
            _transfer(from, to[i], amount * 10**18);
        }
    }
}
