const { clickElement, putText, getText } = require("./lib/commands.js");
const { selectDateTime, orderTickets } = require("./lib/util.js");

let page;
let tomorrow = "nav.page-nav > a:nth-child(2)";
let weekLater = "nav.page-nav > a:nth-child(7)";
let movieTime = "[data-seance-id='129']";
let ticketHint = "p.ticket__hint";

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto("http://qamid.tmweb.ru/client/index.php");
  await page.setDefaultNavigationTimeout(0);
});

afterEach(() => {
  page.close();
});

describe("Cinema tests", () => {
  test("Should order one ticket for Movie tomorrow", async () => {
    await selectDateTime(page, tomorrow, movieTime);
    await orderTickets(page, 5, 1);
    const actual = await getText(page, ticketHint);
  });

  test("Should try to order ticket for Movie if seat is taken already", async () => {
    await expect(async () => {
      await selectDateTime(page, tomorrow, movieTime);
      await orderTickets(page, 5, 1);
    }).rejects.toThrowError("Seat(s) is taken");
  });

  test("Should order several tickets for Movie tomorrow", async () => {
    await selectDateTime(page, tomorrow, movieTime);
    await orderTickets(page, 3, 1, 2);
    const actual = await getText(page, ticketHint);
  });

  test("Should order several tickets for Movie week later", async () => {
    await selectDateTime(page, weekLater, movieTime);
    await orderTickets(page, 5, 3, 4, 5, 6);
    const actual = await getText(page, ticketHint);
  });

  test("Check if the place is taken after ordering ", async () => {
    let row = 1;
    let seat = 4;
    await selectDateTime(page, weekLater, movieTime);
    await orderTickets(page, row, seat);
    await page.goto("http://qamid.tmweb.ru/client/index.php");
    await selectDateTime(page, weekLater, movieTime);
    const classExist = await page.$eval(
      `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${seat})`,
      (el) => el.classList.contains("buying-scheme__chair_taken")
    );
    expect(classExist).toEqual(true);
  });
});
