// using constants makes it easy to update when values change
// many editors also autocomplete variable names
// by convention, constants in JS have UPPERCASE names

const CLASS = "value";
const SORT_BY = "name";

// we can set up our state schema before we have any data
let state = {
  data: [],
  filters: {
    menu: [],
    checked: [],
  },
  dimensions: [window.innerWidth, window.innerHeight],
};

// initializing these globally will be useful later
let xScale, yScale, colorScale;

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

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

let portraitData;
let portraitArray=[];
d3.json("data.json", function(json) {
  portraitData = json;
  analyzeData();
  if (json === null) return; // parse problem, nothing to do here

  // setup data for chart
  function analyzeData() {
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
          p.images.push(n.filename);
          //p.value.push(portraitLength)
          //p.filename.push(n.filename);
          p.title.push(n.title);
          //p.date.push(n.date);
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
          title: [n.title].filter(onlyUnique),
          date: n.date.split('-')[0],
          images: [n.filename]
        });
      {portraitLength}}
    });
    //let groupByDate=d3.group(fashionArray, d => d.name);
    // sort by amount of items in the list

    portraitArray.sort((a, b) => (a.value < b.value ? 1 : -1));
  }


   portraitArray.forEach(function(p, i) {
    p.value = +p.value; // coerce into right type
  });

//console.log(portraitArray);



//console.log(portraitData.length);

//let data=portraitArray;

async function dataLoad() {
  // we can set up our layout before we have data
  initializeLayout();
  const data = await d3.json(portraitArray);

  // once data is on state, we can access it from any other function because state is a global variable
  
  // we also populate our checkboxes with values from the data
  const checkboxValues = Array.from(new Set(data.map(d => d[CLASS])));
  console.log("checkbox values", checkboxValues);
  
  // copy the data into the state variable, add a unique ID for each object and add the filters
  setState({
    data: data.map((d, i) => ({
      ...d,
      id: d[CLASS] + "_" + i, // each object should have a unique ID
    })),
    filters: {
      menu: checkboxValues,
      checked: checkboxValues,
    },
  });
}

// whenever state changes, update the state variable, then redraw the viz
function setState(nextState) {
  // using Object.assign keeps the state *immutable*
  state = Object.assign(state, nextState);
  console.log("state updated", state);
  draw();
}

function onCheckboxChange(d) {
  // first, was the clicked box already checked or not?
  const index = state.filters.checked.indexOf(d);
  console.log(d, "checked:", index);
  const isBoxChecked = index > -1;
  let nextCheckedValues;
  // if box is checked, uncheck it
  if (isBoxChecked) {
    nextCheckedValues = [
      ...state.filters.checked.slice(0, index),
      ...state.filters.checked.slice(index + 1),
    ];
    // otherwise, add it to the checked values
  } else {
    nextCheckedValues = [...state.filters.checked, d];
  }
  setState({
    filters: {
      ...state.filters,
      checked: nextCheckedValues,
    },
  });
}


// this function sets up everything we can before data loads
function initializeLayout() {
  const svgWidth = 0.6 * state.dimensions[0];
  const svgHeight = state.dimensions[1];
  const margin = 80;

  const parent = d3.select(".interactive");
  const svg = parent
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

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

  // add left menu
  const leftMenu = parent.append("div").attr("class", "left-menu");
  leftMenu.append("div").attr("class", "title").html(`
      <h1>Fisher's Iris Dataset</h1>
      <h4>Which properties of a flower best distinguish it from other species?</h4>
    `);
  leftMenu.append("div").attr("class", "filters");
}

// everything in this function depends on data, so the function is called after data loads and whenever state changes
function draw() {
  // filter data based on state.filters
  const filteredData = state.data
    .filter(d => state.filters.checked.indexOf(d[CLASS]) > -1)
    .sort((a, b) =>
      d3.descending(a[SORT_BY], b[SORT_BY])
    );

  // update our scales based on filteredData
  xScale.domain([0, d3.max(filteredData, d => d[SORT_BY])]);
  yScale.domain(filteredData.map(d => d.id));
  colorScale.domain(state.filters.menu);
  const barHeight = yScale.bandwidth();

  // update our axes based on the updated scales
  d3.select(".x-axis").call(d3.axisBottom(xScale));
  d3.select(".y-axis").call(d3.axisLeft(yScale).tickValues([]));

  // update checkbox values based on state.filters
  const checkRow = d3
    .select(".filters")
    .selectAll(".check-row")
    .data(state.filters.menu)
    .join("div")
    .attr("class", "check-row")
    .html(
      d => `
      <input name="${d}" type="checkbox" ${
        state.filters.checked.indexOf(d) > -1 ? "checked" : ""
      }></input>
      <label for="${d}">${d}</label>
    `
    );
  checkRow.select("input").on("change", onCheckboxChange);

  // update bars based on filteredData
  const barX = xScale.range()[0];
  d3.select(".bars")
    .selectAll("rect")
    .data(filteredData)
    .join("rect")
    .attr("x", barX)
    .attr("width", d => xScale(d[SORT_BY]) - barX)
    .attr("height", barHeight)
    .attr("y", d => yScale(d.id))
    .attr("fill", (d, i) => colorScale(d[CLASS]))
}

// this function is only called once
dataLoad();
});