pragma solidity 0.5.7;
import '@openzeppelin/contracts/token/ERC721/ERC721MetadataMintable.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol';

contract ArtToken is ERC721MetadataMintable, ERC721Enumerable, ERC721Burnable {
    mapping(uint256 => uint256) public artPrice;
    constructor(string memory _name, string memory _symbol)
        public
        ERC721Metadata(_name, _symbol){
        }

    function getAllTokensOf(address _owner) public view returns (uint256[] memory) {
        return (_tokensOfOwner(_owner));
    }

    function mintToken(address _to, string memory _tokenUriHash, uint256 _price)
    public
    onlyMinter
    returns (bool) {
        uint tokenId = super.totalSupply();
        bool isMint = super.mintWithTokenURI(_to, tokenId, _tokenUriHash);
        require(isMint,"Something went wrong in minting");
        artPrice[tokenId] = _price;
        return isMint;
    }

    function getPrice(uint256 _tokenId)
    public
    view
    returns(uint256){
        return artPrice[_tokenId];
    }

    function getOwnerOf(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function setPrice(uint256 _tokenId, uint256 _price)
    public
    {
        require(getOwnerOf(_tokenId) == msg.sender, "Only Owner can change the price");
        artPrice[_tokenId] = _price;
    }

}
