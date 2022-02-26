import { RawVitals } from '../types/RawService'

class Vitals {
	private readonly _averageResponseTime: number
	private readonly _history: Array<{ x: string; y: number }>

	constructor(averageResponseTime: number, history: Array<{ x: string; y: number }>) {
		this._averageResponseTime = averageResponseTime
		this._history = history
	}

	static fromJson(object: RawVitals): Vitals {
		return new Vitals(Number(object.averageResponseTime), object.history)
	}

	get averageResponseTime(): number {
		return this._averageResponseTime
	}

	get history(): Array<{ x: string; y: number }> {
		return this._history
	}
}

export default Vitals
