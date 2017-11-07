import { AppPage } from './app.po';

describe('angular-templates App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should have correct title', () => {
    page.navigateTo();
    expect(page.getTitle()).toEqual('Angular Drag Drop');
  });
});
