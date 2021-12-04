// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts@4.3.2/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.3.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.3.2/security/ReentrancyGuard.sol";

contract MiniSora is ERC721Enumerable, Ownable, ReentrancyGuard {
    
    using Strings for uint;

    string internal metadataDirCID;

    // This can be the OpenSea URI of the chainrand NFT, which contains
    // Chainrand's address and the Chainrand token ID.
    // The Chainrand NFT contains all the information to reproduce the 
    // exact attributes of this generative collection for verification.
    string public PROVENANCE; 

    uint public constant MAX_TOKENS = 32;

    uint public constant MAX_TOKENS_PER_MINT = 10;

    uint public constant MINT_FEE = 10000000000000000; // 0.01 ETH

    /// @dev 1: opened, 255: closed. 
    uint saleState;

    event Revealed(string, string);

    constructor() ERC721("Mini Sora", "MSora") { 
        saleState = 255; 
    }

    /// @dev Mint tokens.
    function mint(uint _numTokens) public payable nonReentrant {
        require(MINT_FEE * _numTokens <= msg.value, "Insufficient payment.");
        require(_numTokens <= MAX_TOKENS_PER_MINT, "Tokens per mint exceeded");
        require(_numTokens > 0, "Minimum number to mint is 1.");
        require(saleState == 1, "Sale is not opened.");

        for (uint i = 0; i < _numTokens; i++) {
            uint tokenId = totalSupply();
            require(tokenId < MAX_TOKENS, "No more tokens available.");
            _safeMint(msg.sender, tokenId);
        }
    }
    
    /// @dev Mint tokens for the creator.
    function selfMint(uint _numTokens) public onlyOwner {
        for (uint i = 0; i < _numTokens; i++) {
            uint tokenId = totalSupply();
            require(tokenId < MAX_TOKENS, "No more tokens available.");
            _safeMint(msg.sender, tokenId);
        }
    }

    /// @dev Withdraws Ether for the owner.    
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        payable(msg.sender).transfer(amount);
    }

    /// @dev Returns the token URI.
    function tokenURI(uint _tokenId) override public view returns (string memory) {
        require(_tokenId < totalSupply(), "Token not found.");
        if (bytes(metadataDirCID).length == 0) {
            return "";
        }
        return string(abi.encodePacked("https://", metadataDirCID, 
            ".ipfs.dweb.link/metadata/", _tokenId.toString(), ".json"));
    }

    /// @dev Set the metadata directory CID
    function reveal(string memory _metadataDirCID, string memory _provenance) public onlyOwner {
        metadataDirCID = _metadataDirCID;
        PROVENANCE = _provenance;
        emit Revealed(_metadataDirCID, _provenance);
    }

    /// @dev Opens the sale.
    function openSale() public onlyOwner {
        saleState = 1;
    }

    /// @dev Closes the sale.
    function closeSale() public onlyOwner {
        saleState = 255;
    }
}