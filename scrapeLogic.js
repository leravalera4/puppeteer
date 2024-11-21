const puppeteer = require("puppeteer");
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const scrapeLogic = async (res) => {
  const links = [
    "https://www.realcanadiansuperstore.ca/store-locator/details/1558",
    // "https://www.realcanadiansuperstore.ca/store-locator/details/1540",
    // "https://www.realcanadiansuperstore.ca/store-locator/details/1012",
    // "https://www.realcanadiansuperstore.ca/store-locator/details/1030",
    // "https://www.realcanadiansuperstore.ca/store-locator/details/1515", //superstore10
    // "https://www.realcanadiansuperstore.ca/store-locator/details/1017",
    // "https://www.realcanadiansuperstore.ca/store-locator/details/1518",

    // "https://www.realcanadiansuperstore.ca/store-locator/details/1569",
    // "https://www.realcanadiansuperstore.ca/store-locator/details/1570",
    // "https://www.realcanadiansuperstore.ca/store-locator/details/1571",
    // "https://www.realcanadiansuperstore.ca/store-locator/details/1572",

    // "https://www.realcanadiansuperstore.ca/store-locator/details/1523",
  ];

  const productLinks = [
    "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-vegetables/c/28195",
    "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-fruits/c/28194",
    "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/packaged-salad-dressing/c/28196",
    "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/herbs/c/28197",
    "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-cut-fruits-vegetables/c/28198",
    "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/dried-fruits-nuts/c/28199",
    "https://www.realcanadiansuperstore.ca/food/fruits-vegetables/fresh-juice-smoothies/c/28200",

    "https://www.realcanadiansuperstore.ca/food/dairy-eggs/butter-spreads/c/28220",
    "https://www.realcanadiansuperstore.ca/food/dairy-eggs/desserts-doughs/c/28221",
    "https://www.realcanadiansuperstore.ca/food/dairy-eggs/egg-egg-substitutes/c/28222",
    "https://www.realcanadiansuperstore.ca/food/dairy-eggs/lactose-free/c/28223",
    "https://www.realcanadiansuperstore.ca/food/dairy-eggs/milk-cream/c/28224",
    "https://www.realcanadiansuperstore.ca/food/dairy-eggs/cheese/c/28225",
    "https://www.realcanadiansuperstore.ca/food/dairy-eggs/sour-cream-dips/c/28226",
    "https://www.realcanadiansuperstore.ca/food/dairy-eggs/yogurt/c/28227", //done
    "https://www.realcanadiansuperstore.ca/food/dairy-eggs/non-dairy-milk-alternatives/c/58904",

    "https://www.realcanadiansuperstore.ca/food/meat/chicken-turkey/c/28214",
    "https://www.realcanadiansuperstore.ca/food/meat/game-meat-offals-fowl/c/28216",
    "https://www.realcanadiansuperstore.ca/food/meat/lamb-veal/c/28171",
    "https://www.realcanadiansuperstore.ca/food/meat/pork-ham/c/28215",
    "https://www.realcanadiansuperstore.ca/food/meat/sausages/c/28170",
    "https://www.realcanadiansuperstore.ca/food/meat/kebabs-marinated-meat/c/28173",
    "https://www.realcanadiansuperstore.ca/food/meat/beef/c/28174",

    "https://www.realcanadiansuperstore.ca/food/pantry/honey-syrups-spreads/c/28184",
    "https://www.realcanadiansuperstore.ca/food/pantry/spices-seasonings/c/28188",
    "https://www.realcanadiansuperstore.ca/food/pantry/cereal-breakfast/c/28183",
    "https://www.realcanadiansuperstore.ca/food/pantry/canned-pickled/c/28187",
    "https://www.realcanadiansuperstore.ca/food/pantry/dried-beans-vegetables-grains/c/28185",
    "https://www.realcanadiansuperstore.ca/food/pantry/baking-essentials/c/28186",
    "https://www.realcanadiansuperstore.ca/food/pantry/condiments-sauces/c/28243",
    "https://www.realcanadiansuperstore.ca/food/pantry/oils-vinegar/c/28244",
    "https://www.realcanadiansuperstore.ca/food/pantry/international-foods/c/28245",
    "https://www.realcanadiansuperstore.ca/food/pantry/easy-meals-sides/c/28246",
    "https://www.realcanadiansuperstore.ca/food/pantry/pasta-pasta-sauce/c/28247",
    "https://www.realcanadiansuperstore.ca/food/pantry/rice/c/28248",
    "https://www.realcanadiansuperstore.ca/food/pantry/bulk-nuts-and-candy/c/57088",

    "https://www.realcanadiansuperstore.ca/food/international-foods/south-asian-foods/c/58045",
    "https://www.realcanadiansuperstore.ca/food/international-foods/east-asian-foods/c/58466",
    "https://www.realcanadiansuperstore.ca/food/international-foods/halal-foods/c/58556",
    "https://www.realcanadiansuperstore.ca/food/international-foods/latin-american-foods/c/58680",
    "https://www.realcanadiansuperstore.ca/food/international-foods/european-foods/c/58801",
    "https://www.realcanadiansuperstore.ca/food/international-foods/middle-eastern-foods/c/58561",
    "https://www.realcanadiansuperstore.ca/food/international-foods/filipino-foods/c/58812",

    "https://www.realcanadiansuperstore.ca/food/snacks-chips-candy/chips-snacks/c/28250",
    "https://www.realcanadiansuperstore.ca/food/snacks-chips-candy/candy-chocolate/c/28249",
    "https://www.realcanadiansuperstore.ca/food/snacks-chips-candy/crackers-cookies/c/28242",
    "https://www.realcanadiansuperstore.ca/food/snacks-chips-candy/snack-cakes/c/59210",

    "https://www.realcanadiansuperstore.ca/food/frozen-food/frozen-pizza/c/28165",
    "https://www.realcanadiansuperstore.ca/food/frozen-food/meals-entrees-sides/c/28163",
    "https://www.realcanadiansuperstore.ca/food/frozen-food/frozen-fruit-vegetables/c/28162",
    "https://www.realcanadiansuperstore.ca/food/frozen-food/bakery-breakfast/c/28164",
    "https://www.realcanadiansuperstore.ca/food/frozen-food/appetizers-snacks/c/28238",
    "https://www.realcanadiansuperstore.ca/food/frozen-food/beverages-ice/c/28239",
    "https://www.realcanadiansuperstore.ca/food/frozen-food/ice-cream-desserts/c/28240",
    "https://www.realcanadiansuperstore.ca/food/frozen-food/meatless-alternatives/c/28241",
    "https://www.realcanadiansuperstore.ca/food/frozen-food/frozen-meat-seafood/c/57003",

    "https://www.realcanadiansuperstore.ca/food/natural-and-organic/dairy-and-eggs/c/59391",
    "https://www.realcanadiansuperstore.ca/food/natural-and-organic/snacks-chips-candy/c/29714",
    "https://www.realcanadiansuperstore.ca/food/natural-and-organic/frozen-foods/c/59302",
    "https://www.realcanadiansuperstore.ca/food/natural-and-organic/drinks/c/29717",
    "https://www.realcanadiansuperstore.ca/food/natural-and-organic/cereals-spreads-syrups/c/59260",
    "https://www.realcanadiansuperstore.ca/food/natural-and-organic/pasta-and-side-dishes/c/29927",
    "https://www.realcanadiansuperstore.ca/food/natural-and-organic/baking-and-spices/c/29924",
    "https://www.realcanadiansuperstore.ca/food/natural-and-organic/canned/c/29925",
    "https://www.realcanadiansuperstore.ca/food/natural-and-organic/condiments-sauces-and-oils/c/29713",
    "https://www.realcanadiansuperstore.ca/food/natural-and-organic/bars-and-protein/c/59281",

    "https://www.realcanadiansuperstore.ca/food/bakery/bread/c/28251",
    "https://www.realcanadiansuperstore.ca/food/bakery/wraps-flatbread-pizza-crust/c/28150",
    "https://www.realcanadiansuperstore.ca/food/bakery/buns-rolls/c/28147",
    "https://www.realcanadiansuperstore.ca/food/bakery/bagels-croissants-english-muffins/c/28149",
    "https://www.realcanadiansuperstore.ca/food/bakery/cookies-muffins-desserts/c/28148",
    "https://www.realcanadiansuperstore.ca/food/bakery/cakes/c/59494",

    "https://www.realcanadiansuperstore.ca/food/prepared-meals/rotisserie-fried-chicken/c/28166",
    "https://www.realcanadiansuperstore.ca/food/prepared-meals/entrees-appetizers/c/28205",
    "https://www.realcanadiansuperstore.ca/food/prepared-meals/pizza/c/28211",
    "https://www.realcanadiansuperstore.ca/food/prepared-meals/salads-soups/c/28167",
    "https://www.realcanadiansuperstore.ca/food/prepared-meals/fresh-pasta-sauce/c/28210",
    "https://www.realcanadiansuperstore.ca/food/prepared-meals/quiches-pies/c/28206",
    "https://www.realcanadiansuperstore.ca/food/prepared-meals/snacks-dips/c/57043",
    "https://www.realcanadiansuperstore.ca/food/prepared-meals/desserts/c/28207",

    "https://www.realcanadiansuperstore.ca/food/drinks/coffee/c/28228",
    "https://www.realcanadiansuperstore.ca/food/drinks/drink-mixes/c/28229",
    "https://www.realcanadiansuperstore.ca/food/drinks/juice/c/28230",
    "https://www.realcanadiansuperstore.ca/food/drinks/soft-drinks/c/28231",
    "https://www.realcanadiansuperstore.ca/food/drinks/non-dairy-milk-alternatives/c/28232",
    "https://www.realcanadiansuperstore.ca/food/drinks/sports-energy/c/28233",
    "https://www.realcanadiansuperstore.ca/food/drinks/tea-hot-drinks/c/28234",
    "https://www.realcanadiansuperstore.ca/food/drinks/water/c/28235",
    "https://www.realcanadiansuperstore.ca/food/drinks/non-alcoholic-drinks/c/29718",

    "https://www.realcanadiansuperstore.ca/food/deli/deli-meat/c/28201",
    "https://www.realcanadiansuperstore.ca/food/deli/deli-cheese/c/28202",
    "https://www.realcanadiansuperstore.ca/food/deli/party-trays/c/28212",
    "https://www.realcanadiansuperstore.ca/food/deli/dips-spreads-antipasto/c/28203",
    "https://www.realcanadiansuperstore.ca/food/deli/crackers-condiments/c/28158",
    "https://www.realcanadiansuperstore.ca/food/deli/vegan-vegetarian/c/28204",
    "https://www.realcanadiansuperstore.ca/food/deli/lunch-snack-kits/c/57039",

    "https://www.realcanadiansuperstore.ca/food/fish-seafood/salmon/c/28217",
    "https://www.realcanadiansuperstore.ca/food/fish-seafood/shrimp/c/28218",
    "https://www.realcanadiansuperstore.ca/food/fish-seafood/seafood-appetizers/c/28192",
    "https://www.realcanadiansuperstore.ca/food/fish-seafood/shellfish/c/28190",
    "https://www.realcanadiansuperstore.ca/food/fish-seafood/smoked-fish/c/28219",
    "https://www.realcanadiansuperstore.ca/food/fish-seafood/fish/c/28191",
    "https://www.realcanadiansuperstore.ca/food/fish-seafood/squid-octopus/c/28193",
  ];

  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  const page = await browser.newPage();
// await page.setRequestInterception(true);
  await page.setExtraHTTPHeaders(headers);

  const headers = {
    'Cache-Control': 'max-age=0, no-cache, no-store',
    Connection: 'keep-alive',
    'Content-Type': 'application/json;charset=UTF-8',
    Pragma: 'no-cache',
    Referer: 'https://www.zehrs.ca/the-decadent-middle-chocolate-chip-cookie/p/20684269_EA?source=nspt',
    'Sec-CH-UA': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    'Sec-CH-UA-Mobile': '?1',
    'Sec-CH-UA-Platform': '"Android"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
    Accept: 'application/json, text/plain, */*',
    Host: 'www.zehrs.ca',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en',
    Cookie: 'lcl_lang_pref=en; Origin_Session_Cookie=B; PIM-SESSION-ID=vv5f4LZB03HiX0ZI; ...', // используйте реальные cookies
  };

  try {
    for (const link of links) {
      console.log(`Processing store link: ${link}`);
      await processStore(page, link, productLinks);
    }
    res.send("Scraping completed successfully.");
  } catch (error) {
    console.error("Error during scraping:", error);
    res.status(500).send("Error scraping website.");
  } finally {
    await browser.close();
  }
};

