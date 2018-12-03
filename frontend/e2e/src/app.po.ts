import {browser, by, element} from 'protractor';

/**
 * @ignore
 */
export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitleText() {
    return element(by.id('maintitle')).getText();
  }

  getCSSText(cssSelector: string) {
    return element(by.css(cssSelector)).getText();
  }

  loginAsAdmin() {
    // login as administrator
    element(by.css('a[aria-label="Login / Logout"]>span')).click();
    browser.sleep(1000);
    element(by.css('input[name="username"]')).sendKeys('admin');
    element(by.css('input[name="password"]')).sendKeys('admin');
    element(by.css('button:nth-of-type(2)>span')).click();
    browser.sleep(1000);
  }
}
