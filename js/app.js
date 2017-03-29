var loadApp = function(){

//creating element variables by element Id's
var	main = document.getElementById("main");
var	report_button = document.getElementById("report_button");
var	button_text = document.getElementById("button_text");
var	desc_text = document.getElementById("desc_text");


//Adding event listener to button
report_button.addEventListener('click', loadApi);

//Instantiates DroneDeploy API and gets object information
function loadApi(){

	console.log("calling testApi") //log message (remove later)

	//instantiating dronedeploy api
	new DroneDeploy({version: 1}).then(function(api){
  	console.log('DroneDeploy Api: ', api);

  	api.Plans.getCurrentlyViewed().then(function(plan){
  		console.log("Plan.then id", plan.id);
  		printPlan(plan);

  	});
  	console.log("printing plan outside method call", JSON.stringify(tempPlan))
  	api.Plans.getCurrentlyViewed().subscribe(function(plan){
  		console.log("Plan.subscribe", plan);
  	});
});


}


//Test method to check resolve call from promise (remove later)
function printPlan(plan)
{   
	console.log("in print plan",JSON.stringify(plan))
}
	

}


document.addEventListener('DOMContentLoaded', function() {
    loadApp();

});

