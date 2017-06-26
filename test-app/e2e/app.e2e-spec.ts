import { KioNg2AudioPage } from './app.po';

describe('kio-ng2-audio App', () => {
  let page: KioNg2AudioPage;

  beforeEach(() => {
    page = new KioNg2AudioPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
