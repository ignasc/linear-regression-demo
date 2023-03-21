/*
Linear Regression using gradient descent to fit linear data using the following formula:
f(x) = T1 * x + T0
T1 - theta1, the slope of the function
T0 - theta0, the y axis intercept point

Input parameters in that order:
- full data set
- number of iterations
- initial theta0 (bias) - optional, random number between 0 and 1 as default
- initial theta1 (slope or x multiplier) - optional, random number between 0 and 1 as default
*/

function linearRegression(dataSet, iterations, learnRate, initialTheta0 = Math.random(), initialTheta1 = Math.random()){
	// Formula f(x) = theta1 * x + theta0
	let theta0 = initialTheta0;
	let theta1 = initialTheta1;
	let previousCost = 0;
	let cost = 0;
	let iterationsComplete = 0;
	
	//let standardizedData = linearRegressionStandardData(dataSet);
	
	let batchSize = parseInt(dataSet.length / 3); // roughly 1/3 of the whole trainingData.
	
	console.log("---------------INITIAL PARAMETERS---------------")
	console.log("trainingData length: " + batchSize.length)
	console.log("Theta0 = " + theta0)
	console.log("Theta1 = " + theta1)
	console.log("Learning Rate = " + learnRate)
	console.log("Number of iterations: " + iterations)
	console.log("---------------RUNNING LINEAR REGRESSION---------------")
	
	/*
	Main formula for cost: 1/(2*trainingDataLength) * sum( (yComputed - yActual)^2 )
	Main formula for theta0: theta0 - alpha /(2*trainingDataLength) * sum( yComputed - yActual )
	Main formula for theta0: theta1 - alpha /(2*trainingDataLength) * sum( (yComputed - yActual) * xi )
	*/
	
	// Main loop to run through set number of iterations
	for(let i = 0; i < iterations; i++){
		//let trainingData = linearRegressionGenerateBatch(batchSize, standardizedData);
		let trainingData = linearRegressionGenerateBatch(batchSize, dataSet);
		trainingData.sort((a, b)=>{return Math.random() - 0.5;});
		//let validationData = linearRegressionGenerateBatch(batchSize, trainingData);
		previousCost = cost;
		cost = 0;
		let deltaTheta0 = 0;
		let deltaTheta1 = 0;
		let deltaError = 0;
		
		// Loop to run through training trainingData and calculate the error, once per iteration
		for(let j = 0; j < trainingData.length; j++){
			// Calculate error between trainingData y value and calculated y value
			let error = trainingData[j][0] * theta1 + theta0 - trainingData[j][1];
			
			// Add up calculated error for cost calculation
			deltaError = deltaError + error * error;
			
			// Calculate theta0 and theta1 adjustment values
			deltaTheta0 = deltaTheta0 + error;
			deltaTheta1 = deltaTheta1 + error * trainingData[j][0];
			
		};
		
		iterationsComplete += 1;
		
		theta0 = theta0 - ((1 * deltaTheta0) / (trainingData.length));
		theta1 = theta1 - ((learnRate * deltaTheta1) / (trainingData.length));
		cost = deltaError / (2 * trainingData.length)
		//console.log("Iteration " + i + ": Cost= " + cost + ", Theta0= " + theta0 + ", Theta1= " + theta1 + ", delta T0 and T1: " + -((learnRate * deltaTheta0) / (trainingData.length)) + " " + -((learnRate * deltaTheta1) / (trainingData.length)))
		
		// Stop early if cost function is low and does not change much.
		if(previousCost - cost < 0.001 && cost <= 0.001){
			break;
		};
	};
	
	console.log("---------------RESULTS---------------")
	console.log("Iterations done: " + iterationsComplete)
	console.log("Learning rate: " + learnRate)
	console.log("Cost: " + cost)
	console.log("Theta0 = " + theta0)
	console.log("Theta1 = " + theta1)
	
	return {
		"cost": cost,
		"theta0": theta0,
		"theta1": theta1,
		"iterationsComplete": iterationsComplete
	};
};

// random integer generator up to, but not including the parameter
function linearRegressionRandomInteger(maxSize){
	return Math.floor( Math.random() * maxSize );
};
// Take a small batch from trainingData to use as training or validation
function linearRegressionGenerateBatch(batchSize, trainingData){
	let miniBatch = [];
	for(let i = 0; i < batchSize; i++){
		miniBatch.push(trainingData[linearRegressionRandomInteger(trainingData.length)])// Picks random elements from trainingData
	};
	return miniBatch;
};
// Data standardization
function linearRegressionStandardData(trainingData){
	let xMin = trainingData[0][0];
	let xMax = trainingData[0][0];
	let mean = 0;
	let scaledDataArray = [];
	for(let i = 0; i < trainingData.length; i++){
		if(trainingData[i][0] < xMin){
			xMin = trainingData[i][0];
		};
		if(trainingData[i][0] > xMax){
			xMax = trainingData[i][0];
		};
		mean += trainingData[i][0];
	};
	mean = mean / trainingData.length;
	let range = xMax - xMin;
	
	for(let i = 0; i < trainingData.length; i++){
		scaledDataArray.push( [(trainingData[i][0] - mean) / range, trainingData[i][1] ] );
	};
	return scaledDataArray;
};