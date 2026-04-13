class GoogleMapsPage {

    get searchEn() {
        return $(`android=new UiSelector().text("Search here")`);
    }

    get useMapsOnChrome() {
        return $('//android.widget.Button[contains(@text, "Maps on Chrome")]');
    }
}
export default new GoogleMapsPage();