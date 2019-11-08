# Node worker threads

Some example code to accompany the article https://www.webpusher.ie/node/worker/threads

## Running the code

You'll need at least node v11.7.0 which supports threads, or use the `--experimental-worker` switch on lower versions. At time of writing the LTS version of node supports worker threads.

To run the project first install the dependencies

```bash
$ npm install
```

There npm scripts provided to run the various projects

```bash
$ npm run example1
$ npm run example2
```

## Basic example

The word is immediately returned from the worker. Nothing will be in order.

``` 
4 - found my way downstairs
14 - I went into a dream
3 - dragged a comb across my head
8 - found my coat
12 - had a smoke
11 - made my way upstairs
13 - somebody spoke
7 - I noticed I was late
9 - grabbed my hat
2 - fell out of bed
5 - and drank a cup
1 - woke up
10 - made the bus in seconds flat
6 - looking up
```


## Example 2

Same example with timings




## Pool management
