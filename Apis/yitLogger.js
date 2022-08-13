const morgan = require('morgan')
const rt = require("file-stream-rotator")

morgan.token("custom", "(:method) :url => :status :remote-addr" )

let logWriter = rt.getStream({filename:"Logs/log", frequency:"daily", verbose: true});



module.exports = morgan('custom', { stream: logWriter })