async function processStore(page, storeLink, productLinks) {
  try {
    console.log(`Navigating to store: ${storeLink}`);
    await page.goto(storeLink, { waitUntil: "networkidle0", timeout: 180000 });

    const storeID = page.url().split("/").pop();

    const setStoreButton = await page.$(
      ".location-pickup-confirmation__actions__set-store"
    );
    if (setStoreButton) {
      await setStoreButton.click();
      await page.waitForTimeout(180000);
    } else {
      console.warn("Set Store button not found for store:", storeID);
    }

    for (const productLink of productLinks) {
      console.log(`Scraping product link: ${productLink}`);
      await scrapeProductPage(page, productLink, storeID);
    }
    console.log(`Finished processing store: ${storeID}`);
  } catch (error) {
    console.error(`Error processing store ${storeLink}:`, error);
  }
}

async function scrapeProductPage(page, productLink, storeID) {
  await page.goto(productLink, { waitUntil: "networkidle0", timeout: 180000 });

  let category;
  try {
    await page.waitForSelector(".chakra-link.css-kho608", { timeout: 180000 });
    const elements = await page.$$eval(".chakra-link.css-kho608", (links) =>
      links.map((link) => link.textContent.trim())
    );
    category = elements[1];
    console.log("CATEGORY", category);
  } catch (error) {
    console.error(`Selector not found on page: ${productLink}`, error);
    category = "Unknown Category";
  }

  await page.waitForTimeout(120000);

  while (true) {
    const productHandles = await page.$$(".chakra-linkbox");
    await Promise.all(
      productHandles.map((handle) =>
        extractAndSaveProductData(handle, storeID, category)
      )
    );
    const nextButton = await page.$('a.chakra-link[aria-label="Next Page"]');
    if (!nextButton) break;
    const nextUrl = await nextButton.evaluate(el => el.href); // Получаем ссылку из кнопки
console.log('Next Page URL:', nextUrl); // Показываем ссылку
    await nextButton.click();
    await page.waitForTimeout(120000);
  }
}

