const fs = require("fs");
const puppeteer = require('puppeteer');
const url = 'https://shisetsu.city.arakawa.tokyo.jp/stagia/reserve/gin_menu'; // 任意のURL;
const waitTime = 5000;
const waitTimeForSamePage = 1000;

const userId = "";
const passWord = ""

// よく使う記法まとめ
// https://qiita.com/rh_taro/items/32bb6851303cbc613124

// 要素の選択方法まとめ
// https://qiita.com/go_sagawa/items/85f97deab7ccfdce53ea
(async function () {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const response = await page.goto(url);

  await page.waitFor('input[alt="多機能操作"]', {timeout: waitTime});
  page.click('input[alt="多機能操作"]');


  await page.waitFor('#user', {timeout: waitTime});
  await page.type('#user', userId);
  await page.type('#password', passWord);
  await page.click('input[alt="ログイン"]');

  await page.waitFor('#to-top-page', {timeout: waitTime});
  const g_sessionId = await page.$eval('#to-top-page', el => el.children[0].getAttribute("href").replace("/stagia/reserve/gml_login?g_sessionid=", ""));

  await page.goto(`https://shisetsu.city.arakawa.tokyo.jp/stagia/reserve/gml_z_group_sel_1?u_genzai_idx=0&g_kinonaiyo=17&g_sessionid=${g_sessionId}`)

  await page.waitFor('select[name="g_bunruicd_1_show"]', {timeout: waitTime});
  await page.select('select[name="g_bunruicd_1_show"]', '1300');
  await page.evaluate(({}) => submitBunrui1(), {});
  await page.waitFor(waitTimeForSamePage)

  await page.select('select[name="g_bunruicd_2_show"]', '1350');
  await page.evaluate(({}) => submitBunrui2(), {});
  await page.waitFor(waitTimeForSamePage)

  await page.select('select[name="riyosmk"]', '200');
  await page.evaluate(({}) => changed(), {});
  await page.waitFor(waitTimeForSamePage)

  await page.evaluate(({}) => btnSELALL_3(), {});
  await page.waitFor(waitTimeForSamePage)
  await page.evaluate(({}) => btnOK_3(), {});
  await page.waitFor(waitTimeForSamePage)

  await page.select('select[name="g_heyacd"]', "2,716,71,7115000", "2,716,71,7116000", "2,716,71,7117000", "2,716,71,7118000", "2,716,71,7119000", "2,720,71,7122000", "2,762,76,7602000", "2,762,76,7603000", "2,762,76,7604000", "2,762,76,7605000", "2,762,76,7606000", "2,762,76,7609000", "2,762,76,7607000", "2,762,76,7608000")
  
  await page.evaluate(({}) => heyaOK(), {});
  await page.waitFor(waitTimeForSamePage)

  await page.evaluate(({}) => {
    clickYobi(0);
    clickYobi(6);
    clickYobi(7);
  }
  , {});
  await page.click('#btnOK');

  // 予約ページへの遷移待ち
  await page.waitFor(waitTime)
  await outputScreenshot("", "test.jpg", page);
  // ここから空いているところ探し。
  // 次へがなくなるまで操作
  let existsNext = true;
  while(existsNext) { 
    await scrapeReservePage(page)
    existsNext = false
  }
  browser.close();
})();


const outputScreenshot = async (baseFolder, fileName, page) => {
  const path = "results";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  await page.screenshot({ "path": `./${path}/${fileName}` });
}

const scrapeReservePage = async (page) => {
  //
  const tbodyList = await page.$$("tbody");
  for (tbody of tbodyList) {
    const tdList = await tbody.$$("td");
    const targetList  = tdList.filter(td => td.textContent !== "Ｘ")
    console.log(targetList)
  }
}