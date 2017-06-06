import { GmjackWebPage } from './app.po';

describe('gmjack-web App', () => {
  let page: GmjackWebPage;

  beforeEach(() => {
    page = new GmjackWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
