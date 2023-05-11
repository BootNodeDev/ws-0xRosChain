// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IERC721Minter is IERC721 {
    function mint(address _to) external returns (uint256);
}
