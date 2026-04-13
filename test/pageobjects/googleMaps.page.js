class GoogleMapsPage {

    get searchEn() {
        return $(`android=new UiSelector().text("Search here")`);
    }
}
export default new GoogleMapsPage();