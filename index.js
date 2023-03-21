// Reference: https://observablehq.com/@d3/selection-join

// Set Dimensions
const xSize = 500;// Chart size
const ySize = 500;// Chart size
const xAxisLabelSize = 10; // Max value on x axis
const yAxisLabelSize = 10; // Max value on y axis
const margin = 40;// axis offset from left side and bottom
const xMax = xSize - margin*2;// length of axis in pixels, to which data points should be scaled to fit
const yMax = ySize - margin*2;// length of axis in pixels, to which data points should be scaled to fit

// Elements for data display
const coefAelement = document.getElementById("a-coef");
const coefBelement = document.getElementById("b-coef");
const userCostElement = document.getElementById("user-cost");
const computedCostElement = document.getElementById("computed-cost");
// Sliders to adjust koeficients A and B
const sliderBigA = document.getElementById("input-A-slider-big");
const sliderBigB = document.getElementById("input-B-slider-big");
const sliderSmallA = document.getElementById("input-A-slider-small");
const sliderSmallB = document.getElementById("input-B-slider-small");

// Function coeficients and data array
// actual coeficiens used to generate data
let aCoefActual = randomInteger(10) / 10; 
let bCoefActual = randomInteger(ySize);
// user adjusted coeficients to try to match data
let aCoefUser = sliderBigA.value;
let bCoefUser = sliderBigB.value;
// computed coeficients using linear regression
let aCoefComputed = Math.random();
let bCoefComputed = Math.random();
// cost results for display
let userCostError = 0;
let computedCostError = 0;

let dataPointsRaw = [];// Raw data points, used to generate scaled data points and recalculate line coords
let dataPointsScaled = [];// Scaled data points for display on graph

// Min and Max X values for drawing a lines between them
// data points for computed line
let dataMinX_comp = 0;
let dataMaxX_comp = 0;
let dataMinY_comp = 0;
let dataMaxY_comp = 0;
// data points for user line
let dataMinX_user = 0;
let dataMinY_user = 0;
let dataMaxX_user = 0;
let dataMaxY_user = 0;

// Computed and user line ID's
const userLineID = 'user-line';
const compLineID = 'initial-line';

function main(){
	
	generateData();

	// Data dots
	svg.selectAll("circle")
	.data(dataPointsScaled).enter()
	.append("circle")
	.attr("cx", function (d) { return d[0] } )
	.attr("cy", function (d) { return d[1] } )
	.attr("r", 2)
	.attr("class", "data-point")
	.style("fill", "Black");
	
	console.log("page loaded")
	updateDataDisplay();
};

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
.domain([0, xAxisLabelSize]) // value indicators on axis
.range([0, xMax]);// actual pixel length to scale data points to

svg.append("g")
.attr("transform", "translate(0," + yMax + ")")
.call(d3.axisBottom(xAxis));

// Y Axis
const yAxis = d3.scaleLinear()
.domain([0, yAxisLabelSize])
.range([ yMax, 0]);

svg.append("g")
.call(d3.axisLeft(yAxis));

// Variable for drawing a line
const line = d3.line().context(null);

function clearData(){
	// Clear data array
	dataPointsRaw = [];
	dataPointsScaled = [];
	//note: not clearing line coordinates as initial values are always set/reset in generateData function call
};

// Draw a line with specified ID
function drawLine(elementID, startX, startY, endX, endY){
	//console.log("drawLine function called. Line ID: " + elementID + " and parameters: " + startX + " " + startY + " " + endX + " " + endY)
	
	//let lineData = [ [xAxis(startX), yAxis(startY)], [xAxis(endX), yAxis(endY)] ];
	let lineData = [ [startX, startY], [endX, endY] ]
	let initialLineID = elementID

	//clear existing line if exists
	deleteLine(initialLineID);

	d3.select("#graph-chart").select("g")
		.append("path")
		.attr("id", initialLineID)
		.attr("d", line(lineData))
		.attr("stroke", "black");
};

