const { remote } = require('webdriverio');

// Initializing the driver with desired capabilities for Google Maps
const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'emulator-5554',
    'appium:appPackage': 'com.google.android.apps.maps',
    'appium:appActivity': 'com.google.android.maps.MapsActivity',
    'appium:noReset': true,
};

// Actual test body
async function main() {
    const driver = await remote({
        protocol: 'http',
        hostname: '127.0.0.1',
        port: 4723,
        capabilities
    });

    // Waiting for the search box to be visible in English
    console.log("Step 1 : Waiting for the search box to be visible in English");
    
    const searchEn = await driver.$('android=new UiSelector().text("Search here")');
    const searchCz = await driver.$('android=new UiSelector().text("Vyhledání místa")');
    
    await searchEn.waitForExist({ timeout: 15000});
    console.log("Info: Search box in English is visible, the test continues...");

    // Waiting for "Use Maps on Chrome" and clicking on it if it appears
    console.log("Step 2 : Waiting for Use Maps on Chrome and clicking on it if it appears");
    
    const useMapsOnChrome = await driver.$('android=new UiSelector().className("android.widget.Button").textContains("Chrome")');
    
    await useMapsOnChrome.waitForExist({ timeout: 20000 });
    await useMapsOnChrome.click();
    console.log("Info: 'Use Maps on Chrome' option has been clicked, the test continues...");

    // Waiting for the search box loading in Czech
    console.log("Step 3 : Waiting for the search box loading in Czech");
    
    await searchCz.waitForExist({ timeout: 55000 });
    console.log("Info: Search box in Czech is visible, the test continues...");

    // Setting text "Packeta Group" into the field and pressing Enter key
    console.log("Step 4 : Setting text 'Packeta Group' into the field and pressing Enter key");
    
    await searchCz.click();
    await searchCz.setValue('Packeta Group');
    await driver.pressKeyCode(66);

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