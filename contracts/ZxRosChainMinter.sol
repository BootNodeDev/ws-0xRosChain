// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { MerkleProof } from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

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

    // Keep track of users addresses that already minted to NFT
    // user -> token -> minted
    mapping(address => mapping(address => bool)) public minters;

    // Merkle tree root hash
    mapping(address => bytes32) public merkelRoots;

    error ZxRosChainMinter__mint_userAlreadyMinted();
    error ZxRosChainMinter__mint_tokenNotSet();
    error ZxRosChainMinter__mint_invalidMerkleProof();

    event SetToken(address token);
    event SetMerkleRoot(bytes32 merkleRoot);
    event MintToken(address indexed token, address indexed receiver, uint256 indexed tokenId);

    /**
     * @dev Sets the token this contract mints.
     */
    function setToken(address _token) external onlyOwner {
        token = IERC721Minter(_token);

        emit SetToken(_token);
    }

    /**
     * @dev Sets the current the merkleRoot for the current token.
     */
    function setMerkelRoots(bytes32 _merkleRoot) external onlyOwner {
        merkelRoots[address(token)] = _merkleRoot;

        emit SetMerkleRoot(_merkleRoot);
    }

    /**
     * @dev Mint a new token for the caller of this function.
     * @param proofs The proofs to validate with the merkle root that the user is included in the list of allowed users
     */
    function mint(bytes32[] calldata proofs) external {
        if (address(token) == address(0)) revert ZxRosChainMinter__mint_tokenNotSet();
        if (minters[_msgSender()][address(token)]) revert ZxRosChainMinter__mint_userAlreadyMinted();
        if (!MerkleProof.verify(proofs, merkelRoots[address(token)], keccak256(abi.encodePacked(_msgSender()))))
            revert ZxRosChainMinter__mint_invalidMerkleProof();


        uint256 tokenId = token.mint(_msgSender());
        minters[_msgSender()][address(token)] = true;

        emit MintToken(address(token), _msgSender(), tokenId);
    }
}
