const ConsoleMsgs = {
    success: (Msg) =>{
        console.log('\x1b[32m%s\x1b[0m', Msg  +" :)");
    },
    error: (Msg) =>{
        console.log('\x1b[31m%s\x1b[0m', "Error: "+Msg);
    },
    heavyError: (Msg) =>{
        console.log('\x1b[41m%s\x1b[0m', "Error: "+Msg);
    },
    debug: (Msg) =>{
        console.log('\x1b[32m%s\x1b[0m', "**********************" + Msg  +" **************");
    },
}

module.exports = {ConsoleMsgs}