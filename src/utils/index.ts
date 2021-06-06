import { log4Others } from '../log4js'
import * as puppeteerType from 'puppeteer'
import { INFO } from '../settings'
export function getLocalTime(timeZone = -5) {
	// timeZone ,  Beijing for 8,  New York for -5
	const MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	const d = new Date()
	const len = d.getTime()
	const offset = d.getTimezoneOffset() * 60000
	const utcTime = len + offset
	const d2 = new Date(utcTime + 3600000 * timeZone)
	const month = MonthList[d2.getMonth()]
	const date = d2.getDate()
	return `${month} ${date}` //example: February 13
}

export function getExactTime(timeZone = -5) {
	// timeZone ,  Beijing for 8,  New York for -5
	const MonthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	const d = new Date()
	const len = d.getTime()
	const offset = d.getTimezoneOffset() * 60000
	const utcTime = len + offset
	const d2 = new Date(utcTime + 3600000 * timeZone)
	const month = MonthList[d2.getMonth()]
	const date = d2.getDate()
	const hours = d2.getHours()
	const minutes = d2.getMinutes()
	const seconds = d2.getSeconds()
	return `${month}-${date}: ${hours}:${minutes}:${seconds}`
}

export async function autoScroll(page: puppeteerType.Page) {
	return page.evaluate(`(async () => {
		await new Promise((resolve, reject) => {
			let totalHeight = 0
			let distance = 100
			let timer = setInterval(() => {
				let scrollHeight = document.body.scrollHeight
				window.scrollBy(0, distance)
				totalHeight += distance
				if (totalHeight >= scrollHeight) {
					clearInterval(timer)
					resolve(true)
				}
			}, 120)
		})
	})()`)
}

export async function setPickUpLocation(page: puppeteerType.Page) {
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

	try {
		if (INFO.Location_Ottawa) {
			switch (true) {
				case !!OttawaDowntown:
					await page.click('input[id="OD"]', { delay: 100 })
					break
				case !!Kanata:
					await page.click('input[id="KANA"]', { delay: 100 })
					break
				case !!OttawaMerivale:
					await page.click('input[id="OTT2"]', { delay: 100 })
					break
				case !!OttawaOrleans:
					await page.click('input[id="OTT3"]', { delay: 100 })
					break
				case !!Gatineau:
					await page.click('input[id="GT"]', { delay: 100 })
					break
				default:
					throw new Error('No such selections')
			}
		} else {
			switch (true) {
				case !!WaterLoo:
					await page.click('input[id="WATERLOO"]', { delay: 100 })
					break
				case !!MarkHam:
					await page.click('input[id="MU"]', { delay: 100 })
					break
				case !!Scarborough:
					await page.click('input[id="1203"]', { delay: 100 })
					break
				case !!RichMoundHill:
					await page.click('input[id="R-HILL"]', { delay: 100 })
					break
				case !!NorthYork:
					await page.click('input[id="NO"]', { delay: 100 })
					break
				case !!MidTownToronto:
					await page.click('input[id="EGLN"]', { delay: 100 })
					break
				case !!Vaughan:
					await page.click('input[id="VAUG"]', { delay: 100 })
					break
				case !!AJAX:
					await page.click('input[id="AJAX"]', { delay: 100 })
					break
				case !!DownTownToronto:
					await page.click('input[id="C343"]', { delay: 100 })
					break
				case !!Whitby:
					await page.click('input[id="WHIT"]', { delay: 100 })
					break
				case !!Etobicoke:
					await page.click('input[id="ETOB"]', { delay: 100 })
					break
				case !!London:
					await page.click('input[id="LOND"]', { delay: 100 })
					break
				default:
					throw new Error('No such selections')
				//
			}
		}
	} catch (err) {
		throw new Error('No such selections')
	}
}

export const replaceSpace = (str: string) => {
	const tempVal = str.toLocaleLowerCase()
	return tempVal.replace(/\s+/gi, '')
}

export const compareDate = (target: string) => {
	//target  September 4  or  August 19, 2020
	return new Promise((resolve, reject) => {
		let today = getLocalTime()
		today = replaceSpace(today)
		target = replaceSpace(target)
		log4Others(`The date in Map is:${target}, today is:${today} => Thus the result returned is: ${target.includes(today)}`)
		resolve(target.includes(today))
	})
}
export const waitTillHTMLRendered = async (page: puppeteerType.Page, timeout = 30000) => {
	const checkDurationMsecs = 1000
	const maxChecks = timeout / checkDurationMsecs
	let lastHTMLSize = 0
	let checkCounts = 1
	let countStableSizeIterations = 0
	const minStableSizeIterations = 3

	while (checkCounts++ <= maxChecks) {
		let html = await page.content()
		let currentHTMLSize = html.length
		if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) countStableSizeIterations++
		else countStableSizeIterations = 0 //reset the counter

		if (countStableSizeIterations >= minStableSizeIterations) {
			console.log('Page rendered fully..')
			break
		}

		lastHTMLSize = currentHTMLSize
		await page.waitForTimeout(checkDurationMsecs)
	}
}
