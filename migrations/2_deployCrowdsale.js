const TestToken = artifacts.require('TestToken');
const TestCrowdsale = artifacts.require('TestCrowdsale');

let BigNumber = require('big-number');

module.exports = async function(deployer, network, accounts) {
    let owner = accounts[0];
    let wallet = accounts[9];

    // deploying token
    await deployer.deploy(TestToken, "Testing Token", "TST", 18);

    // deploy crowdsale
    let milliseconds = (new Date).getTime(); // Today time
    let currentTimeInSeconds = parseInt(milliseconds / 1000);
    let oneDayInSeconds = 86400;
    let openingTime = currentTimeInSeconds + 60; // openingTime after a minute
    let closingTime = openingTime + (oneDayInSeconds * 90); // closingTime after 90 days
    let rate = 1000; //1000 MST tokens per ether
    let cap = BigNumber(10000).pow(18); // 10000 ** 18 = 10000 ether

    await deployer.deploy(
        TestCrowdsale,
        rate,
        wallet,
        TestToken.address,
        openingTime,
        closingTime,
        cap
    )

    // Owner Adds MinterRole for TestCrowdsale
    let testToken = await TestToken.deployed();
    testToken.addMinter(TestCrowdsale.address);

    // owner renounce minter
    testToken.renounceMinter();
}