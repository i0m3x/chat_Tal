1. npm init

2. npm install express --save

3. npm install watch-server

4. npm install browserify

5. npm install nodemon

noticed I am missing build in package

{
  "name": "second_attempt",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "browserify": "^16.5.2",
    "express": "^4.17.1",
    "nodemon": "^2.0.4",
    "watch-server": "^1.3.0"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


referenced this github user: https://github.com/evennode/socket.io-chat/blob/master/app.js

watched this youtube video: https://www.youtube.com/watch?v=rxzOqP9YwmM

express is important b/c it is a back-end framework

web-server framework

definition of framework is loose

node's http library kind of provides a framework- node is a runtime environment, although some will say it's a framework

express is 3rd party on top of http library (node's) it is an abstraction layer


a higher-layer