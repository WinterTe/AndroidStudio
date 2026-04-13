class SearchOnChromePage {

    constructor(driver) {
        this.driver = driver;
    }

    get resultTitle() {
        return this.driver.$('//*contains(@text, "Packeta")]');
    }

    get companyAddress() {
        return this.driver.$('//android.widget.TextView[contains(@text, "Českomoravská 2408, 190 00 Praha 9-Libeň")]');
    }
}
module.exports = SearchOnChromePage;