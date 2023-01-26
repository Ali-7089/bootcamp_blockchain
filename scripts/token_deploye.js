const hre = require("hardhat");
const {ethers} =require("hardhat");

async function main() {
   const accounts = await ethers.getSigners();
   
   const Token = await ethers.getContractFactory("Token");
   const Exchange = await ethers.getContractFactory('Exchange');

   const shery = await Token.deploy("sheryians" ,"SHERY","1000000");
   await shery.deployed();
   console.log(`shery deploy at ${shery.address}`);

   const eTIT = await Token.deploy("eTIT" ,"eTIT","1000000");
   await eTIT.deployed();
   console.log(`eTIT deploy at ${eTIT.address}`);

   const sTIT = await Token.deploy("sTIT" ,"sTIT","1000000");
   await sTIT.deployed();
   console.log(`sTIT deploy at ${sTIT.address}`);

   const exchange = await Exchange.deploy(accounts[1].address,10);
   await exchange.deployed();
   console.log(`exchange deploy at ${exchange.address}`);   
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
