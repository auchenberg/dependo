(function() {

  var url = 'data.json'
  var r = 10;
  var graph, layout, zoom, nodes, links, data;
  var linkedByIndex = {};
  var graphWidth, graphHeight;

  // Helpers
  function formatClassName(prefix, object) {
    return prefix + '-' + object.id.replace(/(\.|\/)/gi, '-');
  }

  function findElementByNode(prefix, node) {
    var selector = '.'+formatClassName(prefix, node);
    return graph.select(selector);
  }

  function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
  }

  function fadeRelatedNodes(d, opacity, nodes, links) {

    // Clean
    $('path.link').removeAttr('data-show');

    nodes.style("stroke-opacity", function(o) {
        var thisOpacity;

      if (isConnected(d, o)) {
        thisOpacity = 1;
      } else {
        thisOpacity = opacity;
      }

      this.setAttribute('fill-opacity', thisOpacity);
      this.setAttribute('stroke-opacity', thisOpacity);

      if(thisOpacity == 1) {
        this.classList.remove('dimmed');
      } else {
        this.classList.add('dimmed');
      }

      return thisOpacity;
    });

    links.style("stroke-opacity", function(o) {

      if (o.source === d) {

        // Highlight target/sources of the link
        var elmNodes = graph.selectAll('.'+formatClassName('node', o.target));
        elmNodes.attr('fill-opacity', 1);
        elmNodes.attr('stroke-opacity', 1);

        elmNodes.classed('dimmed', false);

        // Highlight arrows
        var elmCurrentLink = $('path.link[data-source=' + o.source.index + ']');
        elmCurrentLink.attr('data-show', true);
        elmCurrentLink.attr('marker-end', 'url(#regular)');

        return 1;

      } else {

        var elmAllLinks = $('path.link:not([data-show])');

        if(opacity == 1) {
          elmAllLinks.attr('marker-end', 'url(#regular)');
        } else {
          elmAllLinks.attr('marker-end', '');
        }

        return opacity;
      }

    });
  }


  function render() {

    zoom = d3.behavior.zoom();
    zoom.on("zoom", onZoomChanged);

    // Setup layout
    layout = d3.layout.force()
      .gravity(.05)
      .charge(-300)
      .linkDistance(100);

    // Setup graph
    graph = d3.select(".graph")
      .append("svg:svg")
      .attr("pointer-events", "all")
      .call(zoom)
      .append('svg:g')
        .attr('width', graphWidth)
        .attr('height', graphHeight);

    d3.select(window).on("resize", resize);

    // Load graph data
    var graphData = window.getGraphData();
    // Load node placement
    var storedNodes = getNodes();
    graphData.nodes = graphData.nodes.map(function(n){
      if(storedNodes[n.id]){
        return storedNodes[n.id];
      } else {
        return n;
      }
    })
    
    renderGraph(graphData);

    data = graphData;

    // Resize
    resize();

    centerGraph();

    // Controlers
    $('.control-zoom a').on('click', onControlZoomClicked);
  }

  function resize() {
    graphWidth = window.innerWidth,
    graphHeight = window.innerHeight;
    graph.attr("width", graphWidth)
         .attr("height", graphHeight);

    layout.size([graphWidth, graphHeight])
          .resume();
  }

  function centerGraph() {

    var centerTranslate = [
      (graphWidth / 2) - (graphWidth * 0.2 / 2),
      (graphHeight / 2) - (graphHeight * 0.2 / 2),
    ];

    zoom.translate(centerTranslate);

    // Render transition
    graph.transition()
      .duration(500)
      .attr("transform", "translate(" + zoom.translate() + ")" + " scale(" + zoom.scale() + ")");
  }

  function renderGraph(data) {
    // Markers
    graph.append("svg:defs").selectAll("marker")
        .data(['regular'])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

    // Lines
    links = graph.append('svg:g').selectAll("line")
      .data(data.links)
      .enter().append("svg:path")
      .attr('class', 'link')
      .attr("data-target", function(o) { return o.target })
      .attr("data-source", function(o) { return o.source })
      .attr("marker-end", function(d) { return "url(#regular)"; });
    // Nodes
    nodes = graph.append('svg:g').selectAll("node")
      .data(data.nodes)
      .enter().append("svg:g")
      .attr("class","node")
      .call(layout.drag)
      .on("mousedown", onNodeMouseDown);    

      // Circles
      nodes.attr("class", function(d) { return formatClassName('node', d) })
      nodes.append("svg:circle")
        .attr("class", function(d) { return formatClassName('circle', d) })
        .attr("r", 6)
        .on("mouseover", onNodeMouseOver.bind(this, nodes, links) )
        .on("mouseout", onNodeMouseOut.bind(this, nodes, links) );


      // A copy of the text with a thick white stroke for legibility.
      nodes.append("svg:text")
          .attr("x", 15)
          .attr("y", ".31em")
          .attr("class", function(d) { return 'shadow ' + formatClassName('text', d) })
          .text(function(d) { return d.id; });

      nodes.append("svg:text")
          .attr("class", function(d) { return formatClassName('text', d) })
          .attr("x", 15)
          .attr("y", ".31em")
          .text(function(d) { return d.id; });

    // Build linked index
    data.links.forEach(function(d) {
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    // Draw the
    layout.nodes(data.nodes);
    layout.links(data.links);
    layout.on("tick", onTick);
    layout.start();

    zoom.scale(0.4);

    // Render transition
    graph.transition()
      .duration(500)
      .attr("transform", "scale(" + zoom.scale() + ")");

  }

  function onNodeMouseOver(nodes, links, d) {

    // Highlight circle
    var elm = findElementByNode('circle', d);
    elm.style("fill", '#b94431');

    // Highlight related nodes
    fadeRelatedNodes(d, .05, nodes, links);
  }

  function onNodeMouseOut(nodes, links, d) {

    // Highlight circle
    var elm = findElementByNode('circle', d);
    elm.style("fill", '#ccc');

    // Highlight related nodes
    fadeRelatedNodes(d, 1, nodes, links);
    debouncedPersist();
  }

  function onTick(e) {

    links.attr("d", function(d) {
      var dx = d.target.x - d.source.x,
          dy = d.target.y - d.source.y,
          dr = Math.sqrt(dx * dx + dy * dy);
      return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    });

    nodes.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

  function onControlZoomClicked(e) {
    var elmTarget = $(this)
    var scaleProcentile = 0.20;

    // Scale
    var currentScale = zoom.scale();
    var newScale;
    if(elmTarget.hasClass('control-zoom-in')) {
      newScale = currentScale * (1 + scaleProcentile);
    } else {
      newScale = currentScale * (1 - scaleProcentile);
    }
    newScale = Math.max(newScale, 0);

    // Translate
    var centerTranslate = [
      (graphWidth / 2) - (graphWidth * newScale / 2),
      (graphHeight / 2) - (graphHeight * newScale / 2)
    ];

    // Store values
    zoom
      .translate(centerTranslate)
      .scale(newScale);

    // Render transition
    graph.transition()
      .duration(500)
      .attr("transform", "translate(" + zoom.translate() + ")" + " scale(" + zoom.scale() + ")");

  }

  function onZoomChanged() {
    graph.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
  }
    
  function persistNodes(nodes) {
    var store = nodes.filter(function(n){ return n.fixed }).reduce(function(mem,n){
      mem[n.id]=n;
      return mem;
    },{});
    store = JSON.stringify(store);
    window.localStorage.setItem("dependo"+window.graphIdentification, store);
  }

  function getNodes() {
    try {
      if(window.nodePositions){
        return JSON.parse(window.nodePositions);
      }else{
        return JSON.parse(window.localStorage.getItem("dependo"+window.graphIdentification)) || {};
      }
    } catch (e) {
      return {};
    }
  }
  
  
  function onNodeMouseDown(d) {
     d.fixed = true;
     d3.select(this).classed("sticky", true);
     debouncedPersist();
  }
    
  var persistTimer;
  function debouncedPersist() {
    clearTimeout(persistTimer);
    persistTimer = setTimeout(function(){
      persistNodes(data.nodes)
    },1000);
  }

  render();

})();
