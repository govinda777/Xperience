// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Create2.sol";
import "./SuperAccount.sol";

/**
 * Super Account Factory
 * A factory contract for SuperAccount
 */
contract SuperAccountFactory {
    SuperAccount public immutable accountImplementation;

    constructor(IEntryPoint _entryPoint) {
        accountImplementation = new SuperAccount(_entryPoint);
    }

    /**
     * create an account, and return its address.
     * if the account is already created, then just return (and NOT call initialize)
     */
    function createAccount(address owner, uint256 salt) public returns (SuperAccount ret) {
        address addr = getAddress(owner, salt);
        uint256 codeSize = addr.code.length;
        if (codeSize > 0) {
            return SuperAccount(payable(addr));
        }
        ret = SuperAccount(payable(Create2.deploy(0, bytes32(salt), abi.encodePacked(type(SuperAccount).creationCode, abi.encode(accountImplementation.entryPoint())))));
        ret.initialize(owner);
    }

    /**
     * calculate the counterfactual address of this account as it would be returned by createAccount()
     */
    function getAddress(address owner, uint256 salt) public view returns (address) {
        return Create2.computeAddress(bytes32(salt), keccak256(abi.encodePacked(type(SuperAccount).creationCode, abi.encode(accountImplementation.entryPoint()))));
    }
}
