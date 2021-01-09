export class Intervals {
  constructor() {
    this.intervals = []
  }

  addInterval(timeout, callback) {
    this.intervals.push({ timeout, callback, time: 0 })
  }

  removeInterval(timeout, callback) {
    this.intervals = this.intervals.filter(interval => {
      return !(interval.timeout === timeout && interval.callback === callback)
    })
  }

  checkIntervals(time) {
    this.intervals.forEach(interval => {
      if (time - interval.time >= interval.timeout) {
        interval.callback && interval.callback()
        interval.time = time
      }
    })
  }
}