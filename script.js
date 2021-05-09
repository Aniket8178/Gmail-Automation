let puppeteer = require("puppeteer");
let fs = require("fs");

let credentialsFile = process.argv[2];
let url1, pwd, user, other_id, subject, body, subject1, body1;

(async function () {
    let data = await fs.promises.readFile(credentialsFile, "utf-8");
    let credentials = JSON.parse(data);
    url1 = credentials.url1;
    user = credentials.user;
    pwd = credentials.pwd;
    other_id = credentials.other_id;
    subject = credentials.subject;
    body = credentials.body;
    subject1 = credentials.subject1;
    body1 = credentials.body1;

    // start browser
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--disable-notifications",],
        slowMo: 5
    });
    let numberofPages = await browser.pages();
    let tab = numberofPages[0];

    //goto page gmail
    //1.
    await tab.goto(url1);

    // Entering email
    await tab.waitForSelector("input[type = 'email']", { visible: true });
    await tab.type("input[type = 'email']", user);
    await tab.waitFor(1000);

    // Next button
    await tab.click("#identifierNext");

    // Entering password
    await tab.waitForSelector("input[type = 'password']", { visible: true });
    await tab.type("input[type = 'password']", pwd);

    // Next button
    await tab.click("div[id = 'passwordNext']");
    console.log("User Logged in");

    // opening first mail in primary
    await tab.waitForSelector("tr[jscontroller='ZdOxDb']", { visible: true });
    let firstMail = await tab.$("tr[jscontroller='ZdOxDb']");
    await firstMail.click("tr[jscontroller='ZdOxDb']");
    await tab.waitFor(1000);
    await tab.waitForSelector(".ar6.T-I-J3.J-J5-Ji", { visible: true });
    await tab.click(".ar6.T-I-J3.J-J5-Ji");

    // opening first mail in social
    await tab.waitForSelector("div[aria-label='Social']", { visible: true });
    await tab.click("div[aria-label='Social']");

    await tab.waitForSelector("tr[jscontroller='ZdOxDb']", { visible: true });
    let firstMailInSocial = await tab.$("tr[jscontroller='ZdOxDb']");
    await firstMailInSocial.click("tr[jscontroller='ZdOxDb']");
    await tab.waitFor(2000);
    await tab.waitForSelector(".ar6.T-I-J3.J-J5-Ji", { visible: true });
    await tab.click(".ar6.T-I-J3.J-J5-Ji");

    for (let i = 0; i < other_id.length; i++) {

        // Compose new mail
        await tab.waitForSelector("div[ jslog='20510; u014N:cOuCgd,Kr2w4b']", { visible: true });
        await tab.click("div[ jslog='20510; u014N:cOuCgd,Kr2w4b']");

        // Entering mail of another person
        await tab.waitForSelector("textarea[class = 'vO']", { visible: true });
        await tab.type("textarea[class = 'vO']", other_id[i]);
        await tab.keyboard.press("Enter");

        // Subject
        await tab.type("input[class = 'aoT']", subject[i]);
        // Body
        await tab.type("div[class = 'Am Al editable LW-avf tS-tW']", body[i]);

        // Send button
        await tab.click("div[class = 'T-I J-J5-Ji aoO v7 T-I-atl L3']", { delay: 300 });
        await tab.waitFor(1000);
    }

    // Compose new mail
    await tab.waitForSelector("div[ jslog='20510; u014N:cOuCgd,Kr2w4b']", { visible: true });
    await tab.click("div[ jslog='20510; u014N:cOuCgd,Kr2w4b']");

    for (let i = 0; i < other_id.length; i++) {

        // Entering mail of another person
        await tab.waitForSelector("textarea[class = 'vO']", { visible: true });
        await tab.type("textarea[class = 'vO']", other_id[i]);
        await tab.keyboard.press("Enter");
    }
    // Subject
    await tab.type("input[class = 'aoT']", subject1);
    // Body
    await tab.type("div[class = 'Am Al editable LW-avf tS-tW']", body1);

    // Send button
    await tab.click("div[class = 'T-I J-J5-Ji aoO v7 T-I-atl L3']", { delay: 300 });
    await tab.waitFor(1000);

    // Send Mails
    await tab.waitForSelector("a[href='https://mail.google.com/mail/u/0/#sent']", { visible: true });
    await tab.click("a[href='https://mail.google.com/mail/u/0/#sent']", { delay: 100 });
    await tab.waitFor(4000);

    //Sign out
    await tab.waitForSelector("a[class='gb_D gb_Na gb_i']", { visible: true });
    await tab.click("a[class='gb_D gb_Na gb_i']");
    await tab.waitForSelector("#gb_71", {visible : true});
    await tab.click("#gb_71", { delay: 300 });
    await tab.waitFor(9000);

    await tab.waitFor(1000);
    await tab.close();
    await browser.close();

})();

// node script.js  "credentials.json"