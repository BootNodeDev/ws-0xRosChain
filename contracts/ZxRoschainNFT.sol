// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * @title ZxRosChainNFT
 * @author lmcorbalan
 * @dev A simple version of a minter contract.
 * WARNING: This contract is meant to be used in a Solidity workshop and is not production ready at all, it may contain
 * a lot of security risks.
 */
contract ZxRosChainNFT is ERC721 {
    // The max amount of tokens that can be minted. Can't be changed
    uint256 public immutable MAX_SUPPLY;

    /**
     * @dev Base URI for computing {tokenURI}.
     */
    string private _baseTokenURI;

    /**
     * @dev The id of the next token to be minted.
     */
    uint256 public nextId;


    error ZxRosChainMinter__mint_maxSupplyReached();

    /**
     * @dev Sets the Base URI, name and symbol.
     */
    constructor(string memory _uri, uint256 _maxSupply) ERC721("0xRosChainNFT", "0xRSC") {
        _baseTokenURI = _uri;
        MAX_SUPPLY = _maxSupply;
    }

    /**
     * @dev Safely the next tokenId and transfers it to `_to`.
     */
    function mint(address _to) external returns (uint256) {
        if (nextId >= MAX_SUPPLY) revert ZxRosChainMinter__mint_maxSupplyReached();
        uint256 tokenId = nextId++;
        _safeMint(_to, tokenId);
        return tokenId;
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`.
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
