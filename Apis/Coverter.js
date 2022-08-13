function hexToString(str1) {
    var hex  = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}

function stringToHex(str){
    const bufferText = Buffer.from(str, 'utf8');

    const text = bufferText.toString('hex');
    return text
}

function dexToPackLen(number){
    if(number % 2 >0) number = number + 1
    let t = number/2
    t = t.toString(16)
    switch (t.length){
        case 1:
            return "000"+t
        case 2:
            return "00"+t
        case 3:
            return  "0"+t
    }
    return "FFFF"
}

module.exports = {hexToString, stringToHex, dexToPackLen}


