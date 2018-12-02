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
}
