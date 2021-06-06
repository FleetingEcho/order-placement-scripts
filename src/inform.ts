import * as puppeteerType from 'puppeteer'
import { getExactTime, getLocalTime, setPickUpLocation, replaceSpace, autoScroll } from './utils'
import { INFO, TIME_SET, URL, USER, BANK } from './settings'
import { Logger, LoggerErr, LoggerCount, log4Error, log4Info, log4Notice, log4Others, LoggerMail } from './log4js'
import CoreMail from './mail'
import puppeteer from 'puppeteer-extra'
import successMail from './successMail'
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const {
	promises: { writeFile },
} = require('fs')
puppeteer.use(StealthPlugin())

const min: number = 60000
const seconds: number = 1000
let browser: puppeteerType.Browser
let timer: NodeJS.Timer
let page: puppeteerType.Page
let timerB: NodeJS.Timer
let currentIndex = 0
let storeIndex = 0
let today = getLocalTime()
let inStock = new Set()
let dialogFlag = false
// Browser initialization

const Init = async () => {
	try {
		if (INFO.Local) {
			INFO.HeadLess
				? (browser = await puppeteer.launch({
						headless: true,
						args: ['--disable-web-security'],
						ignoreHTTPSErrors: true,
				  }))
				: INFO.Slow_Mode
				? (browser = await puppeteer.launch({
						headless: false,
						args: ['--disable-web-security'],
						ignoreHTTPSErrors: true,
						slowMo: 250,
						defaultViewport: { width: 1200, height: 960 },
				  }))
				: // headless false
				  (browser = await puppeteer.launch({
						headless: false,
						ignoreDefaultArgs: ['--mute-audio'],
						args: [
							'--no-sandbox',
							'--disable-setuid-sandbox',
							'--disable-infobars',
							'--window-position=0,0',
							'--use-fake-ui-for-media-stream',
							'--use-fake-device-for-media-stream',
							'--use-file-for-fake-audio-capture=/path/example.wav',
							'--allow-file-access',
							'--ignore-certifcate-errors',
							'--ignore-certifcate-errors-spki-list',
							'--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
							// '--proxy-server=zproxy.lum-superproxy.io:123456',
						],
						// product: 'chrome',
						ignoreHTTPSErrors: true,
						defaultViewport: { width: 1200, height: 960 },
				  }))
		} else {
			browser = await puppeteer.launch({
				headless: true,
				args: ['--no-sandbox', '--disable-web-security'],
				executablePath: '/snap/bin/chromium',
			})
		}
		await startNewPage()
		if (INFO.Local) {
			let width = 1200
			let height = 960
			await page.setViewport({
				width: width,
				height: height,
			})
		}

		log4Info(`Service started successfully`)
	} catch (err) {
		Logger.debug(err)
		log4Error('Failed to Init browser')
		throw new Error(`Failed to Init browser`)
	}
}

async function startNewPage() {
	try {
		page = await browser.newPage()

		if (INFO.Test) {
			await page.authenticate({
				username: 'proxy username',
				password: 'password',
			})
		}
		await page.setRequestInterception(true)
		page.on('dialog', (dialog) => {
			console.log('Dialog is up...')
			dialogFlag = true
			sleep(1000)
			console.log('Accepted...')
			dialog.accept()
			sleep(1000)
		})
		if (!INFO.Local) {
			// server
			page.on('request', (request) => {
				if (['image', 'font'].indexOf(request.resourceType()) !== -1) {
					request.abort()
				} else {
					request.continue()
				}
			})
		} else {
			// proxy
			if (INFO.Test) {
				page.on('request', (request) => {
					if (['image', 'font'].indexOf(request.resourceType()) !== -1) {
						request.abort()
					} else {
						request.continue()
					}
				})
			} else {
				//local
				page.on('request', (request) => {
					request.continue()
				})
			}
		}
		await page.goto(URL.Complete_Url, { timeout: 0, waitUntil: 'domcontentloaded' })
	} catch (err) {
		log4Error(err)
		Reboot(0)
	}
	return true
}

async function checkHomePage() {
	try {
		let urlTest = await page.url()
		if (!urlTest.includes(URL.Base_Url)) {
			log4Others(`checkHomePage running...  go to homePage`)
			await page.goto(URL.Complete_Url)
			await page.waitForTimeout(TIME_SET.Loading_Time)
		}
	} catch (err) {
		Logger.debug(err)
		throw new Error('Failed to check HomePage ')
	}
}
// ========================================================

