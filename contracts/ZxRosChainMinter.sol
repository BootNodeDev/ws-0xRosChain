// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

import { IERC721Minter } from "./interfaces/IERC721Minter.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * @title ZxRosChainMinter
 * @author lmcorbalan
 * @dev A simple version of a NFT contract.
 * WARNING: This contract is meant to be used in a Solidity workshop and is not production ready at all, it may contain
 * a lot of security risks.
*/
contract ZxRosChainMinter is Context, Ownable {
    /**
     * @dev The token this contract mints.
     */
    IERC721Minter public token;

    error ZxRosChainMinter__mint_tokenNotSet();

    event SetToken(address token);
    event MintToken(address indexed token, address indexed receiver, uint256 indexed tokenId);

    /**
     * @dev Sets the token this contract mints.
     */
    function setToken(address _token) external onlyOwner {
        token = IERC721Minter(_token);

        emit SetToken(_token);
    }

    /**
     * @dev Mint a new token for the caller of this function.
     */
    function mint() external {
        uint256 tokenId = token.mint(_msgSender());

        emit MintToken(address(token), _msgSender(), tokenId);
    }
}
