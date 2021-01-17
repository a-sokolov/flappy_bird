/**
 * Класс для хранения списка зарегистрированных интервалов,
 * которые нужно запускать каждый раз, когда приходит время.
 * */
export class Intervals {
  constructor() {
    this.intervals = []
  }

  /**
   * Добавление интервала.
   * @param timeout время, когда должен сработать интервал
   * @param callback колбэк, который нужно вызвать
   * */
  addInterval(timeout, callback) {
    this.intervals.push({ timeout, callback, time: 0 })
  }

  /** Удаление интервала */
  removeInterval(timeout, callback) {
    this.intervals = this.intervals.filter(interval => {
      return !(interval.timeout === timeout && interval.callback === callback)
    })
  }

  /** Проверка интервалов */
  checkIntervals(time) {
    this.intervals.forEach(interval => {
      if (time - interval.time >= interval.timeout) {
        // Как только проходит заданное время интервала, то вызываем колбэк
        interval.callback?.()
        // Обновляем время последнего вызова
        interval.time = time
      }
    })
  }
}