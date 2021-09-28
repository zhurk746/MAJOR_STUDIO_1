let fashionTrends;
let fashionArray = [];
d3.json("data.json", function (json) {
  fashionTrends = json;
  analyzeData();
  if (json === null) return; // parse problem, nothing to do here

  // setup data for chart
  function analyzeData() {
    let dateNow;

    // go through the list of textiles
    fashionTrends.forEach(function (n) {
      dateNow = n.date;
      let match = false;

      fashionArray.forEach(function (p) {
        if (p.name == dateNow) {
          p.count++;
          p.title.push(n.title);
          match = true;
        }
      });
      // if not create a new entry for date range
      if (!match) {
        fashionArray.push({
          name: dateNow,
          count: 1,
          title: [n.title],
          link: n.link,
          id: n.id,
          place: n.place,
        });
      }
    });
    //let groupByDate=d3.group(fashionArray, d => d.name);
    // sort by amount of items in the list

    fashionArray.sort((a, b) => (a.count > b.count ? 1 : -1));
  }

  /*  fashionArray.forEach(function(p, i) {
    p.name = +p.name; // coerce into right type
  });*/

  fashionArray.sort(function (a, b) {
    if(a.count < 25 ){
    return a.count > b.count ? -1 : a.count < b.count ? 1 : 0;
  }});

  // instantiate the chart

  var chart = timelineChart();

  chart
    .title(function (d) {
      return d.count;
    }) // accessor for event title
    .date(function (d) {
      return d.title;
    }) // accessor for event date
    .details(function (d) {
      return d.name;
    })
   /* .on("mouseover", function(d){tooltip.text(d); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");})*/
    .width(1200); // width of chart

  // join and render

  d3.select("#chart").datum(fashionArray).call(chart);
});