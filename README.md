# Automated order placement scripts



> This is an automated order placement script built by Typescript. 
>
> It is applicable to any products in the **Canada Computers**  official website.
>
> Support custom configurations, such as logging blogs an, **automatic email alerts**, and  record potential errors(for user debugging).



## Classification

1. **Notification version**
   1. Notification of the availability of items on the shelves.
   2. Excellent speed and stability.
2. **Automated order version**
   1. Automatic login and successful order placement.
   2. Audible alerts when items  are available.
   3. Note that pick-up address need to be changed manually. (More info please check ./src/settings.ts)

## Features

+ Automatic user login.
+ Supports two options to pass reCAPTCHA checks
+ Stable operation.
+ Audible alerts when items are on the shelves.
+ The settings file supports a wide range of customized options.
+ **Stable error handling** to ensure program keep running.



## Tools

+ Language: **TypeScript**

+ **Nodemailer**
+ log4js
+ chalk
+ Puppeteer
+ Chromium
+ pm2



## Deployment

> Notice: Setting your configuration first.

+ Running locally

  + ```js
    npm run start   // Automated order placement scripts
    npm run inform  // Email inform scripts
    ```

+ Running on the server
  + Install  **Chromium**  ,Node.js. 
    + **Notice**: Default executable_Path is  '/usr/bin/chromium'.   
  + Use **pm2** to manage node process.



## Configuration  

> user configuration file is **'./src/settings.ts'**



```typescript
const min: number = 60000
const seconds: number = 1000
enum CHECKLIST {
	RTX_3060 = 'https://www.canadacomputers.com/index.php?cPath=43&sf=:3_8,3_9&mfr=&pr=',
	RTX_3060_3070 = 'https://www.canadacomputers.com/index.php?cPath=43_557&sf=:3_7,3_9&mfr=&pr=',
	RTX_3070 = 'https://www.canadacomputers.com/index.php?cPath=43&sf=:3_7&mfr=&pr=',
	RTX_3080 = 'https://www.canadacomputers.com/index.php?cPath=43&sf=:3_5&mfr=&pr=',
	RTX_3070_3080 = 'https://www.canadacomputers.com/index.php?cPath=43&sf=:3_5,3_7&mfr=&pr=',
	RTX_3060_3070_3080 = 'https://www.canadacomputers.com/index.php?cPath=43&sf=:3_5,3_7,3_8,3_9&mfr=&pr=',
}

enum SERVER_CHROME_PATH {
	Snap = '/snap/bin/chromium',
	Usr = '/usr/bin/chromium',
}

export const INFO: _INFO = {
	Manual_Login: false, // manually login
	Location_Ottawa: false, // ottawa or toronto
	Store_Page: false,
	Local: true, // server to false
	Logger: false, // server to false
	Solver: false, // pass the recaptcha, not stable
	Target: CHECKLIST.RTX_3060_3070,
	Server_Chrome_Path: SERVER_CHROME_PATH.Snap, // server chromium path
	HeadLess: false,
	Test: true, // proxy or not
	Slow_Mode: false,
}

export const TIME_SET: _TIME_SET = {
	TimerB_Wait: 0.2 * min, // timerB backup time
	Time_Gap: 0.2 * min, // reboot waiting time
	Logger_Gap: 200, // min times to trigger local logs.`
	Loading_Time: 5 * seconds, // Time gap of each round
}
export const EMAIL: _EMAIL = {
	Email_Address: 'XXXXXX@gmail.com',
	Email_Service: 'Gmail',
	Smtp_Pass: 'XXXXX', // your smtp pass
	Email_To: ['XXXXXX@gmail.com'], // Array<string>
}
export const BANK: _BANK = {
	LAST_4_DIGIT: 'XXXX', // bank info, it can be set manually.
	LAST_NAME: 'XXXXX',
}

export const USER: _USER = {
	Username: 'your username',
	Password: 'your password',
}
export const URL: _URL = {
	Complete_Url: INFO.Target,
	Base_Url: 'www.canadacomputers.com/index.php?cPath',
	Login_Url: 'https://www.canadacomputers.com/login.php',
}

```



Pick-up Address  in ./src/utils/index.ts

````tsx
//Currently support Ottawa and Toronto
	//Ottawa
	const OttawaDowntown = await page.$('input[id="OD]"]')
	const OttawaMerivale = await page.$('input[id="OTT2]')
	const OttawaOrleans = await page.$('input[id="OTT3]')
	const Gatineau = await page.$('input[id="GT]"]')
	const Kanata = await page.$('input[id="KANA]"]')
	//Toronto
	const WaterLoo = await page.$('input[id="WATERLOO"]')
	const London = await page.$('input[id="LOND"]')
	const MarkHam = await page.$('input[id="MU"]')
	const Scarborough = await page.$('input[id="1203"]')
	const RichMoundHill = await page.$('input[id="R-HILL"]')
	const NorthYork = await page.$('input[id="NO"]')
	const MidTownToronto = await page.$('input[id="EGLN"]')
	const Vaughan = await page.$('input[id="VAUG"]')
	const AJAX = await page.$('input[id="AJAX"]')
	const DownTownToronto = await page.$('input[id="C343"]')
	const Whitby = await page.$('input[id="WHIT"]')
	const Etobicoke = await page.$('input[id="ETOB"]')
````