// Create Random Points
// Using function f(x) = aCoefActual * x + random noise(between 0 and bCoefActual)
function generateData(){ 
	let numPoints = 100; // Number of data points
	let xValueStep = xAxisLabelSize / numPoints; // Step size per data point, rounded to 0 decimals
	console.log("Number of points: " + numPoints + ", step size: " + xValueStep)
	
	// Generate new A koeficient
	aCoefActual = -5 * Math.random();
	bCoefActual = 10//randomInteger(yAxisLabelSize/2)

	clearData();

	// Generate data set
	/*for (let i = 0; i < numPoints; i++) {
		let xValue = i * xValueStep;
		let yValue = functionFormula(xValue, aCoefActual, bCoefActual, -1);
		if(yValue >= 500 || yValue < 0){continue;};// skip values that are outside of chart range
		dataPointsRaw.push([xValue, yValue]);
		dataPointsScaled.push([xAxis(xValue), yAxis(yValue)]);
	};*/
	// Generate data set (debug mode)
	/*for(let i = 0; i <= numPoints; i++){
		let a = 5;
		let b = 15;
		let xValue = i * xValueStep;
		let yValue = xValue * a + b;
		dataPointsRaw.push([xValue, yValue]);
		dataPointsScaled.push([xAxis(xValue), yAxis(yValue)]);
	};*/
	dataPointsRaw = dataGenerator(numPoints, aCoefActual, bCoefActual, xValueStep, true);
	for(let i = 0; i< dataPointsRaw.length; i++){
		dataPointsScaled.push( [xAxis(dataPointsRaw[i][0]), yAxis(dataPointsRaw[i][1])] );
	};
	
	//console.log(dataPointsRaw)
	
	// Adding initial min and max values for line coordinates for user to adjust
	generateUserLineData(0, xAxisLabelSize);
	
	// Adding initial min and max values for line coordinates for linear algorithm
	generateComputedLineData(50, xAxisLabelSize);
};

function generateUserLineData(minXraw, maxXraw){
	dataMinX_user = xAxis(minXraw);
	dataMinY_user = yAxis(minXraw * aCoefUser + bCoefUser);
	dataMaxX_user = xAxis(maxXraw);
	dataMaxY_user = yAxis(maxXraw * aCoefUser + bCoefUser);
};
function generateComputedLineData(minXraw, maxXraw){
	dataMinX_comp = xAxis(minXraw);
	dataMinY_comp = yAxis(minXraw * aCoefComputed + bCoefComputed);
	dataMaxX_comp = xAxis(maxXraw);
	dataMaxY_comp = yAxis(maxXraw * aCoefComputed + bCoefComputed);
};

/*function updateLineCoords(lineID, aCoef, bCoef){
	switch(lineID){
		case userLineID:
		
		break;
		case compLineID:
		
		break;
		default:
		
		break;
	};
	
};*/

function functionFormula(xVal, aCoefActual, bCoefActual, slope){
	// 1 is positive slope, -1 is negative slope, defaults to positive slope
	switch(slope){
		case -1:
		return xVal * aCoefActual + randomInteger(bCoefActual);
		break;
		case 1:
		return xVal * aCoefActual + randomInteger(bCoefActual);
		break;
		default:
		return xVal * aCoefActual + randomInteger(bCoefActual);
		break;
	};
};

function removeInitialLine(id){
	d3.select("#" + id).remove();
};

