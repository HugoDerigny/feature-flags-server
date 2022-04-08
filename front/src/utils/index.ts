import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import axios from 'axios'

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')

const http = axios.create({
	headers: {
		Authorization: process.env.REACT_APP_API_AUTHORIZATION,
	},
	baseURL: process.env.REACT_APP_API_URL,
})

export { http, timeAgo }
