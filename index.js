// Reference: https://observablehq.com/@d3/selection-join

//----------------CHART TEST
// Set Dimensions
const xSize = 500;
const ySize = 500;
const margin = 40;
const xMax = xSize - margin*2;
const yMax = ySize - margin*2;

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

// Create Random Points
// Using function f(x) = a * x + b

const numPoints = 500;
const data = [];
for (let i = 0; i < numPoints; i++) {
	let aCoef = -0.5;
	let bCoef = 200;
	let xValue = i;
	let yValue = xValue * aCoef + bCoef;
  data.push([xValue, yMax - margin - yValue]);
}

// Append SVG Object to the Page
d3.select("#graph-chart")
  .append("svg")
  .attr("style", "width:" + xSize + ";height:" + ySize)
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
const x = d3.scaleLinear()
  .domain([0, 500])
  .range([0, xMax]);

svg.append("g")
  .attr("transform", "translate(0," + yMax + ")")
  .call(d3.axisBottom(x));

// Y Axis
const y = d3.scaleLinear()
  .domain([0, 500])
  .range([ yMax, 0]);

svg.append("g")
  .call(d3.axisLeft(y));

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
	const numPoints = 50;
	const newData = [];
	for (let i = 0; i < numPoints; i++) {
	  newData.push([parseInt(Math.random() * xMax), parseInt(Math.random() * yMax)]);
	};
	
	// Join new data with existing data
	var dataUpdate = svg.selectAll("circle")
		.data(newData, d => d)
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

//generate data for machine learning
function generateData(){
	console.log("Generating data");
	let newDataSet = [];
	let bias = 100;
	let koef = 10;
	let initialX = 1;
	let xStepSize = 1.5;
	
	for(let i = 0; i < 20; i++){
		let singleTuple = []
		newDataSet.push([i, koef * (initialX + xStepSize * i) + randomInteger(bias)]);
	};
	console.log(newDataSet);
};

//generateData();//generate new data

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
