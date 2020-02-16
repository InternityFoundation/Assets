pragma solidity 0.5.7;
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract AssetToken is ERC20Mintable, ERC20Detailed, ERC20Burnable {
    constructor(
        string memory name, string memory symbol, uint8 decimals, address to, uint256 value
    ) public ERC20Detailed(name, symbol, decimals) {
        super.mint(to, value);
    }
}
