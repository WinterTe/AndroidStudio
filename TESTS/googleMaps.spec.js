const { remote } = require('webdriverio');

const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'emulator-5554',
    'appium:appPackage': 'com.google.android.apps.maps',
    'appium:appActivity': 'com.google.android.maps.MapsActivity',
    'appium:noReset': true,
};

async function main() {
    const driver = await remote({
        protocol: 'http',
        hostname: '127.0.0.1',
        port: 4723,
        capabilities
    });

    const chromeOption = await driver.$('/*[contains(@text, "Use Maps on Chrome")]');
    await driver.waitUntil(async () => await chromeOption.isExisting(), {
        timeout: 10000,
        timeoutMsg: "Error: 'Use Maps on Chrome' option did not appear within the expected time.",
        interval: 500
    }).then(async () => {
        await chromeOption.click();
        console.log("Info: 'Use Maps on Chrome' option was displayed and clicked.");
    }).catch(() => {
        console.log("Info: 'Use Maps on Chrome' option was not displayed, proceeding with the test.");
    });

    // Setting the text into the search box
    const searchBox = await driver.$('android=new UiSelector().text("Vyhledání místa")');
    await searchBox.click();
    await searchBox.setValue('Packeta Group');
    await driver.pressKeyCode(66) // presses Enter key

    // Waiting for loading and verification of company name
    const resultTitle = await driver.$('//*contains(@text, "Packeta")]');
    await driver.waitUntil(async () => {
        return await resultTitle.isDisplayed();
    }, {
        timeoutMsg :'Error : Search result Packeta has not been displayed in due time.'
    });

    const actualName = await resultTitle.getText();
    const isCorrectName = actualName.includes('Packeta Group') || actualName.includes('Packeta s.r.o');
    
    if (!isCorrectName) {
        throw new Error(`Error : Search result has incorrect name. Expected: "Packeta Group" or "Packeta s.r.o", Actual: "${actualName}"`);
    }
    console.log(`Test passed: Search result has correct name: ${actualName}`);

    // Scrolling to the address
    const addressSnippet = "Českomoravská 2408";
    const scrollSelector = `new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("${addressSnippet}"))`;
    
    await $(`android=${scrollSelector}`);

    const addressElement = await $('//android.widget.TextView[contains(@text, "Českomoravská")]');
    const actualAddress = await addressElement.getText();
    const expectedAddress = "Českomoravská 2408, 190 00 Praha 9-Libeň";

    console.log(`Actual address is : ${actualAddress}`);

    if (actualAddress.includes(expectedAddress)) {
        console.log("Test passed: Address is correct.");
    } else {
        throw new Error(`Error: Address is incorrect. Expected: "${expectedAddress}", Actual: "${actualAddress}"`);
    }
}

main();