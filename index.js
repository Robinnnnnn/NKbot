const {Builder, By, Key, until, Capabilities} = require('selenium-webdriver');
const { rl, rlc} = require('./RL_data.js');

const chromeCapabilities = new Capabilities();

chromeCapabilities.set('chromeOptions', {
  'args': ['start-maximized']
});

(async function example() {
  //initializes driver to make an instance of chrome w/ defined capabilities
  const  driver = await new Builder()
  .withCapabilities(chromeCapabilities)
  .forBrowser("chrome")
  .build();

  try {
    // tells driver to get the desired website
    await driver.get('http://novelkeys.xyz');
    //find an element using JSpath, and performs a click on the element (in this case it is the first child)
    await driver.findElement(By.js(() => {
      // return document.querySelector("#shopify-section-featured-collections > div > ul > li:nth-child(1) > div > a");
      return document.querySelector("#shopify-section-featured-collections > div > ul > li:nth-child(2) > div > a")
    }))
      .then(el => el.click());
    // click the addtocart button
    await driver.findElement(By.js(() => {
      return document.querySelector("#AddToCart-product-template");
    }))
      .then(el => {
        console.log('clicking item add to cart');
        el.click();
      });
    // waits for the go to cart link to show on page, then click link
    const crtLink = await driver.wait(until.elementLocated(By.linkText("View cart")), 10000);
    crtLink.click();

    const checkout = await driver.wait(until.elementLocated(By.js(() => {
      return document.querySelector("#shopify-section-cart-template > div > form > div > div > div > div.cart__submit-controls > input.btn.btn--small-wide.cart__submit.cart__submit-control");
      })), 10000);
    checkout.click();

    await driver.wait(until.elementLocated(By.js(() => document.querySelector("#checkout_email"))), 10000)
      .then((el) => {
        el.sendKeys(`${rl.email}`)
      })
      .then(() => {
        driver.findElement(By.js(() => document.querySelector("#checkout_shipping_address_first_name") )).sendKeys(`${rl.firstName}`)
        driver.findElement(By.js(() => document.querySelector("#checkout_shipping_address_last_name") )).sendKeys(`${rl.lastName}`)
        driver.findElement(By.js(() => document.querySelector("#checkout_shipping_address_address1") )).sendKeys(`${rl.adress}`)
        driver.findElement(By.js(() => document.querySelector("#checkout_shipping_address_city") )).sendKeys(`${rl.city}`)
        driver.findElement(By.js(() => document.querySelector("#checkout_shipping_address_zip"))).sendKeys(`${rl.zip}`)
        driver.findElement(By.js(() => document.querySelector("#checkout_shipping_address_phone") )).sendKeys(`${rl.phone}`)
        driver.findElement(By.js(() => document.querySelector("#continue_button") )).click();
      });

    //select shipping priority and continue to payment form
    await driver.wait(until.elementLocated(By.js(() => document.getElementsByClassName('input-radio')[0])), 10000)
    //need to make a different way to select the shipping type so that its not too specific
      .then((el) => {
        el.click();
      })
      .then(async () => {
        await driver.wait(until.elementLocated(By.js(() => document.querySelector("#continue_button"))), 10000)
          .then((btn) => btn.click());
      })

    // top level iframe contains a seperate iframe for each of the individual form fields for card information
    await driver.wait(until.elementLocated(By.js(() => document.querySelector("iframe"))), 10000)
      .then(() => {
        console.log("Switching to Card Number Iframe")
        driver.switchTo().frame(1)
        .then(() => driver.findElement(By.js(() => document.querySelector("#number"))))
        .then(el => el.sendKeys(`${rlc.num}`))
        .then(() => driver.switchTo().defaultContent())
        .then(() => {
          driver.switchTo().frame(2)
          .then(() => driver.findElement(By.js(() => document.querySelector("#name"))))
          .then(el => el.sendKeys(`${rlc.noc}`))
          .then(() => driver.switchTo().defaultContent())
          .then(() => {
            driver.switchTo().frame(3)
            .then(() => driver.findElement(By.js(() => document.querySelector("#expiry"))))
            .then(el => el.sendKeys(`${rlc.exp}`))
            .then(() => driver.switchTo().defaultContent())
            .then(() => {
              driver.switchTo().frame(4)
              .then(() => driver.findElement(By.js(() => document.querySelector("#verification_value"))))
              .then(el => el.sendKeys(`${rlc.sec}`))
              .then(() => driver.switchTo().defaultContent())
            })
          })
        })
      })

    await driver.wait(until.elementLocated(By.js(() => document.querySelector("#continue_button"))), 10000)
      .then(el => console.log(`Clicked Buy`));


  } catch(err) {
    throw err;
  } finally {
    //await driver.quit();
  }
})();



