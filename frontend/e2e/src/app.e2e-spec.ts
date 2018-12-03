import {AppPage} from './app.po';
import {browser, by, element} from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  // These tests are built for use with our testing database testing.sqlite
  // which can be found in the docs folder of our github repository.

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display title', () => {
    page.navigateTo();

    // Accept cookies
    element(by.css('a[aria-label="dismiss cookie message"]')).click();
    expect(page.getTitleText()).toEqual('Job Portal');
  });

  it('should do simple search', () => {
    page.navigateTo();
    element(by.css('input[name="search"]')).sendKeys('sbb');

    // Assert that the correct search result is shown
    expect(page.getCSSText('mat-card-title')).toEqual('Kundenberater/in Businesstravel Service.');

    // Open details
    element(by.css('mat-card-actions>button>span')).click();

    // Assert that really the correct job is shown with details
    expect(page.getCSSText('li:nth-of-type(5)')).toEqual('Flair für den Umgang mit neuen Medien.');

    // Close details
    element(by.css('mat-icon[aria-label="Schliessen"]')).click();
  });

  it('should do detailed search', () => {
    page.navigateTo();
    element(by.css('app-jobs-view>button:nth-of-type(1)>span')).click();
    browser.sleep(1000);

    // Assert that the search dialog is opened
    expect(page.getCSSText('h2')).toEqual('Erweiterte Suche');

    // Perform search
    element(by.css('input[name="advCompany"]')).sendKeys('Migros');
    browser.sleep(1000);
    element(by.css('button.mat-stroked-button')).click();
    browser.sleep(1000);

    // Assert the search result
    expect(page.getCSSText('mat-card-subtitle')).toEqual('bei Migros Klubschule in Klubschule St. Gallen');

    // Reset the search
    element(by.css('app-jobs-view>button:nth-of-type(2)>span')).click();
  });

  it('should register new user', () => {
    page.navigateTo();

    element(by.css('a[aria-label="Login / Logout"]>span')).click();
    browser.sleep(1000);

    // Open registration form
    element(by.css('button:nth-of-type(3)>span')).click();
    browser.sleep(1000);

    // Assert that we are on the correct page
    expect(page.getCSSText('h2')).toEqual('Registration');

    element(by.css('input[name="company"]')).sendKeys('Salt Mobile');

    // Open logo search
    element(by.css('button:nth-of-type(3)>span>mat-icon')).click();
    browser.sleep(8000);

    // Pick first logo
    (element.all(by.css('img[class="logoContent"]:nth-of-type(1)'))).get(0).click();
    browser.sleep(1000);

    element(by.css('input[name="email"]')).sendKeys('salt@hr.ch');
    element(by.css('input[name="username"]')).sendKeys('salt');
    element(by.css('input[name="password"]')).sendKeys('test');

    // Press registration button
    (element.all(by.css('button>span'))).get(3).click();
  });

  it('should create job as company', () => {
    page.navigateTo();

    // Login as company
    element(by.css('a[aria-label="Login / Logout"]>span')).click();
    browser.sleep(500);
    element(by.css('input[name="username"]')).sendKeys('swisscom');
    element(by.css('input[name="password"]')).sendKeys('xtra123');
    element(by.css('button:nth-of-type(2)>span')).click();
    browser.sleep(500);

    // Access 'Jobs verwalten' page
    element(by.css('a[ng-reflect-router-link="/editJobs"]')).click();
    browser.sleep(500);

    // Assert that we are on the correct page
    expect(page.getCSSText('h2')).toEqual('Jobverwaltung');

    // Create new job
    element(by.css('input[name="title"]')).sendKeys('Software Engineer JAVA');
    browser.sleep(500);
    element(by.css('button[color="primary"]')).click();
    browser.sleep(1000);

    // Assert that the job was created correctly
    expect(page.getCSSText('mat-panel-title')).toEqual('Software Engineer JAVA');

    // Open job
    element(by.css('mat-panel-description')).click();

    // Enter details
    element(by.css('input[name="departement"]')).sendKeys('Mobilfunkmasten');
    browser.sleep(100);
    element(by.css('input[name="placeofwork"]')).sendKeys('Bern');
    browser.sleep(100);
    (element.all(by.css('button[aria-label="Open calendar"]:nth-of-type(1)'))).get(0).click();
    browser.sleep(500);
    element(by.css('button[aria-label="Next month"]')).click();
    browser.sleep(500);
    (element.all(by.css('td[class^="mat-calendar-body-cell ng-star-inserted"]'))).get(0).click();
    browser.sleep(500);
    element(by.css('button[aria-label="Choose the current date"]>span')).click();
    browser.sleep(3000);
    element(by.css('input[name="salaryAmount"]')).clear();
    browser.sleep(100);
    element(by.css('input[name="salaryAmount"]')).sendKeys('6000');
    browser.sleep(500);
    element(by.css('textarea[name="shortDescription"]')).sendKeys('Interessante Stelle in der schönen Stadt Bern!');
    browser.sleep(500);
    element(by.css('textarea[data-provide="markdown"]')).sendKeys('## Bester Job der Welt!');
    browser.sleep(500);
    element(by.css('input[name="phone"]')).sendKeys('+41 00 000 00 00');
    browser.sleep(500);
    element(by.css('input[name="website"')).sendKeys('www.swisscom.ch');
    browser.sleep(500);
    element(by.css('textarea[name="contactinfo"]')).sendKeys('Claudia Musterfrau');
    browser.sleep(500);

    // Check if job is created an unapproved
    expect(page.getCSSText('span[class^="warning"]')).toEqual('Job ist noch ungeprüft!');
  });

  it('should change password as company', () => {
    page.navigateTo();

    // Navigate to account settings
    element(by.css('a[ng-reflect-router-link="/editAccount"]')).click();
    browser.sleep(500);

    // Assert that we are on the correct page
    expect(page.getCSSText('h2')).toEqual('Kontoeinstellungen');

    // Enter new password
    element(by.css('input[name="password"]')).sendKeys('xtra456');
    element(by.css('input[name="password2"]')).sendKeys('xtra456');
    browser.sleep(500);

    // Save new password
    (element.all(by.css('button[class="mat-stroked-button"]'))).get(1).click();
    browser.sleep(500);

    // Assert that password was saved successfully
    expect(page.getCSSText('simple-snack-bar>span')).toEqual('Neues Passwort gespeichert!');

    // Log out as company
    element(by.css('a[aria-label="Login / Logout"]>span')).click();
  });

  it('should login as admin', () => {
    page.navigateTo();

    // Login as admin
    page.loginAsAdmin();

    // Assert that we are really logged in
    expect(page.getCSSText(
      'mat-nav-list:nth-of-type(4)>a>div:nth-of-type(1)>span:nth-of-type(1)'))
      .toEqual('Kontoeinstellungen');
    expect(page.getCSSText('a[aria-label="Login / Logout"]>span')).toEqual('Logout');
  });

  it('should accept jobs', () => {
    page.navigateTo();

    // Access 'Jobs verwalten' page
    element(by.css('a[ng-reflect-router-link="/editJobs"]')).click();
    browser.sleep(1000);

    // Assert that we are on the correct page
    expect(page.getCSSText('h2')).toEqual('Jobverwaltung');

    // Open the first job
    (element.all(by.css('mat-panel-description'))).get(0).click();

    // Accept the job
    (element.all(by.css('button:nth-of-type(3)'))).get(2).click();
    browser.sleep(1000);

    // Assert that there are no unaccepted jobs
    expect((element.all(by.css('mat-icon'))).get(0).getAttribute('class'))
      .toEqual('mat-icon material-icons ng-star-inserted');
  });

  it('should perform user operations', () => {
    page.navigateTo();

    // Access 'Benutzerverwaltung' page
    element(by.css('a[ng-reflect-router-link="/editUsers"]')).click();
    browser.sleep(1000);

    // Assert that we are on the correct page
    expect(page.getCSSText('h2')).toEqual('Benutzerverwaltung');

    // Create new moderator
    element(by.css('input[name="username"]')).sendKeys('mod1');
    element(by.css('input[name="password"]')).sendKeys('modpw');
    browser.sleep(200);
    element(by.css('mat-card:nth-of-type(2)>button:nth-of-type(2)')).click();
    browser.sleep(200);

    // Assert that the moderator was created correctly
    expect(page.getCSSText('tr:nth-of-type(9)>td:nth-of-type(1)>span')).toEqual('mod1');

    // Activate new user
    (element.all(by.css('td>span'))).get(6).click();
    browser.sleep(200);
    element(by.css('tr:nth-of-type(14)>td>div:nth-of-type(1)>mat-action-row>button:nth-of-type(1)')).click();
    browser.sleep(200);

    // Accept changes by user 'sbb'
    (element.all(by.css('td>span'))).get(7).click();
    browser.sleep(200);
    element(by.css('tr:nth-of-type(16)>td>div:nth-of-type(1)>mat-action-row>button:nth-of-type(1)')).click();
    browser.sleep(200);

    // Suspend user 'post'
    (element.all(by.css('td>span'))).get(5).click();
    browser.sleep(200);
    element(by.css('tr:nth-of-type(12)>td>div:nth-of-type(1)>mat-action-row>button:nth-of-type(1)')).click();
    browser.sleep(200);
    element(by.css('app-confirm-dialog>div:nth-of-type(2)>button:nth-of-type(2)')).click();
    browser.sleep(200);
  });
});