//STEP button event function
function deleteLine(id){
	//removeInitialLine(id);
	d3.select("#" + id).remove();
};
//STOP button event function
function drawLineButton(lineID){
	switch(lineID){
		case compLineID:
		generateComputedLineData(0, xAxisLabelSize);
		drawLine(lineID, dataMinX_comp, dataMinY_comp, dataMaxX_comp, dataMaxY_comp);
		break;
		case userLineID:
		drawLine(lineID, dataMinX_user, dataMinY_user, dataMaxX_user, dataMaxY_user);
		break;
		default:
		drawLine(lineID, dataMinX_comp, dataMinY_comp, dataMaxX_comp, dataMaxY_comp);
		break;
	};
};
//GENERATE button event function
function buttonGenerate(){
	generateData()
	
	// Join new data with existing data
	let dataUpdate = svg.selectAll("circle")
		.data(dataPointsScaled, d => d)
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

// random integer generator up to, but not including the parameter
function randomInteger(maxSize){
	return Math.floor( Math.random() * maxSize );
};

function updateDataDisplay(){
	aCoefUser = Math.round(parseInt(sliderBigA.value))/1000 + sliderSmallA.value/10000;
	bCoefUser = parseInt(sliderBigB.value)/10 + sliderSmallB.value/1000;
	generateUserLineData(0,xAxisLabelSize);
	drawLine(userLineID, dataMinX_user, dataMinY_user, dataMaxX_user, dataMaxY_user)
	let userCalcResults = calculateCost(aCoefUser, bCoefUser)
	coefAelement.innerHTML = "A coeficient = " + aCoefUser;
	coefBelement.innerHTML = "B coeficient = " + bCoefUser;
	userCostElement.innerHTML = "User cost: " + parseInt(userCalcResults.cost * 1000) / 1000;
	computedCostElement.innerHTML = "Computed cost: " + parseInt(computedCostError * 1000) / 1000;
};

function resetSliders(){
	console.log("Reset sliders")
	//sliderSmallA.value = 0;
	//sliderSmallB.value = 0;
};

function calculateCost(theta1, theta0){
	let cost = 0;
	let deltaErrorT0 = 0;
	let deltaErrorT1 = 0;
	//let yCalc = 0;
	for(let i = 0; i < dataPointsRaw.length; i++){
		let yPoint = dataPointsRaw[i][1];
		let yPointCalc = dataPointsRaw[i][0] * theta1 + theta0;
		let error = calculateError(yPoint, yPointCalc);
		cost = cost + error * error;
		
		deltaErrorT0 = deltaErrorT0 + error;
		deltaErrorT1 = deltaErrorT1 + error * dataPointsRaw[i][0];
		
	};
	cost = cost / (2 * dataPointsRaw.length)
	//console.log([cost, deltaErrorT0, deltaErrorT1]);
	return {'cost': cost, 'deltaErrorT0': deltaErrorT0, 'deltaErrorT1': deltaErrorT1};
};

function calculateError(yActual, yCalculated){
	return yCalculated - yActual;
};

function DEBUGcomputeThetas(){
	// y=theta1 * x + theta0
	let theta0 = Math.random();
	let theta1 = Math.random();
	let learningRate = 0.0001;
	let iterations = 30000;
	let iterationResults;
	
	// Debug new linear regression function
	let debugResults = linearRegression(dataPointsRaw, iterations, learningRate, theta0, theta1);
	iterationResults = debugResults;
	theta0 = debugResults.theta0;
	theta1 = debugResults.theta1;
	
	/*for(let i = 1; i <= iterations; i++){
		iterationResults = calculateCost(theta1, theta0);
		//console.log(iterationResults)
		
		// adjust parameters theta0 and theta1
		theta0 = theta0 - learningRate * (iterationResults.deltaErrorT0 / (2 * dataPointsRaw.length));
		theta1 = theta1 - learningRate * (iterationResults.deltaErrorT1 / (2 * dataPointsRaw.length));
	};*/
	
	aCoefComputed = theta1;
	bCoefComputed = theta0;
	computedCostError = iterationResults.cost;
	computedCostElement.innerHTML = "Computed cost: " + parseInt(computedCostError * 1000) / 1000;
	console.log("Actual: aCoef=" + aCoefActual + ", bCoef=" + bCoefActual)
	console.log("Computed: aCoef=" + theta1 + ", bCoef=" + theta0)
	
	// Debug new linear regression function
	console.log("NEW LINEAR REG")
	console.log("Computed: aCoef=" + debugResults.theta1 + ", bCoef=" + debugResults.theta0)
	console.log("Computed cost: " + debugResults.cost)
	
};
