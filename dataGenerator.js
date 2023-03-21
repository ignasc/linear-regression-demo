// To do in the future:
// Add an option to toggle random noise
function dataGenerator(numOfDataPoints = 20, theta1 = 1, theta0 = 1, stepSize = 1, addNoise = true){
	let dataArray = [];
	let noiseSize = 0;
	// Generate an array, where each element is an array [x,y]
	console.log("Generating data based on function f(x)=" + theta1 + "*x+(" + theta0 + "), # of data points = " + numOfDataPoints + ", step size = " + stepSize)
	for(let i = 0; i < numOfDataPoints; i++){
		let xValue = i * stepSize;
		let yValue = theta1 * xValue + theta0;
		noiseSize += yValue;
		dataArray.push([ xValue, yValue  ]);
	};
	
	// Generate noise to each y value
	if(addNoise){
		noiseSize = noiseSize / (dataArray.length * 2);
		console.log("Noise size: " + noiseSize)
		// Loop through data array and add a noise
		for(let i = 0; i < dataArray.length; i++){
			dataArray[i][1] = dataArray[i][1] + noiseSize * Math.random() * ( Math.random() < 0.5 ? (-1) : 1 );
		};
		
	};
	
	return dataArray;
};