import { _INFO, _EMAIL, _TIME_SET, _USER, _URL, _BANK } from './utils/types'
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
	Solver: false,
	Target: CHECKLIST.RTX_3060_3070,
	Server_Chrome_Path: SERVER_CHROME_PATH.Snap, // server chromium path
	HeadLess: false,
	Test: true, // proxy or not
	Slow_Mode: false,
}

export const TIME_SET: _TIME_SET = {
	TimerB_Wait: 0.3 * min, // timerB backup time
	Time_Gap: 0.2 * min, // reboot waiting time
	Logger_Gap: 200, // min times to trigger local logs.`
	Loading_Time: 5 * seconds, // Time gap of each round
}
export const EMAIL: _EMAIL = {
	Email_Address: 'XXXXXX@gmail.com',
	Email_Service: 'Gmail',
	Smtp_Pass: 'XXXXX',
	Email_To: ['XXXXXX@gmail.com'],
}
export const BANK: _BANK = {
	LAST_4_DIGIT: 'XXXX',
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
