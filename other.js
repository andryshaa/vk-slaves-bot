/*
    "Reset" = "\x1b[0m",
    "Bright" = "\x1b[1m",
    "Dim" = "\x1b[2m",
    "Underscore" = "\x1b[4m",
    "Blink" = "\x1b[5m",
    "Reverse" = "\x1b[7m",
    "Hidden" = "\x1b[8m",
    "FgBlack" = "\x1b[30m",
    "FgRed" = "\x1b[31m",
    "FgGreen" = "\x1b[32m",
    "FgYellow" = "\x1b[33m",
    "FgBlue" = "\x1b[34m",
    "FgMagenta" = "\x1b[35m",
    "FgCyan" = "\x1b[36m",
    "FgWhite" = "\x1b[37m",
    "BgBlack" = "\x1b[40m",
    "BgRed" = "\x1b[41m",
    "BgGreen" = "\x1b[42m",
    "BgYellow" = "\x1b[43m",
    "BgBlue" = "\x1b[44m",
    "BgMagenta" = "\x1b[45m",
    "BgCyan" = "\x1b[46m",
    "BgWhite" = "\x1b[47m"
*/

log = (text) => {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    hours = hours < 10 ? '0'+hours : hours
    let minutes = date_ob.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes
    let seconds = date_ob.getSeconds();
    seconds = seconds < 10 ? '0'+seconds : seconds

    console.log( '\x1b[36m%s\x1b[0m', '['+ hours + ':' + minutes + ':' + seconds +'] \x1b[37m' + text, '\x1b[0m')
}

//log('\x1b[44m[123] Баланс: 123 Рабов: 123 Доход: 123 ТОП: 1')

module.exports = { log }