async function extractAndSaveProductData(handle, storeID, category) {
  const productData = await extractProductData(handle, storeID, category);
  await saveProductData(productData);
}

async function extractProductData(handle, storeID, category) {
  const extract = async (selector) => {
    try {
      return await handle.$eval(
        `p.chakra-text[data-testid="${selector}"]`,
        (el) => el.textContent.trim()
      );
    } catch {
      return null;
    }
  };

  const extractPrice = async (selector) => {
    try {
      const price = await handle.$eval(
        `span.chakra-text[data-testid="${selector}"]`,
        (el) => el.textContent.trim()
      );
      return price.match(/\$\d+(\.\d+)?/)?.[0] || null;
    } catch {
      return null;
    }
  };

  const data = {
    storeID,
    category,
    productID: await handle.$eval(
      'h3.chakra-heading[data-testid="product-title"]',
      (el) => el.id
    ),
    title: await handle.$eval(".chakra-heading", (name) =>
      name.textContent.trim()
    ),
    regPrice: await extractPrice("regular-price"),
    salePrice: await extractPrice("sale-price"),
    wasPrice: await extractPrice("was-price"),
    sale: await extract("price-descriptor"),
    image: await handle.$eval(
      'div[data-testid="product-image"] img',
      (img) => img.src
    ),
    point: await extract("product-pco-badge"),
    stock: await extract("inventory-badge-text"),
    brand: await extract("product-brand"),
    weight: await extract("product-package-size"),
    last_update: new Date().toISOString().split("T")[0],
    storetype: "Superstore",
    nonMemberPrice: await extractPrice("non-members-price"),
  };

  return data;
}