async function loadSong() {
	let audio: any
	await page.evaluate(() => {
		audio = document.createElement('audio')
		audio.setAttribute('src', 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3')
		audio.setAttribute('crossorigin', 'anonymous')
		audio.setAttribute('controls', '')
		audio.onplay = function () {
			const stream = audio.captureStream()
			navigator.mediaDevices.getUserMedia = async function () {
				return stream
			}
		}
		document.querySelector('body')?.appendChild(audio)
		audio.play()
	})
}
async function sleep(delay: number) {
	return new Promise((resolve) => setTimeout(resolve, delay))
}
const _CanadaComputers = async (index: number) => {
	await checkHomePage()
	let errorFlag = false
	// refresh the page
	await page.reload()
	await autoScroll(page)
	let linkArr: Array<string> = []
	try {
		INFO.Logger && console.time('Total cost')
		const targetEls = await page.$$('.btn.btn-primary.text-center.mb-1.mt-2.rounded-0.position-relative')
		const divEls = await page.$$('.productImageSearch.pt-2.pt-sm-0.w-100')

		for (let item of divEls) {
			let aTag = await page.evaluateHandle((ele) => {
				return ele.firstElementChild
			}, item)
			let link_Handle = await aTag.getProperty('href')
			let link = (await link_Handle.jsonValue()) as string
			linkArr.push(link)
		}
		timerBFunc(index)
		let SelectedUrl
		for (let i = 0; i < targetEls.length; i++) {
			const target = targetEls[i]
			try {
				const buttonEle = await target.getProperty('innerHTML')
				const status = (await buttonEle.jsonValue()) as string
				if (!replaceSpace(status).includes(replaceSpace('Learn More')) && replaceSpace(status).includes(replaceSpace('to Cart'))) {
					const url = linkArr[i]
					SelectedUrl = url
					// send email
					// EmailSender(url)
					// break
				} else {
					log4Info(replaceSpace(status))
					log4Info(replaceSpace(linkArr[i]))
				}
			} catch (err) {
				log4Error(err)
			}
		}
		if (SelectedUrl) {
			log4Info(`target items updated`)
			await loadSong()
			await sleep(3000)
		}

		if (timerB) {
			clearTimeout(timerB)
			log4Others('Back up timerB successfully deleted')
		}
		log4Info(`Checked: ${targetEls.length} items`)
		INFO.Logger && console.timeEnd('Total cost')
		await page.waitForTimeout(TIME_SET.Loading_Time)
	} catch (err) {
		log4Error(err)
		errorFlag = true
	}
	if (errorFlag) throw new Error('error occurs in CanadaComputers Page')
}

const Analyzer = async (index: number) => {
	try {
		log4Info(`-------------------Analyzer${index} Start-------------------`)
		INFO.Logger && console.time(`analyzerClock${index}`)
		await _CanadaComputers(index)
		INFO.Logger && console.timeEnd(`analyzerClock${index}`)
		log4Info(`-------------------Analyzer${index} End---------------------`)
	} catch (err) {
		log4Error(err)
		LoggerErr.error(err)
		throw new Error('Error occurs in analyzer')
	}
}

const EmailSender = (url: string) => {
	if (today !== getLocalTime()) {
		inStock = new Set()
	}
	CoreMail(url)
	inStock = new Set()
	log4Others(`Successfully sent update e-mail on ${getExactTime()}`)
	LoggerMail.info(`Successfully sent update e-mail on ${getExactTime()}`)
	today = getLocalTime()
}

function timerBFunc(index: number, timeout: number = TIME_SET.TimerB_Wait) {
	if (timer) clearTimeout(timer)
	timerB = setTimeout(async () => {
		try {
			if (!page || !browser) throw new Error(`Browser or page didn't response`)
			log4Error('Back up timer online')
			log4Error('timerB working...')
			if (browser && page) {
				await page.close()
				log4Info(`Service restarted successfully`)
				log4Info('Entered the Homepage')
				await startNewPage()
				await AnalyzerTimeout(0, index)
			}
		} catch (err) {
			Logger.debug(err)
			if (!timerB) {
				await Reboot(err)
			}
		}
	}, timeout)
}

let AnalyzerTimeout = async (countDown = 0, i = storeIndex) => {
	if (timer) clearTimeout(timer)
	if (timerB) clearTimeout(timerB)
	timer = setTimeout(async () => {
		try {
			i++
			storeIndex = i
			if (i - currentIndex >= TIME_SET.Logger_Gap) {
				LoggerCount.info(`Checked ${i}`)
				currentIndex = i
			}
			log4Notice(`Checked ${i} time(s)`)
			await Analyzer(i)
			await AnalyzerTimeout(countDown, i)
		} catch (err) {
			log4Info(`Analyzer Error,shown in Timeout Func`)
			Logger.debug(err)
			Reboot(err)
		}
	}, countDown)
}

async function Reboot(err: unknown) {
	try {
		if (timer) clearTimeout(timer)
		if (timerB) clearTimeout(timerB)
		if (!browser || !page) throw new Error('Critical Error Occurs')
		LoggerErr.error(err)
		log4Error(err)
		await AnalyzerTimeout()
	} catch (err) {
		// close all
		if (page) {
			log4Error(err)
			await page.close()
			await browser.close()
		}
		await sleep(TIME_SET.Time_Gap)
		log4Info(`Browser has been closed`)
		Main()
	}
}

async function Main() {
	try {
		await Init()
		await AnalyzerTimeout()
	} catch (err) {
		await Reboot(err)
	}
}

Main()
