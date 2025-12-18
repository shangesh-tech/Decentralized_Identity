// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract Web3PortfolioRegistry is Ownable, Pausable {

    uint256 public totalPortfolios;
    uint256 public totalDonations;

    uint256 public constant RECOVERY_DELAY = 30 minutes;

    struct Portfolio {
        string userName;              // public portfolio handle
        string ipfsDocumentHash;      // portfolio metadata (JSON)
        uint256 createdAt;
        uint256 lastUpdated;
        address controller;           // active wallet
        address backupAddress;        // recovery wallet
        bool isPrivate;
        bool exists;
    }

    mapping(address => Portfolio) private portfolios;
    mapping(string => address) private usernameToPortfolio;

    mapping(address => address) public pendingController;
    mapping(address => uint256) public recoveryStartedAt;

    /* ---------- EVENTS ---------- */

    event PortfolioCreated(address indexed portfolio, address indexed controller);
    event PortfolioUpdated(address indexed portfolio);
    event VisibilityUpdated(address indexed portfolio, bool isPrivate);
    event BackupAddressUpdated(address indexed portfolio, address backup);
    event RecoveryInitiated(address indexed portfolio, address newController);
    event RecoveryFinalized(address indexed portfolio, address newController);
    event RecoveryCancelled(address indexed portfolio);
    event DonationReceived(address indexed donor, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /* ---------- PORTFOLIO CREATION ---------- */

    function createPortfolio(
        string memory _userName,
        string memory _ipfsHash,
        bool _isPrivate,
        address _backupAddress
    ) external whenNotPaused {
        require(!portfolios[msg.sender].exists, "Portfolio exists");
        require(usernameToPortfolio[_userName] == address(0), "Username taken");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");

        portfolios[msg.sender] = Portfolio({
            userName: _userName,
            ipfsDocumentHash: _ipfsHash,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp,
            controller: msg.sender,
            backupAddress: _backupAddress,
            isPrivate: _isPrivate,
            exists: true
        });

        usernameToPortfolio[_userName] = msg.sender;
        totalPortfolios++;

        emit PortfolioCreated(msg.sender, msg.sender);
    }

    modifier onlyController(address portfolio) {
        require(portfolios[portfolio].controller == msg.sender, "Not controller");
        _;
    }

    /* ---------- PORTFOLIO MANAGEMENT ---------- */

    function updatePortfolio(address portfolio, string memory _newHash)
        external
        whenNotPaused
        onlyController(portfolio)
    {
        require(bytes(_newHash).length > 0, "Invalid IPFS hash");
        portfolios[portfolio].ipfsDocumentHash = _newHash;
        portfolios[portfolio].lastUpdated = block.timestamp;
        emit PortfolioUpdated(portfolio);
    }

    function updateVisibility(address portfolio, bool _isPrivate)
        external
        whenNotPaused
        onlyController(portfolio)
    {
        portfolios[portfolio].isPrivate = _isPrivate;
        portfolios[portfolio].lastUpdated = block.timestamp;
        emit VisibilityUpdated(portfolio, _isPrivate);
    }

    function updateBackupAddress(address portfolio, address _backup)
        external
        whenNotPaused
        onlyController(portfolio)
    {
        require(_backup != address(0), "Invalid backup");
        portfolios[portfolio].backupAddress = _backup;
        portfolios[portfolio].lastUpdated = block.timestamp;
        emit BackupAddressUpdated(portfolio, _backup);
    }

    /* ---------- RECOVERY ---------- */

    function initiateRecovery(address portfolio, address newController)
        external
        whenNotPaused
    {
        Portfolio storage p = portfolios[portfolio];

        require(p.exists, "Portfolio missing");
        require(msg.sender == p.backupAddress, "Not backup");
        require(newController != address(0), "Invalid controller");
        require(pendingController[portfolio] == address(0), "Recovery active");

        pendingController[portfolio] = newController;
        recoveryStartedAt[portfolio] = block.timestamp;

        emit RecoveryInitiated(portfolio, newController);
    }

    function finalizeRecovery(address portfolio)
        external
        whenNotPaused
    {
        require(pendingController[portfolio] != address(0), "No recovery");
        require(
            block.timestamp >= recoveryStartedAt[portfolio] + RECOVERY_DELAY,
            "Recovery delay not passed"
        );

        address newController = pendingController[portfolio];

        portfolios[portfolio].controller = newController;
        portfolios[portfolio].lastUpdated = block.timestamp;

        delete pendingController[portfolio];
        delete recoveryStartedAt[portfolio];

        emit RecoveryFinalized(portfolio, newController);
    }

    function cancelRecovery(address portfolio)
        external
        whenNotPaused
        onlyController(portfolio)
    {
        require(pendingController[portfolio] != address(0), "No recovery");
        delete pendingController[portfolio];
        delete recoveryStartedAt[portfolio];
        emit RecoveryCancelled(portfolio);
    }

    /* ---------- READ ---------- */

    function getPortfolio(address portfolio)
        external
        view
        returns (Portfolio memory)
    {
        require(portfolios[portfolio].exists, "Portfolio not found");
        require(!portfolios[portfolio].isPrivate, "Portfolio private");
        return portfolios[portfolio];
    }

    function getPortfolioByUsername(string memory name)
        external
        view
        returns (Portfolio memory)
    {
        address portfolio = usernameToPortfolio[name];
        require(portfolio != address(0), "Username not found");
        return portfolios[portfolio];
    }

    /* ---------- DONATIONS ---------- */

    function donate() external payable whenNotPaused {
        require(portfolios[msg.sender].exists, "Portfolio required");
        require(msg.value > 0, "Zero donation");
        totalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool ok,) = owner().call{value: amount}("");
        require(ok, "Withdraw failed");
        emit Withdrawn(owner(), amount);
    }

    /* ---------- ADMIN ---------- */

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    receive() external payable { totalDonations += msg.value; }
    fallback() external payable { revert("Invalid call"); }
}