async function saveProductData(product) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertQuery = `
      INSERT INTO nofrills (
        "storeID", category, "productID", title, brand, regPrice, salePrice,  wasPrice, sale, image, point, stock, weight, last_update, storetype,non_member_price
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT ("storeID", "productID") DO UPDATE  
    SET 
      regPrice = EXCLUDED.regPrice,
      salePrice = EXCLUDED.salePrice,
      wasPrice = EXCLUDED.wasPrice,
      sale =  EXCLUDED.sale,
      point = EXCLUDED.point,
      stock = EXCLUDED.stock,
      weight = EXCLUDED.weight,
      last_update = EXCLUDED.last_update,
      non_member_price = EXCLUDED.non_member_price; 
      `;

    const values = [
      product.storeID,
      product.category,
      product.productID,
      product.title,
      product.brand,
      product.regPrice,
      product.salePrice,
      product.wasPrice,
      product.sale,
      product.image,
      product.point,
      product.stock,
      product.weight,
      product.last_update,
      product.storetype,
      product.nonMemberPrice,
    ];

    await client.query(insertQuery, values);
    await client.query("COMMIT");
    console.log(
      `Product data saved for ${product.storeID} and ${product.productID}`
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving product data:", error);
  } finally {
    client.release();
  }
}

module.exports = { scrapeLogic };
