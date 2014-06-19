dependo
===========

Visualize your CommonJS or AMD module dependencies in a force directed graph report - powered by [D3.js](http://d3js.org/).

Introduction
-------------

Let me introduce dependo - A small visualization tool that draws an force directed graph of JavaScript dependencies that has been annotated with either CommonJS, or AMD. Behind the scene I’m using a wonderful library named [node-madge](https://github.com/pahen/node-madge/), to extract the dependencies and combined with the power of [D3.js](http://d3js.org/) I draw a beautiful zoomable directed graph.


You can read the full introduction to the project in my [blog post](http://blog.kenneth.io/blog/2013/04/01/visualize-your-javaScript-dependencies-with-dependo/).

Features
-------------
- Draw a graph of nodes, where each module is represented as a node.
- Google Maps's like zooming, dragging and panning.
- Connect nodes with it's dependencies via lines.
- Hovering a node will highlight it's direct dependencies.
- It's possible to drag a node to a specific position, to re-layout the graph.

Report example
-------

The best way to show something is by example, so here I generated a graph of the official RequireJS [multipage](https://github.com/requirejs/example-multipage) example:

![Example](https://raw.github.com/auchenberg/dependo/gh-pages/example/dependo.jpg)

See the example here: http://auchenberg.github.com/dependo/example

Installation
------------
To install as a library:

    $ npm install dependo

To install the command-line tool:

    $ sudo npm -g install dependo

API
---
```JavaScript

  var Dependo = require('dependo');

  // Fire up an dependo instance
  var dependo = new Dependo(src, {
    format: 'amd',
    exclude: '^node_modules',
    transform: function(dep){
        //Apply a transformation on dependencies 
        ....
        
        return dep;
        
    }
  });

  dependo.generateHtml();
  ...
```

CLI
---
    Usage: dependo [options] <file|dir ...>

    Options:

      -h, --help             output usage information
      -V, --version          output the version number
      -f, --format <name>    format to parse (amd/cjs)
      -x, --exclude <regex>  a regular expression for excluding modules

### Generate HTML report of all module dependencies (AMD), and save it to /example/report.html

    $ dependo -f amd /path/src > example/report.html
    
Grunt
-----
I also wrote a grunt-task that can be found in this seperate repository: https://github.com/auchenberg/grunt-dependo

Roadmap
-------
dependo is still very much in progress, so here is the todo-list:

- Proper label positioning: Avoid label collisions and make the graph more readable.
- Testing! Unit tests of D3 render logic, and the grunt-task itself

Thanks to
-----------
This project would'nt have been possible without the great work on [node-madge](https://github.com/pahen/node-madge/) by Patrik Henningson, or wonderful [D3.js](http://d3js.org/) library. 


Inspiration
-----------
http://bl.ocks.org/1153292



