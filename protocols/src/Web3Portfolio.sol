// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract Web3Portfolio is Ownable, Pausable {
    uint256 public totalPortfolios;
    uint256 public totalDonations;

    struct Portfolio {
        address ethAddress;
        string ipfsDocumentHash;
        bool isPrivate;
        bool exists;
        uint256 createdAt;
        uint256 lastUpdated;
    }

    // username => portfolio
    mapping(string => Portfolio) private portfolios;

    // wallet => username
    mapping(address => string) private addressToPortfolio;

    event PortfolioCreated(address indexed owner, string indexed userName);
    event PortfolioUpdated(address indexed owner, string userName);
    event PortfolioVisibilityUpdated(address indexed owner, string userName, bool isPrivate);
    event DonationReceived(address indexed donor, uint256 amount);
    event DonationWithdrawn(address indexed owner, uint256 amount);

    constructor() Ownable(msg.sender) {}

    function createPortfolio(string memory _userName, string memory _ipfsHash, bool _isPrivate) external whenNotPaused {
        require(bytes(_userName).length > 0, "Username empty");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        require(!portfolios[_userName].exists, "Username taken");
        require(bytes(addressToPortfolio[msg.sender]).length == 0, "Address already has portfolio");

        portfolios[_userName] = Portfolio({
            ethAddress: msg.sender,
            ipfsDocumentHash: _ipfsHash,
            isPrivate: _isPrivate,
            exists: true,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp
        });

        addressToPortfolio[msg.sender] = _userName;
        totalPortfolios++;

        emit PortfolioCreated(msg.sender, _userName);
    }

    function updatePortfolio(string memory _userName, string memory _newHash) external whenNotPaused {
        require(portfolios[_userName].exists, "Portfolio not found");
        require(portfolios[_userName].ethAddress == msg.sender, "Not portfolio owner");
        require(bytes(_newHash).length > 0, "Invalid IPFS hash");

        portfolios[_userName].ipfsDocumentHash = _newHash;
        portfolios[_userName].lastUpdated = block.timestamp;

        emit PortfolioUpdated(msg.sender, _userName);
    }

    function updatePortfolioVisibility(string memory _userName, bool _isPrivate) external whenNotPaused {
        require(portfolios[_userName].exists, "Portfolio not found");
        require(portfolios[_userName].ethAddress == msg.sender, "Not portfolio owner");

        portfolios[_userName].isPrivate = _isPrivate;
        portfolios[_userName].lastUpdated = block.timestamp;

        emit PortfolioVisibilityUpdated(msg.sender, _userName, _isPrivate);
    }

    function getMyPortfolio() external view returns (Portfolio memory) {
        string memory userName = addressToPortfolio[msg.sender];
        require(bytes(userName).length > 0, "Portfolio not found");
        return portfolios[userName];
    }

    function getPortfolioByUsername(string memory _userName) external view returns (Portfolio memory) {
        require(portfolios[_userName].exists, "Portfolio not found");

        if (portfolios[_userName].isPrivate) {
            require(portfolios[_userName].ethAddress == msg.sender, "Private portfolio");
        }

        return portfolios[_userName];
    }

    function donate() external payable whenNotPaused {
        require(msg.value > 0, "Zero donation");
        totalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool ok,) = owner().call{value: amount}("");
        require(ok, "Withdraw failed");
        emit DonationWithdrawn(owner(), amount);
    }

    function transferContractOwnership(address newOwner) external onlyOwner {
        transferOwnership(newOwner);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {
        totalDonations += msg.value;
    }

    fallback() external payable {
        revert("Invalid call");
    }
}
