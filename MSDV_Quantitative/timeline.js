function timelineChart() {
  var _title = function (value) {
    return value;
  };
  var _date = function (value) {
    return value;
  };
  var _details = null;

  var _entryHeight = 50; // spacing between each entry
  var _entryGap = 10; // gap above the start of each entry

  var _width = 0; // default is set later

  // left & right margins of each column, including the middle line (midMargin)
  // all derived from _width - see my.width() below
 
  var _midMargin = 0;
  var _leftColMarginL = 0,
    _leftColMarginR = 0;
  var _rightColMarginL = 0,
    _rightColMarginR = 0;


  function my(selection) {
    selection.each(function (d, i) {
      // generate chart here; 'd' is the data and 'this' is the element
      // establish base SVG frame
      let artData = d;

      var svgBase = d3
        .select(this)
        .append("svg:svg")
        .attr("width", _rightColMarginR + 5)
        .attr("height", (d.length + 1.5) * _entryHeight);

      // draw mid-line - use number of events to determine length of the line
      //Lines in center
      svgBase
        .append("line")
        .attr("x1", _midMargin)
        .attr("y1", 0)
        .attr("x2", _midMargin)
        .attr("y2", (d.length + 1.5) * _entryHeight)
        .attr("stroke", "#999999")
        .attr("stroke-width", 5);

      // now bind data and draw entries
      var entryBase = svgBase.selectAll(".entry").data(d).enter().append("g");

      entryBase
        .append("circle")
        .attr("cx", _midMargin)
        .attr("cy", function (d, i) {
          return i * _entryHeight + _entryGap + 25;
        })
        .attr("r", "15")
        .attr("style", "fill: #A9E8ED; stroke:#ffffff; stroke-width:3");

      // draw box around each event, factoring in left or right column-ness

      entryBase
        .append("polygon")
        .attr("points", function (d, i) {
          console.log(artData[i].count);
          var yTop = i * _entryHeight + _entryGap;
          // polygon has notch on right or left depending on odd/even of index

          return  i % 2 == 0
            ? _leftColMarginL + //top left
                "," +
                yTop +
                " " +
                _leftColMarginR + //top right
                "," +
                yTop +
                " " +
                _leftColMarginR + //arrow top
                "," +
                (yTop + 20) +
                " " +
                (_leftColMarginR + 5) + //arrow point
                "," +
                (yTop + 25) +
                " " +
                _leftColMarginR + //arrow bottom
                "," +
                (yTop + 30) +
                " " +
                _leftColMarginR + //bottom right
                "," +
                (yTop + 85) +
                " " +
                _leftColMarginL + //bottom left
                "," +
                (yTop + 85)
            : _rightColMarginR +
                "," +
                yTop +
                " " +
                _rightColMarginL +
                "," +
                yTop +
                " " +
                _rightColMarginL +
                "," +
                (yTop + 20) +
                " " +
                (_rightColMarginL - 5) +
                "," +
                (yTop + 25) +
                " " +
                _rightColMarginL +
                "," +
                (yTop + 30) +
                " " +
                _rightColMarginL +
                "," +
                (yTop + 85) +
                " " +
                _rightColMarginR +
                "," +
                (yTop + 85);
        })
        .attr("style", "fill:black; stroke:#999999; stroke-width:2")
        .on("mouseover", function () {
          d3.select(this).style("fill", "#40E0D0").style("stroke", "#0000ff");
        })
        .on("mouseout", function () {
          d3.select(this).style("fill", "#40E0D0").style("stroke", "#999999");
        });
        
       
      
      var textBase = entryBase
        .append("text")
        // text is written in to left or right column, depending on odd/even of index

        .attr("x", function (d, i) {
          return (i % 2 == 0 ? _leftColMarginL : _rightColMarginL) + 4;
        })

        // set height & style of text block

        .attr("y", function (d, i) {
          return i * _entryHeight + _entryGap + 14;
        })
        //.attr("style", "font-size: 10px; font-family: Helvetica");

      // lay out text block - date followed by event title

      //Date on top
      textBase
        .append("tspan")
        .attr("style", "stroke-width:1; stroke:#000000; kerning:1.2")
        .text(function (d) {
          return _date(d);
        })
        .attr("style", "font-size: 6pt; font-family: sans-serif; text-align: center;")
         .on("mouseover",function(){
           d3.select(this).style("font-size","12pt").style("color", "white") 
          });
        //.style('fill', function(d) {return sequentialScale(d.artData[i].count)})
        

      // Occurance Count
      textBase
        .append("tspan")
        .attr("x", function (d, i) {
          return (i % 2 == 0 ? _leftColMarginL : _rightColMarginL) + 4;
        })
        .attr("dy", 14)
        .text(function (d) {
          return _title(d);
        });

      if (_details) {
        textBase
          .append("tspan")
          .attr("x", function (d, i) {
            return (i % 2 == 0 ? _leftColMarginL : _rightColMarginL) + 4;
          })
          .attr("dy", 20)
        //.on("mouseover", function (){
        //d3.select(this).append("text")
          //  .text(function(d) {return _details(d);});
        //});
          .text(function (d) {
            return _details(d)
          })
          .style("font-size", "20pt")
          //.attr("style","font-size:0pt")
          .on("mouseover",function(){
           d3.select(this).style("font-size","40pt").style("color","white") 
          });
      }
    });
  }

  my.width = function (value) {
    if (!arguments.length) return _width;

    _width = value;

    _midMargin = _width / 2;
    _leftColMarginR = _midMargin - 15;
    _rightColMarginL = _midMargin + 15;

    _leftColMarginL = 0;
    _rightColMarginR = _width ;

    return my;
  };

  // configuration accessors and setters

  my.entryHeight = function (value) {
    if (!arguments.length) return _entryHeight;

    _entryHeight = value;

    return my;
  };

  my.entryGap = function (value) {
    if (!arguments.length) return _entryGap;

    _entryGap = value;

    return my;
  };

  my.details = function (value) {
    if (!arguments.length) return _details;

    _details = value;
    return my;
  };

  my.title = function (value) {
    if (!arguments.length) return _title;

    _title = value;
    return my;
  };

  my.date = function (value) {
    if (!arguments.length) return _date;

    _date = value;
    return my;
  };

  my.width(1200);

  return my;
}