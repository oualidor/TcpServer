const ExpressResult = (finalResult, result)=>{
    if(finalResult) return {finalResult: finalResult, result}
    return {finalResult: false, error: result}
}

module.exports = {ExpressResult}