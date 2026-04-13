class GoogleMapsPage {
    constructor(driver) {
        this.driver = driver;
    }

    get searchEn() {
        return this.driver.$('android=new UiSelector().text("Search here")');
    }

    get useMapsOnChrome() {
        return this.driver.$('//android.widget.Button[contains(@text, "Maps on Chrome")]');
    }
}
module.exports = GoogleMapsPage;