// Reference: https://observablehq.com/@d3/selection-join

//IMPORTANT NOTE: put all graph manipulation within function call after event "page loaded" has triggered

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
let dataMaxY;

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

// Variable for drawing a line
const line = d3.line().context(null);

function clearData(){
	// Clear data array
	data = [];
	//note: not clearing line coordinates as initial values are always set/reset in generateData function call
};

function drawLine(){
	console.log("drawLine function called")
	
	let lineData = [ [xAxis(dataMinX), yAxis(dataMinY)], [xAxis(dataMaxX), yAxis(dataMaxY)] ];
	let initialLineID = "initial-line"

	//clear existing line of exists
	deleteLine(initialLineID);

	d3.select("#graph-chart").select("g")
		.append("path")
		.attr("id", initialLineID)
		.attr("d", line(lineData))
		.attr("stroke", "black");
};
  
  // Create Random Points
  // Using function f(x) = aCoef * x + random(between 0 and bCoef)
function generateData(){ 
  let numPoints = 500; // Number of data points

  clearData();
  // Adding initial min and max values for line coordinates
  dataMinX = margin;
  dataMinY = dataMinX * aCoef + randomInteger(bCoef);
  dataMaxX = dataMinX;
  dataMaxY = dataMinY;

  // Generate data set
  for (let i = 0; i < numPoints; i=i+10) {
	let xValue = i;
	let yValue = xValue * aCoef + randomInteger(bCoef);
	if(yValue >= 500 || yValue < 0){continue;};
	data.push([xAxis(xValue), yAxis(yValue)]);
	// set max X and Y values for line draw
	if(xValue > dataMaxX){
		dataMaxX = xValue;
		dataMaxY = yValue;
	};
  };
};

generateData();

function removeInitialLine(id){
	d3.select("#" + id).remove();
};

// Data dots
svg.selectAll("circle")
  .data(data).enter()
  .append("circle")
  .attr("cx", function (d) { return d[0] } )
  .attr("cy", function (d) { return d[1] } )
  .attr("r", 2)
  .attr("class", "data-point")
  .style("fill", "Black");

//STEP button event function
function deleteLine(id){
	//removeInitialLine(id);
	d3.select("#" + id).remove();
};
//STOP button event function
function buttonStop(){
	drawLine();
};
//GENERATE button event function
function buttonGenerate(){

	generateData()

	//console.log("min and max: " + dataMinX + " " + dataMinY + " " + dataMaxX + " " + dataMaxY)

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

function buttonTest(){

};

function randomInteger(maxSize){
	return Math.floor( Math.random() * maxSize );
};
const coefAelement = document.getElementById("a-coef");
const coefBelement = document.getElementById("b-coef");

function updateDataDisplay(){
	coefAelement.innerHTML = "A coeficient = " + (aCoef + parseInt(sliderBigB.value));
	coefBelement.innerHTML = "B coeficient = " + (bCoef + parseInt(sliderBigA.value));
};

//Create buttons
const btn_generate_data = document.createElement("button");
btn_generate_data.innerHTML = "Generate Data";
btn_generate_data.type = "button";
document.getElementById("button-container").appendChild(btn_generate_data).setAttribute("id", "btn-generate");

const btn_draw_line = document.createElement("button");
btn_draw_line.innerHTML = "Draw Line";
btn_draw_line.type = "button";
document.getElementById("button-container").appendChild(btn_draw_line).setAttribute("id", "btn-stop");

const btn_delete_line = document.createElement("button");
btn_delete_line.innerHTML = "Delete Line";
btn_delete_line.type = "button";
document.getElementById("button-container").appendChild(btn_delete_line).setAttribute("id", "btn-step");

const btn_test = document.createElement("button");
btn_test.innerHTML = "Test button";
btn_test.type = "button";
document.getElementById("button-container").appendChild(btn_test).setAttribute("id", "btn-test");

// Create inputs for user interaction
// Slider for A coeficient (big increments)
const inputSliderA_big = document.createElement("input");
inputSliderA_big.type = "range";
document.getElementById("user-inputs").appendChild(inputSliderA_big).setAttribute("id", "input-A-slider-big");
const sliderBigA = document.getElementById("input-A-slider-big");
sliderBigA.setAttribute("min", -100);
sliderBigA.setAttribute("max", 100);
sliderBigA.setAttribute("value", 0);

// Slider for B coeficient (big increments)
const inputSliderB_big = document.createElement("input");
inputSliderB_big.type = "range";
document.getElementById("user-inputs").appendChild(inputSliderB_big).setAttribute("id", "input-B-slider-big");
const sliderBigB = document.getElementById("input-B-slider-big");
sliderBigA.setAttribute("min", -100);
sliderBigA.setAttribute("max", 100);
sliderBigA.setAttribute("value", 0);

btn_generate_data.addEventListener("click", function(){
	buttonGenerate();
});
btn_draw_line.addEventListener("click", function(){
	buttonStop();
});
btn_delete_line.addEventListener("click", function(){
	deleteLine("initial-line");
});
btn_test.addEventListener("click", function(){
	updateDataDisplay();
});
//---------------------------------------------
sliderBigA.addEventListener("input", function(){
	updateDataDisplay();
});
sliderBigB.addEventListener("input", function(){
	updateDataDisplay();
});

updateDataDisplay();