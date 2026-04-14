class SearchOnChromePage {

    constructor(driver) {
        this.driver = driver;
    }

    get resultTitle() {
        return this.driver.$("//*[contains(text(), 'Packeta')][2]");
    }

    get companyAddress() {
        return this.driver.$("//*[contains(text(), 'Českomoravská 2408')]");
    }
}
module.exports = SearchOnChromePage;