const YitLogger = require("./Apis/YitLogger");
YitLogger.transactionLogger.error({Label: 'test', level: 'info', message: 'Hello, Winston!'});




//Login
//0020 60 01 88 11223344 55667788 0233 0011 524c314830383139303632303031313700
//0008 60 01 01 11223344 01

//heartBit
//0007 61 01 00 11223344




//Set server
//001f 63 01 8a 11223344 000e 3132312e34312e36302e32333200 0005 3838383800 1e
//0007 63 01 00 11223344

//Info
//0007 64 01 8a 11223344


//0007 64 01 8a 11223344
//0008 65 01 8a 11223344 03
//0011 65 01 74 11223344 03 01 524c31417c000064
//0010 66 01 9f 11223344 02 594c424895000611
//0009 66 01 fa 11223344 02 01