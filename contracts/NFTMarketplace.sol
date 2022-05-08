// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _contestIds;
    Counters.Counter private _contestDetailsIds;

    uint256 listingPrice = 0.025 ether;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    //contest
    struct ContestItem {
        uint256 contestId;
        address payable owner;
        string contestName;
        string description;
        bool active;
        uint256 winningPrice;
        uint256 maxParticipants;
        uint256 participantFee;
        uint256 participantPrice;
    }

    event ContestItemCreated(
        uint256 indexed contestId,
        address owner,
        string contestName,
        string description,
        bool active,
        uint256 winningPrice,
        uint256 maxParticipants,
        uint256 participantFee,
        uint256 participantPrice
    );

    mapping(uint256 => ContestItem) private idToContestItem;

    //contest details
    struct ContestDetails {
        address[] participants;
    }

    //contestId => ContestDetails
    mapping(uint256 => ContestDetails) private idToContestDetails;

    constructor() ERC721("Metaverse Tokens", "METT") {
        owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint256 _listingPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) public payable {
        uint256 price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
        payable(owner).transfer(listingPrice);
        payable(seller).transfer(msg.value);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    //Contest related entries

    function createContestItem(
        string memory contestName,
        string memory description,
        uint256 winningPrice,
        uint256 maxParticipants,
        uint256 participantFee,
        uint256 participantPrice
    ) public payable {
        console.log("In createContestItem");
        require(bytes(contestName).length > 0, "Provide Contest Name");

        _contestIds.increment();
        uint256 contestId = _contestIds.current();

        idToContestItem[contestId] = ContestItem(
            contestId,
            payable(address(this)),
            contestName,
            description,
            true,
            winningPrice,
            maxParticipants,
            participantFee,
            participantPrice
        );

        emit ContestItemCreated(
            contestId,
            owner,
            contestName,
            description,
            true,
            winningPrice,
            maxParticipants,
            participantFee,
            participantPrice
        );
    }

    function fetchAllContests() public view returns (ContestItem[] memory) {
        console.log("in fetchAllContests");
        uint256 currentIndex = 0;
        ContestItem[] memory items = new ContestItem[](_contestIds.current());
        for (uint256 i = 0; i < _contestIds.current(); i++) {
            uint256 currentId = i + 1;
            ContestItem storage currentItem = idToContestItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function fetchContestParticipates(uint256 contestId)
        public
        view
        returns (ContestDetails memory)
    {
        console.log("in fetchContestParticipates");
        return idToContestDetails[contestId];
    }

    function participateInContest(uint256 contestId) public payable {
        require(idToContestItem[contestId].contestId != 0, "contest not found");
        require(
            msg.value == idToContestItem[contestId].participantFee,
            "Price must be equal to listing price"
        );
        require(
            msg.value == idToContestItem[contestId].participantFee,
            "Price must be equal to listing price"
        );

        ContestDetails storage contestDetails = idToContestDetails[contestId];

        address[] storage participants = contestDetails.participants;

        bool exists = false;

        for (uint256 i; i < participants.length; i++) {
            if (participants[i] == msg.sender) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            contestDetails.participants.push(msg.sender);
        }
    }

    function kill() public {
        require(msg.sender == owner);
        selfdestruct(payable(msg.sender));
    }
}
