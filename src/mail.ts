// import * as path from 'path'
import * as nodemailer from 'nodemailer'
import { EMAIL } from './settings'
import { LoggerMail } from './log4js'
import { getExactTime } from './utils/index'

type _coreMail = (url: string) => Promise<string>

const CoreMail: _coreMail = async (url) => {
	let transporter = nodemailer.createTransport({
		port: 465,
		service: EMAIL.Email_Service, //Service List  https://nodemailer.com/smtp/well-known/
		secure: true,
		auth: {
			user: EMAIL.Email_Address,
			pass: EMAIL.Smtp_Pass,
		},
	})

	let info = await transporter.sendMail({
		from: `"Crawler Alert=>Gaming GeForce RTX Video Card!" <${EMAIL.Email_Address}>`,
		to: EMAIL.Email_To,
		subject: `${new Date().toLocaleDateString()} New RTX is selling online now!`, // Subject line
		html: `
		<div>
		<div style="font-size: 18px;">Hi there,</div>
		<div style="font-size: 16px ;color: rgb(214, 67, 67);"> <a href="${url}">New Update for ASUS TUF Gaming GeForce RTX 3060/3070/3080 OC 12GB GDDR6X Video Card</a></div>
		<div>Please check it promptly.</div>
		<div style="margin-top: 40px;">Be quick!</div>
		<div style="margin-top: 20px;font-style: italic;">Automated Crawler</div>
	</div>
		`,
	})

	LoggerMail.info(`Successfully sent update e-mail on ${getExactTime()}`)
	LoggerMail.info(`'Update Email has been sent:: %s',${info.messageId}`)
	return `Sent on ${getExactTime()}`
}

export default CoreMail
