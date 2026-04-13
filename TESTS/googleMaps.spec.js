// Precondition: Initial agreements and settings have been clicked on manually after a build of a new emulator

const { remote } = require('webdriverio');

// Initializing the driver with desired capabilities for Google Maps
const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'emulator-5554',
    'appium:chromedriver_autoDownload': true,
    'appium:setWebContextsDebuggingEnabled': true,
    'appium:nativeWebScreenshot': true,
    'appium:newCommandTimeout': 300,
    'appium:appPackage': 'com.google.android.apps.maps',
    'appium:appActivity': 'com.google.android.maps.MapsActivity',
    'appium:noReset': true,   
};

// Actual test body
import GoogleMapsPage from '../test/pageobjects/googleMaps.page.js';

async function main() {
    const driver = await remote({
        protocol: 'http',
        hostname: '127.0.0.1',
        port: 4723,
        path: '/',
        capabilities
    });
   
    console.log("Step 1 : Waiting for the search box to be visible in English");
    
    await GoogleMapsPage.searchEn.waitForExist({ timeout: 15000});

    console.log("Step 2 : Waiting for Use Maps on Chrome and clicking on it if it appears");
    
    await GoogleMapsPage.useMapsOnChrome.waitForExist({ timeout: 20000 });
    await GoogleMapsPage.useMapsOnChrome.click();
    
    console.log("Info: 'Use Maps on Chrome' option has been clicked, the test continues...");

    console.log("Step 3 : Waiting for the search box to be fully displayed in Czech and setting text into it");

    // Hardcore pause to allow the browser to load
    await driver.pause(15000); 

    /*
    const contexts = await driver.getContexts();
    console.log("Available contexts: ", contexts);
    await driver.switchContext('WEBVIEW_com.google.android.apps.maps');

    const routeElement = await $('android=new UiSelector().textContains("Trasa")');
    await routeElement.waitForExist({ timeout: 150000 });
    console.log("Info: Search box in Czech is visible, the test continues...")
    try {
        await routeElement.waitForExist({ 
            timeout: 150000,
            reverse: false,
            timeoutMsg: 'Error: The page has not loaded.'
        });
        
        console.log("Error: The page has not loaded.");
        
        await driver.pause(2000);

    } catch (error) {
        console.log("Info: The test has failed:" + error.message);
    }
    /*
   await driver.waitUntil(async () => (await driver.execute(() => document.readyState)) === 'complete', {
        timeout: 150000,
        timeoutMsg: 'Error: Page did not load within the expected time.'
    });
*/
    await driver.performActions([{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
            { type: 'pointerMove', duration: 0, x: 550, y: 300 },  
            { type: 'pointerDown', button: 0 },
            { type: 'pointerUp', button: 0 }
        ]
    }]);

    await driver.pause(2000);
    await driver.keys(['P', 'a', 'c', 'k', 'e', 't', 'a', ' ', 'G', 'r', 'o', 'u', 'p']);
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