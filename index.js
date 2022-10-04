// Reference: https://observablehq.com/@d3/selection-join

//----------------CHART TEST
// Set Dimensions
const xSize = 500;
const ySize = 500;
const margin = 40;
const xMax = xSize - margin*2;
const yMax = ySize - margin*2;

// Function coeficients and data array
let aCoef = 1;
let bCoef = margin;
let data = [];
// Min and Max X values for drawing a line between them
let dataMinX;
let dataMaxX;
let dataMinY;
let DataMaxY;
// DEBUG DATA VARIABLES

let initialTestData = [
	[10,20],
	[30,40],
	[50,60],
	[70,80],
	[90,100],
	[100,110]
];
let updateTestData = [
	[20,20],
	[60,40],
	[100,60],
	[70,80],
	[90,100]
];

// Append SVG Object to the Page
d3.select("#graph-chart")
.append("svg")
.attr("style", "width:" + xSize + "px;height:" + ySize + "px")
.append("g")
.attr("transform","translate(" + margin + "," + margin + ")");

// Store SVG selection to variable for convenient use
const svg = d3.select("#graph-chart")
.select("svg")
.select("g");

//test data
/*svg.selectAll("text")
.data(["vienas","du"])
.enter()
.append("text")
.attr("x", (d,i)=>{return i*60;})
.attr("y", (d,i)=>{return i*1.5 + "em";})
.text(function(d){return d;});*/

// X Axis
const xAxis = d3.scaleLinear()
.domain([0, 500])
.range([0, xMax]);

svg.append("g")
.attr("transform", "translate(0," + yMax + ")")
.call(d3.axisBottom(xAxis));

// Y Axis
const yAxis = d3.scaleLinear()
  .domain([0, 500])
  .range([ yMax, 0]);

svg.append("g")
  .call(d3.axisLeft(yAxis));

  function clearData(){
	  // Clear data array
	  data = [];
  };
  
  // Create Random Points
  // Using function f(x) = a * x + b
function generateData(){ 
  let numPoints = 500 - margin;

  clearData();
  // Adding initial min and max values for line to draw
  dataMinX = margin;
  dataMinY = dataMinX * aCoef + randomInteger(bCoef);
  dataMaxX = dataMinX;
  DataMaxY = dataMinY;

  // Generate data set
  for (let i = margin; i < numPoints; i=i+10) {
	let xValue = i;
	let yValue = xValue * aCoef + randomInteger(bCoef);
	if(yValue >= 500){continue;};
	data.push([xAxis(xValue), yAxis(yValue)]);
	// set max X and Y values for line draw
	if(xValue > dataMaxX){
		dataMaxX = xValue;
		DataMaxY = yValue;
	};
  };
};

generateData();

// Data dots
svg.selectAll("circle")
  .data(data).enter()
  .append("circle")
  .attr("cx", function (d) { return d[0] } )
  .attr("cy", function (d) { return d[1] } )
  .attr("r", 2)
  .attr("class", "data-point")
  .style("fill", "Black");
	
  
//----------------CHART TEST END


//Create buttons
const btn_generate_data = document.createElement("button");
btn_generate_data.innerHTML = "Generate Data";
btn_generate_data.type = "button";
document.getElementById("button-container").appendChild(btn_generate_data).setAttribute("id", "btn-generate");

const btn_stop = document.createElement("button");
btn_stop.innerHTML = "Stop";
btn_stop.type = "button";
document.getElementById("button-container").appendChild(btn_stop).setAttribute("id", "btn-stop");

const btn_step = document.createElement("button");
btn_step.innerHTML = "Step";
btn_step.type = "button";
document.getElementById("button-container").appendChild(btn_step).setAttribute("id", "btn-step");

const btn_test = document.createElement("button");
btn_test.innerHTML = "Test button";
btn_test.type = "button";
document.getElementById("button-container").appendChild(btn_test).setAttribute("id", "btn-test");

//STEP button event function
function buttonStep(){
	
};
//STOP button event function
function buttonStop(){
	
};
//GENERATE button event function
function buttonGenerate(){
	
	// Generate new data points
	/*
	let numPoints = 50;
	let newData = [];
	for (let i = 0; i < numPoints; i++) {
	  newData.push([parseInt(Math.random() * xMax), parseInt(Math.random() * yMax)]);
	};
	*/
	generateData()

	// Join new data with existing data
	var dataUpdate = svg.selectAll("circle")
		.data(data, d => d)
		.join(
			enter => {
				// Tasks for every new element
				enter.append("circle")
					.attr("fill", "Red")
					.attr("cx", function (d) { return d[0] } )
					.attr("cy", function (d) { return d[1] } )
					.attr("r", 2)
					.attr("class", "data-point");
			},
			update => {
				// Tasks for every existing element
				update.attr("fill", "Black");
			},
			exit => {
				// Tasks for every existing element that was not in new dataset as well
				exit.remove();
			}
		);
};

function randomInteger(maxSize){
	return Math.floor( Math.random() * maxSize );
};

btn_generate_data.addEventListener("click", function(){
	buttonGenerate();
});
btn_stop.addEventListener("click", function(){
	buttonStop();
});
btn_step.addEventListener("click", function(){
	buttonStep();
});
