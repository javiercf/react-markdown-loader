cli-path-resolve
================

resolve/normalize a filepath using the cwd as the basepath if relative

## installation

```
$ npm install cli-path-resolve
```

## usage

If an argument is passed to your cli script that points to the file system, it can be absolute or relative.

If it's relative - this module will use the current working directory (process.cwd) as the basedir.

globalscript.js

```js
var args = require('minimist').parse(process.argv, {
	alias:{
    f:'filepath'
  }
})
var resolve = require('cli-path-resolve')
var filepath = resolve(args.filepath)

// filepath is now normalized and absolute
console.log(filepath)
```

If we have installed globalscript.js globally - we can run it from anywhere.

```
$ cd /home/myfolder
$ globalscript.js --filepath imgs/balloons.jpg
/home/myfolder/imgs/balloons.jpg
```

## api

### `var resolved = resolve(path)`

Will return path if it is absolute or will resolve it against process.cwd if its relative.

### license

MIT