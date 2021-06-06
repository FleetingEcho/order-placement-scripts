export interface _INFO {
	Manual_Login: boolean
	Store_Page: boolean
	Location_Ottawa: boolean
	Local: boolean
	Logger: boolean
	Solver: boolean
	Target: string
	Server_Chrome_Path: string
	HeadLess: boolean
	Test: boolean
	Slow_Mode: boolean
}
export interface _TIME_SET {
	Logger_Gap: number
	TimerB_Wait: number
	Time_Gap: number
	Loading_Time: number
}
export interface _EMAIL {
	Email_Address: string
	Email_Service: string
	Smtp_Pass: string
	Email_To: Array<string>
}

export interface _URL {
	Complete_Url: string
	Base_Url: string
	Login_Url: string
}
export interface _USER {
	Username: string
	Password: string
}
export interface _BANK {
	LAST_4_DIGIT: string
	LAST_NAME: string
}
