# Battle Arena
## ESGI graduation project

> [http://esgi-battle-arena.herokuapp.com](http://esgi-battle-arena.herokuapp.com)

> - [Node.js](http://nodejs.org)
- [Express.js](http://expressjs.com)
- [Socket.io](http://socket.io)
- [MongoDB](http://www.mongodb.org)
- [Redis](http://redis.io)
- [Selenium](http://seleniumhq.org)

> Author:
  [@adrienschuler](https://twitter.com/#!/adrienschuler)

## Installation (UNIX)

- Node.js

```bash
$ sudo wget http://nodejs.org/dist/v0.6.18/node-v0.6.18.tar.gz
$ sudo tar xvzf node-v0.6.18.tar.gz 
$ cd node-v0.6.18
$ sudo ./configure	
$ sudo make
$ sudo make install
```

Check node.js install :

```bash
$ node -v
> v0.6.18
```

Check npm install :

```bash
$ npm -h
```

Should output npm help.

- Redis 

```bash
$ sudo wget http://redis.googlecode.com/files/redis-2.4.15.tar.gz
$ sudo tar xvzf redis-2.4.15.tar.gz
$ cd redis-2.4.15
$ sudo make
```

Launch Redis server :

```bash
$ ./src/redis-server 
```

- Checkout project

Requires [Git](http://git-scm.com)

```bash
$ sudo apt-get install git-core
```

```bash
$ sudo git clone https://github.com/adrienschuler/Battle-Arena.git
$ cd Battle-Arena
$ sudo npm install
$ node index.js
```

Go to [http://localhost:5000/](http://localhost:3000/) !

## Running tests

- Selenium

Download Selenium server :

```bash
$ sudo wget http://selenium.googlecode.com/files/selenium-server-standalone-2.24.1.jar
```

Launch Selenium server daemon :

```bash
java -jar selenium-server-standalone-2.24.1.jar
```

Run Selenium test suite :

```bash
$ ruby test/selenium.rb
```



## License 

(The MIT License)

Copyright (c) 2012 adrien.schuler+github@gmail.com

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  