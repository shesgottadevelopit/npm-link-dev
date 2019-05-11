# Project: npm-link-dev

**Goal:** Create a script that runs with npm script and will automatically npm link globally installed packages

Files needed to test:
- `gulpfile.js`
- `package.json`

## Notes
In order to complete this  project I've had to learn these new concepts.
- `try ... catch`
- `process.exit(1);`
- `child_process` | spawn vs exec . spawn returns a stream, exec returns a buffer
- what is `stdin, stdout, stderr`: https://medium.com/@emilycoco/what-are-stdout-stdin-and-stderr-2d6d27892c38
- what is a buffer and what is a stream
- a primer on nodejs events, promises, and nested callbacks: https://medium.freecodecamp.org/understanding-node-js-event-driven-architecture-223292fcbc2d
- a primer on nodejs stream: https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93


## Spawn vs Exec
- Use `exec` to run programs that return result statuses, instead of data. https://www.hacksparrow.com/difference-between-spawn-and-exec-of-node-js-child_process.html
- On how to get the returned value of the exec child process

## What is stdin, stdout, stderr
These are pointers that are automatically pointing to input or output streams when a program runs. By default, they point to the terminal, unless they're configured otherwise.
- `stdin` points to keyboard input (keystrokes)
- `stdout` and `stderr` point to terminal output

You can change where your pointers point to using redirection commands:
- specify stdout: `>`
> `echo hello > file.txt` is an example of pointing output to a file instead of the terminal
> `echo hello >> file.txt` is saying use this location but don't overwrite its contents, just append.

- specify stdin and stdout
> `cat < original.txt > newfile.txt` for the cat command, use original.txt as the stdin and then output the results of cat to newfile.txt

- specify stderr
> prin foo
> prin food 2> /dev/null
The first command will print an error to the terminal. The second generates the same error but points it to `stderr` which is then pointed to /dev/null so it is eventually not printed to the terminal

- pipe commands using `|`
This is when you run a command and pass the results to a filter. It's when you return the results of one command and use it somewhere else. Some linux filters that can be piped:
- grep: return text that matches a string pattern
- find: find files by name

**More on stdout, stdin, stderr**: http://www.learnlinux.org.za/courses/build/shell-scripting/ch01s04.html

## Child processes
Source: https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a
In a child process, the `stdout/stderr` streams are readable streams while the `stdin` stream is a writable one.
    - on the readable streams, we can listen to the data
    - we can use the `stdin` writable stream to send a command some input
        - as with any writable stream, the easiest way to consume it is using the `pipe` function


Example:
```js
const { spawn } = require('child_process');

const child = spawn('wc');

process.stdin.pipe(child.stdin) // pipe the main process into the child process, a readable stream into a writable stream

child.stdout.on('data', (data) => {
  console.log(`child stdout:\n${data}`);
});
```


## Notes on how NPM scripts work

**Example script section in package.js**

```json

"scripts": {
    "start": "node index.js",
    "say-hello": "echo 'Hello World!'"
}

```
There are built-in npm scripts that have established meaning, which are listed [here](https://docs.npmjs.com/misc/scripts).

These are custom npm scripts. In order to run them in the CLI, append `run` or `run-script` to the command name. For example: `npm run say-hello`
- Adding pre and post to a custom script name indicates to npm that the command should happen before and after

**Running npm scripts within an npm script**
```json
"say-hello": "echo 'Hello World!'",
 "awesome-npm": "npm run say-hello && echo 'echo NPM is awesome!'"
```

**Running bash commands within a npm script**
```json
"scripts": {
    "clean": "rm -r dist && mkdir dist",
    "build": "npm run clean && webpack"
}
```

## Scripting
Consider writing a script in bash or JS and calling it within the npm script.

```sh
#!/usr/bin/env bash

# filename: hello.sh
echo "What's your name?"
read name
echo "Hello there, $name!"
```

The do the following:
- Define the script and filename in package.json as: `"bash-hello": "bash hello.sh"`
- And then call it: `npm run bash-hello`

## Try ... Catch
- try: code to try that may produce errors
- catch: code that will handle any errors
- throw: keyword you can use to throw your own custom errors
- finally: code that will run after a try/catch block regardless of the outcome

## What is a Buffer?
https://medium.freecodecamp.org/do-you-want-a-better-understanding-of-buffer-in-node-js-check-this-out-2e29de2968e8
> the Buffer class was introduced as part of the Node.js API to make it possible to manipulate or interact with streams of binary data.

### Binary data

Binary data is how computers store/represent data (e.g. 01, 10, 0100)
- Each number in a binary is a bit
- To store a number like `12`, the computer will convert it to its binary representation which is `1100`.
- This is determined by using the binary numeral system

Another example:
- Say you want to represent a string with "L"
- The computer will convert the character to a number, then convert that number to its binary.
- The number representation of "L" is 76, check with `L.charCodeAt()` in the console. This represents the **Character Code** or **Code Point**.
- That number 76 is determined by a **character set** which establishes rules for what number represents what character. There are two popular character sets: Unicode and ASCII. In this case, the 76 is based on Unicode
-  Then how does that unicode number turn to a binary number?
- There are rules for how a number should be represented in binaries. How many bits can be used to represent a number. This is called **character encoding**
- UTF-8 is a character encoding that states characters should be encoded in bytes. A byte is a set of 8 bits (eight 1s and 0s). This means that 8 bits can only be used to represent the character codee/code point of any character in a binary.
    - This means that since the number 12's binary representation is 1100, in UTF-8, it has to be stored as 00001100. More bits needed to be added to the left side.
    - A number like 76 would be stored as 01001100

For more research: https://www.w3.org/International/questions/qa-what-is-encoding

### Buffers and Streams
A stream is a sequence of data being moved from one point to another

When data is moved, if the rate the data arrives is faster than the rate the process consumes the data, the excess needs to wait somewhere for its turn to be processed. The waiting area is a buffer. It is a place in computer memory where data is stored temporarily before being processed.

> Node.js can’t control the speed or time of data arrival, the speed of the stream. It only can decide when it’s time to send out the data.

### Interacting with buffers
You can create a buffer in node.

### Types of streams
- Readable streams (you can read data from it)
- Writable streams (you can feed data into it)
- Duplex streams (It is open to both read and write)
- Transform streams (A custom duplex stream for processing data(compressing, validity check) that is ingress/egress for it)


**Appendix:**
- Resource to be able to check if npm packages are installed: https://stackoverflow.com/questions/50840726/check-if-package-installed-from-within-node-js-script
- jkl
