pragma solidity 0.5.7;
import "./AssetToken.sol";
import "./ArtToken.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";

contract Escrow {
    AssetToken public ASSET_TOKEN;
    ArtToken public ART_TOKEN;
    address benificiary;

    mapping(uint256 => address) public ownership;
    mapping(uint256 => address) public funding;


    constructor(address payable _benificiary, address _artToken, address _assetToken) public {
        benificiary = _benificiary;
        ART_TOKEN = ArtToken(_artToken);
        ASSET_TOKEN = AssetToken(_assetToken);
    }

    function link(address _owner, uint256 _tokenId) public {
        ART_TOKEN.safeTransferFrom(_owner, address(this), _tokenId);
        ownership[_tokenId] = _owner;
        require(ART_TOKEN.ownerOf(_tokenId) == address(this), "Linking went wrong");
    }

    function completeFundPurchase(uint256 _tokenId, uint256 _price) public {
        require(ownership[_tokenId] != address(0), "Already Sold");
        require(ART_TOKEN.ownerOf(_tokenId) == address(this), "Buy cannot happen");
        ART_TOKEN.safeTransferFrom(address(this), msg.sender, _tokenId);
        require(ART_TOKEN.getPrice(_tokenId) == _price, "The funding cannot be grater then the price");
        require(ASSET_TOKEN.transferFrom(msg.sender, funding[_tokenId], (_price * 95)/100),"Transfer Went wrong");
        require(ASSET_TOKEN.transferFrom(msg.sender, address(this), (_price * 5)/100),"Transfer Went wrong");
    }

    function buy(uint256 _tokenId, uint256 _price) public {
        require(ownership[_tokenId] != address(0), "Already Sold");
        require(ART_TOKEN.ownerOf(_tokenId) == address(this), "Buy cannot happen");
        ART_TOKEN.safeTransferFrom(address(this), msg.sender, _tokenId);
        require(ART_TOKEN.getPrice(_tokenId) == _price, "The funding cannot be grater then the price");
        require(ASSET_TOKEN.transferFrom(address(this), msg.sender, (_price * 90)/100),"Transfer Went wrong");
        require(ASSET_TOKEN.transferFrom(address(this), msg.sender, (_price * 10)/100),"Transfer Went wrong");
        ownership[_tokenId] = address(0);
    }

    function fund(uint256 _tokenId, uint256 _price) public {
        require(ownership[_tokenId] != address(0), "Already Sold");
        require(ART_TOKEN.ownerOf(_tokenId) == address(this), "Cannot fund without listing the Art");
        require((ART_TOKEN.getPrice(_tokenId) * 90)/100 == _price, "The funding price don't Match");
        require(ASSET_TOKEN.transferFrom(msg.sender, address(this), _price),"Transfer Went wrong");
        funding[_tokenId] = msg.sender;
    }

    function reclaim(uint256 _tokenId) public {
        require(ownership[_tokenId] != address(0), "Cannot reclaim nothing");
        ART_TOKEN.safeTransferFrom(address(this), msg.sender, _tokenId);
    }

    function getOwnership(uint256 _tokenId) public view returns(address) {
        return ownership[_tokenId];
    }

    function getFundingStatus(uint256 _tokenId) public view returns(address) {
        return funding[_tokenId];
    }
}