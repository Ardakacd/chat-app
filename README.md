#Information

-In api side node, express and socket are used. <br/>
-In client side react native and expo are used.  <br/>

# Running Instructions

1)Go to the api folder <br/>
2)Run npm i <br/>
3)Startup your mongodb server(this application uses mongodb as database). <br/>
4)Create .env file and put <br/>
  JWT_SECRET = d1e8a70b5ccab1dc2f56bbf7e99f064a660c08e361a35751b9c483c88943d082 <br/>
  SALT_ROUNDS = 10 <br/>
  NODE_ENV=development <br/>
5)Run npm run dev. <br/>
6)Go to the client folder. <br/>
7)Run npm i. <br/>
8)To fully use the application you should have installed 2 emulators on your computer. One of the should be ios, other one is android. <br/>
9)Run expo start --ios <br/>
10)Run expo start --android <br/>
