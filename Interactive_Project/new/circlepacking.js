// using constants makes it easy to update when values change
// many editors also autocomplete variable names
// by convention, constants in JS have UPPERCASE names

const CLASS = "class";
const RADIO_1 = "Unique Names";
const RADIO_10 = "Less Common Names <br> (appearing 2-20 times)";
const RADIO_20 = "Common Names <br> (appearing 21-50 times)";
const RADIO_50 = "Popular Names <br> (appearing over 50 times)";
const RADIO_ALL = "All Names in Dataset";
const TOOLTIP_WIDTH = 150;
const TOOLTIP_HEIGHT = 20;

const svgWidth = 1250;
const svgHeight = 1250;
const margin = 100;

const parent = d3.select(".interactive");

var txtName = 0;

      
var imageIndex = {};

// we can set up our state schema before we have any data
let state = {
  originalData: [],
  displayData: [],
  sizeBy: {
    menu: [RADIO_ALL, RADIO_50, RADIO_20, RADIO_10, RADIO_1],
    selected: RADIO_ALL,
  },
};

let pattern = null;

// whenever state changes, update the state variable, then redraw the viz
function setState(nextState) {
  // console.log("state updated");
  // using Object.assign keeps the state *immutable*
  state = Object.assign({}, state, nextState);
  draw();
}

function onRadioChange() {
  const nextSelected = d3.event.target.value;
  setState({
    sizeBy: {
      ...state.sizeBy,
      selected: nextSelected,
    },
    displayData: scrubData(nextSelected, JSON.parse(JSON.stringify(state.originalData)))
  });
}

// this function sets up everything we can before data loads
function initializeLayout() {
  const svg = parent
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
  clearSvg();
  
  // add left menu
  const leftMenu = parent.append("div").attr("class", "left-menu").style("width", "300px");
  leftMenu.append("div").attr("class", "title").html(`
      <h1>What’s in a Name?</h1>
      <h4>An exploration of the first names of the individuals portrayed at the Smithsonian National Portrait Gallery in New York.</h4>
      
      <br> <p>Click each circle in the diagram to explore the collection of portraits with each first name.</p>
    `);
    
  leftMenu
    .append("form")
    .html(
      state.sizeBy.menu
        .map(
          d =>
            `<input type="radio" name="sizeby" value="${d}" ${
              state.sizeBy.selected === d ? "checked" : ""
            }>${d}<br>`
        )
        .join("")
    )
    .on("change", onRadioChange);
    
  leftMenu.
    append("br").
    append("br");
    
    leftMenu.
    append("div")
      .attr("id", "imgTitle")
      .attr("height", "200")
      .attr("width", "200");
  
      leftMenu.
    append("div")
      .attr("id", "birthdate")
      .attr("height", "200")
      .attr("width", "200");
      
  leftMenu.
    append("br").
    append("br");
    
  leftMenu.
    append("img")
      .attr("id", "imgsrc")
      .attr("height", "300")
      .attr("width", "300");
      
  leftMenu.append("div").attr("class", "title").html(`<p> Keep clicking the circle for more! </p>`);    
}

function clearSvg() {
  
  const svg = d3.select("svg");
  
  // remember, we initialized these variables at the top
  xScale = d3.scaleLinear().range([margin, svgWidth - margin]);
  yScale = d3
    .scaleBand()
    .paddingInner(0.1)
    .range([margin, svgHeight - margin]);
  colorScale = d3.scaleOrdinal(d3.schemeDark2);

  // add x axis
  svg
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${svgHeight - margin})`);

  // add y axis
  svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin}, 0)`);

  svg.append("g").attr("class", "bars");
}

