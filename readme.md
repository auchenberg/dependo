dependo
===========

Visualize your CommonJS or AMD module dependencies in a force directed graph using D3.js.

Introduction
-------------

You can read the full introduction to the project in my [blog post](http://blog.kenneth.io/blog/2013/01/23/visualize-your-javaScript-dependencies-with-grunt-dependencygraph/).

Features
-------------
- Draw a graph of nodes, where each module is represented as a node.
- Google Maps's like zooming, dragging and panning.
- Connect nodes with it's dependencies via lines.
- Hovering a node will highlight it's direct dependencies.
- It's possible to drag a node to a specific position, to re-layout the graph.

Example
-------
The best way to show something is by example, so here I generated a dependencygraph of the offical [RequireJS multipage-example](https://github.com/requirejs/example-multipage)

![Example](https://raw.github.com/auchenberg/grunt-dependencygraph/master/example/graph_example.png)

http://auchenberg.github.com/dependo/example

# Installation

To install as a library:

  $ npm install dependo

To install the command-line tool:

  $ sudo npm -g install dependo

# API

```JavaScript

  var Dependo = require('dependo');

  // Fire up an dependo instance

  var dependo = new Dependo(src, {
    format: Commander.format,
    exclude: Commander.exclude
  });

  var html = dependo.generateHtml();

  ...


# CLI

  Usage: dependo [options] <file|dir ...>

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --format <name>    format to parse (amd/cjs)
    -x, --exclude <regex>  a regular expression for excluding modules

# Examples

### Generate HTML report of all module dependencies (AMD)

$ dependo --format amd /path/src > output/report.html


Roadmap
-------
dependo is still very much in progress, so here is the todo-list:

- Proper label positioning: Avoid label collisions and make the graph more readable.
- Testing! Unit tests of D3 render logic, and the grunt-task itself

Thanks to:
-----------
This project would'nt have been possible without the great work by Patrik Henningson on [node-madge](https://github.com/pahen/node-madge/)


Inspiration
-----------
http://bl.ocks.org/1153292



