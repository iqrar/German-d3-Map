'use strict';

angular.module('German-d3-Map')
  .controller('Home', ['$scope', '$http', '$sce', '$timeout', function($scope, $http, $sce, $timeout) {
  
var projection;
$scope.map = function(){
var width = 1500,
height = 1900;
var path = d3.geo.path();
var svg = d3.select("#map").append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr("viewBox", "0 0 " + width + " " + height )
    .attr("preserveAspectRatio", "xMinYMin");

// tooltip
var tooltip = d3.select('#map').append('div')
            .attr('class', 'hidden tooltip');
d3.json("germany.json", showData);

function showData(error, de) {
    var subunits = topojson.object(de, de.objects.subunits);

     projection = d3.geo.mercator()
     .center([10.5, 51.35])
     .scale(8000)
     .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);
    
   //put everything in g   
    var g = svg.append("g");
        
        g.append("path")
        .datum(subunits)
        .attr("d", path);
        
   // states with tooltip
     g.selectAll(".subunit")
        .data(topojson.object(de, de.objects.subunits).geometries)
      .enter().append("path")
        .attr("class", function(d) { return "subunit " + d.properties.name; })
        .attr("d", path).on('mousemove', function(d) {
                    var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });
                    tooltip.classed('hidden', false)
                        .attr('style', 'left:' + (d3.event.pageX-225) +
                                'px; top:' + (d3.event.pageY-220) + 'px')
                        .html(d.properties.name);
                })
                .on('mouseout', function() {
                    tooltip.classed('hidden', true);
                });
      
    g.append("path")
        .datum(topojson.mesh(de, de.objects.subunits, function(a,b) { if (a!==b || a.properties.name === "Berlin"|| a.properties.name === "Bremen"){var ret = a;}return ret;}))
        .attr("d", path)
        .attr("class", "subunit-boundary");

    // cities
    g.append("path")
        .datum(topojson.object(de, de.objects.places.geometries))
        .attr("d", path)
        .attr("class", "place")

    g.selectAll(".place-label")
        .data(topojson.object(de, de.objects.places).geometries)
      .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(d.coordinates) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { if (d.properties.name!=="Berlin"&&d.properties.name!=="Bremen"){return d.properties.name;} })
        .attr("x", function(d) { return d.coordinates[0] > -1 ? 6 : -6; })
        .style("text-anchor", function(d) { return d.coordinates[0] > -1 ? "start" : "end"; })
     
     g.selectAll(".subunit-label")
        .data(topojson.object(de, de.objects.subunits).geometries)
      .enter().append("text")
        .attr("class", function(d) { return "subunit-label " + d.properties.name; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", function(d){ 
        if(d.properties.name==="Sachsen"||d.properties.name==="Thüringen"||d.properties.name==="Sachsen-Anhalt"||d.properties.name==="Rheinland-Pfalz")
            {return ".9em"}
        else if(d.properties.name==="Brandenburg"||d.properties.name==="Hamburg")
            {return "1.5em"}
        else if(d.properties.name==="Berlin"||d.properties.name==="Bremen")
            {return "-1em"}else{return ".35em"}})
        .text(function(d) { return d.properties.name; });

      var zoom = d3.behavior.zoom()
         .on("zoom",function() {
          g.attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")");

       });
    
      g.call(zoom);

}  

// zoom 

};
 
  $scope.map();
     
}]);