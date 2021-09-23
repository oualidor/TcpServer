const bcrypt = require('bcrypt');

const BACKEND_SERVER = "http://164.132.59.129:3000/"
const adminMail = "walid.khial@gmail.com"
const adminPassword  = bcrypt.hashSync('16026363', 10);
const jwtPrivateKey = "lkjlfngrpgjefvml,s:;vnsomvfijv";


module.exports = {BACKEND_SERVER, adminMail, adminPassword, jwtPrivateKey}