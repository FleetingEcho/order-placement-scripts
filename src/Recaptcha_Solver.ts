import * as puppeteerType from 'puppeteer'
import axios from 'axios'
const https = require('https')
function rdn(min: number, max: number) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min)) + min
}
async function sleep(delay: number) {
	return new Promise((resolve) => setTimeout(resolve, delay))
}
export async function solver(page: puppeteerType.Page) {
	console.log('solver running...')
	try {
		await sleep(3000)
		await page.waitForFunction(
			() => {
				const iframe: HTMLIFrameElement | null = document.querySelector('iframe[src*="api2/bframe"]')
				if (iframe) {
					const doc = iframe.contentWindow as Window
					const audioButton = doc.document.querySelector('#recaptcha-audio-button') as HTMLButtonElement
					if (!audioButton) return false
					audioButton.click()
					console.log('Clicked the audio button')
					return true
				}
			},
			{ timeout: 10000 }
		)
		let idx = 0
		const framesC = await page.frames()
		const imageFrame: puppeteerType.Frame | undefined = framesC.find((frame) => frame.url().includes('api2/bframe'))
		while (true) {
			let audioLink, response
			idx++
			if (idx >= 20) {
				throw new Error('timeout')
			}
			try {
				await sleep(3000)
				audioLink = await page.waitForFunction(
					() => {
						const iframe: HTMLIFrameElement | null = document.querySelector('iframe[src*="api2/bframe"]')
						if (iframe) {
							const doc = iframe.contentWindow as Window
							const link = doc.document.querySelector('#audio-source') as HTMLAudioElement
							if (link) {
								return link.src
							} else {
								throw 'IP Blocked'
							}
						}
					},
					{ timeout: 3000 }
				)

				const audioBytes = await page.evaluate((audioLink) => {
					return (async () => {
						const response = await window.fetch(audioLink)
						const buffer = await response.arrayBuffer()
						return Array.from(new Uint8Array(buffer))
					})()
				}, audioLink)
				console.log('Successfully processed audio bytes')

				const httpsAgent = new https.Agent({ rejectUnauthorized: false })
				response = await axios({
					httpsAgent,
					method: 'post',
					url: 'https://api.wit.ai/speech',
					data: new Uint8Array(audioBytes).buffer,
					headers: {
						Authorization: 'Bearer JVHWCNWJLWLGN6MFALYLHAPKUFHMNTAC',
						'Content-Type': 'audio/mpeg3',
					},
				})
				console.log(`Successfully analyzed the audio content: ${response.data.text}`)

				if (!response?.data || !response.data.text) {
					imageFrame && (await imageFrame.click('#recaptcha-reload-button', { delay: rdn(30, 150) }))
				}
				const audioTranscript = response?.data.text.trim()

				await imageFrame?.click('#audio-response', { delay: rdn(30, 150) })
				await sleep(1000)
				await imageFrame?.type('#audio-response', audioTranscript, { delay: rdn(30, 75) })
				await sleep(1000)
				await imageFrame?.click('#recaptcha-verify-button', { delay: rdn(30, 150) })

				await page.waitForFunction(
					() => {
						const iframe: HTMLIFrameElement | null = document.querySelector('iframe[src*="api2/anchor"]')
						if (!iframe) return false
						const doc = iframe.contentWindow as Window
						return !!doc.document.querySelector('#recaptcha-anchor[aria-checked="true"]')
					},
					{ timeout: 1000 }
				)
				return page.evaluate(() => {
					const dom: HTMLInputElement | null = document.querySelector('#g-recaptcha-response')
					if (dom) return dom.value
					else {
						throw 'Failed to fetch InputValue'
					}
				})
			} catch (err) {
				break
			}
		}
		return false
	} catch (err) {
		console.log(err)
		return false
	}
}
