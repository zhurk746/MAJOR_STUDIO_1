let fashionTrends;
let fashionArray=[]
d3.json("data.json", function(json) {
fashionTrends=json;
analyzeData();
	if (json === null) return; // parse problem, nothing to do here

	// setup data for chart
	
	function analyzeData(){
  let dateNow;

  // go through the list of textiles
  fashionTrends.forEach(function(n) {
    dateNow = n.date;
    
    let match = false;

    // see if their location already exists the allplaces array
    fashionArray.forEach(function(p){
      if(p.name==dateNow){
        p.count++;
        match=true;
      }
    });
    // if not create a new entry for that place name
      if(!match){
        fashionArray.push({
          name: dateNow,
          count:1,
          title: n.title,
    		link: n.link,
    		id: n.id,
    		place: n.place
          
        });
      }
  });
  
  //let groupByDate=d3.group(fashionArray, d => d.name);
  // sort by amount of items in the list
  
  fashionArray.sort((a, b) => (a.count > b.count) ? 1 : -1)
  console.log(fashionArray);
	}

/*	fashionArray.forEach(function(p, i) {
		p.name = +p.name; // coerce into right type
	});*/

	fashionArray.sort(function(a,b) { return a.count > b.count ? -1 : a.count < b.count ? 1 : 0; });

	// instantiate the chart

	var chart = timelineChart(); 
	
	chart.title(function(d) { return d.count; })	// accessor for event title
		 .date(function(d) { return d.name; })	// accessor for event date
		 .details(function(d) { return d.title; })
		 .width(600);							// width of chart

	// join and render

	d3.select("#chart").datum(fashionArray).call(chart);
});

