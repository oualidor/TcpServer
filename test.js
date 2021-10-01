const TcpClient = require("./Structures/TcpClient");
let list = []
list.push(new TcpClient(5))
function tt(list){
    return list[0]
}
let client = tt(list)
client.setStat(true)

console.log(list)