function dataLoad() {
  initializeLayout();
      
  var badNamesLowercase = [
    'c',    
    't',
    'r',
    'h',
    'd',
    '',
    'e',
    'f',
    'us',
    'j',
    'unidentifed',
    'unidentified',
    'b',
    'w',
    'm',
    'a',
    'spotted'
  ];
  
  var badTitlesLowerCase=['strattons, g.w.m. nutt, and minnie warren',
  'strattons, g.w.m. nutt, and minnie warren (wedding party)'];
  
  let portraitData;
  let portraitArray=[];
  
  // read json data
  d3.json("data.json", function(json) {
    portraitData = json;
  
    let titleNow;
    let portraitLength;
    let titlePortrait;
  
    // go through the list of textiles
    portraitData.forEach(function (n) {
      portraitLength=portraitData.length;
      titleNow = n.portrait;
      titlePortrait=n.title;
      let firstName=titleNow.split(' ')[0];
      //let firstName=newName[0];
       // Remove punctuation and leading/trailing spaces:
      firstName = firstName.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
      
      n.date = n.date.split('-')[0].replace('c. ', '');
    
      // Skip any bad values we defined above.
      if (badNamesLowercase.indexOf(firstName.toLowerCase()) > -1) {
        return;
      }
      
      if (badTitlesLowerCase.indexOf(titlePortrait.toLowerCase()) > -1) {
        return;
      }
        
      let match = false;
      
      portraitArray.forEach(function (p) {
        //parent: portraitLength;
        if (p.name == firstName) {
          p.value++;
          //p.images.push(n.filename);
          //p.value.push(portraitLength)
          //p.filename.push(n.filename);
          //p.title.push(n.title);
          //p.date.push(n.date);
          p.collection.push({title: n.title, date: n.date, images: n.primaryImage});
          match = true;
          //portraitLength;
        }
      });
        
      //count needs to go go into children call images children
      // if not create a new entry for date range
      if (!match) {
        //let dateNow;
        //dateNow=n.date.split(' ')[1]
        //console.log(dateNow)
        portraitArray.push(
          {
          //value: [portraitLength],
          name: firstName,
          value: 1,
          //title: n.title,
          //link: n.link,
          //id: n.objectID,
          place: n.place,
          //title: [n.title],
          //date: [n.date],
          collection: [{title: n.title, date: n.date, images: n.primaryImage}]
          //images: [n.filename]
        });
      {portraitLength}}
    });
    //let groupByDate=d3.group(fashionArray, d => d.name);
    // sort by amount of items in the list
  
    let data=portraitArray;
    
    // Give the data to this cluster layout:
    //data=data.slice(0,20);
    
    data={'name': 'New York', 'children': data };
    console.log(data);
    
    // copy the data into the state variable, add a unique ID for each object and add the filters
    setState({
      originalData: data,
      displayData: scrubData(RADIO_ALL, JSON.parse(JSON.stringify(data)))
    });
  });
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function draw() {
  imageIndex = {};
  
  clearSvg();
  
  var svg = d3.select("svg");
  svg.html('');
  
  var margin = 50,
      diameter = +svg.attr("width"),
      g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
  
  var color = d3.scaleLinear()
      .domain([-1, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);
  
  var pack = d3.pack()
      .size([diameter - margin, diameter - margin])
      .padding(1);
      
  root = d3.hierarchy(state.displayData)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.date - a.date; });

  var focus = root,
      nodes = pack(root).descendants(),
      view;
  
  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) {return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .attr("id", function(d) { return d.data.name; })
      .style('fill', function (d) { return d.parent ? d.children ? "black" : "#D3D3D3" : "black"; })
      .style("fill", function(d) {
              if (d.data.name == txtName.value) {
                return "#0096FF"
              } else {
                return d.parent ? d.children ? "black" : "#D3D3D3" : "black";
              }
            });
      
  
  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .attr("id", function(d) { return 'Label' + d.data.name; })
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .text(function(d) { 
        if (d.data.value===1) {return d.data.value + ` ` + d.data.name} 
        else {
        if (d.data.name.substr(-1)==='s') {return d.data.value + ` ` + d.data.name + `es`}
        else {return d.data.value + ` ` + d.data.name + `s`}} });
        
        
      //.text(function(d) { return d.data.value; });

  var node = g.selectAll("circle,text");

  //svg.style("background", color("black"));

  zoomTo(node, circle, diameter, [root.x, root.y, root.r * 2 + margin]);
  
      
  state.displayData['children'].forEach(function (c) {
    let clickFunc = function () {
      let image = document.getElementById("imgsrc");
      if (!imageIndex.hasOwnProperty(c.name)) {
        imageIndex[c.name] = 0;
      } else {
        imageIndex[c.name]++;
        if (imageIndex[c.name] >= c.collection.length) {
          imageIndex[c.name] = 0;
        }
      }
      image.src = c.collection[imageIndex[c.name]].images;
      
      let imgTitle = document.getElementById("imgTitle");
      imgTitle.innerHTML = c.collection[imageIndex[c.name]].title;
    
    
      let birthdate = document.getElementById("birthdate");
      birthdate.innerHTML = c.collection[imageIndex[c.name]].date;
      
    };
    
    let element = document.getElementById(c.name);
    element.onclick = clickFunc;
    
    element = document.getElementById('Label' + c.name);
    element.onclick = clickFunc;
  });
  
}

function zoomTo(node, circle, diameter, v) {
  var k = diameter / v[2];
  view = v;
  node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
  circle.attr("r", function(d) { return d.r * k; });
}

function scrubData(sizeBy, data) {
  let newData = data;
  
  if (sizeBy == RADIO_ALL) {
    newData['children'].sort((a, b) => (a.value < b.value ? 1 : -1));
  } else {
    let valueUpper = 200;
    let valueLower= 1;
    switch (sizeBy) {
      case RADIO_1:
        valueLower = 1;
        valueUpper = 1;
        break;
      case RADIO_10:
        valueLower = 2;
        valueUpper = 20;
        break;
      case RADIO_20:
        valueLower=21;
        valueUpper = 50;
        break;
      case RADIO_50:
        valueLower=51;
        valueUpper = 200;
        break;
    }
  
    //console.log('Threshold: ' + valueThreshold.toString());
  
    let newChildren = [];
    newData['children'].forEach(function (c) {
      if (c.value >= valueLower && c.value <= valueUpper) {
        newChildren.push(c);
      }
    });
    
    newData['children'] = newChildren;
  }
  
  return newData; 
}
    
// this function is only called once
dataLoad();
    function sayHi() {
      txtName = document.getElementById("txtName");
      draw();
      console.log(txtName.value);
    }