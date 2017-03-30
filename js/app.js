var loadApp = function(){

//creating element variables by element Id's  
var	main = document.getElementById("main");
var	report_button = document.getElementById("report_button");
var	button_text = document.getElementById("button_text");
var	desc_text = document.getElementById("desc_text");


//Adding event listener to button
report_button.addEventListener('click', loadApi);

/******Getting array of Tiles. Retrieved from drone deploy API documentation ***********/

function getTilesFromGeometry(geometry, template, zoom){
  function long2tile(lon,zoom) {
    return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
  }
  function lat2tile(lat,zoom) {
    return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
  }
  function replaceInTemplate(point){
    return template.replace('{z}', point.z)
      .replace('{x}', point.x)
      .replace('{y}', point.y);
  }

  var allLat = geometry.map(function(point){
    return point.lat;
  });
  var allLng = geometry.map(function(point){
    return point.lng;
  });
  var minLat = Math.min.apply(null, allLat);
  var maxLat = Math.max.apply(null, allLat);
  var minLng = Math.min.apply(null, allLng);
  var maxLng = Math.max.apply(null, allLng);
  var top_tile    = lat2tile(maxLat, zoom); // eg.lat2tile(34.422, 9);
  var left_tile   = long2tile(minLng, zoom);
  var bottom_tile = lat2tile(minLat, zoom);
  var right_tile  = long2tile(maxLng, zoom);

  var tiles = [];
  for (var y = top_tile; y < bottom_tile + 1; y++) {
    for (var x = left_tile; x < right_tile + 1; x++) {
      tiles.push(replaceInTemplate({x, y, z: zoom}))
    }
  }

  return tiles;
}




/*****************************************/




//Instantiates DroneDeploy API and gets object information
function loadApi(){

	console.log("calling testApi") //log message (remove laterg)
	//instantiating dronedeploy api
	new DroneDeploy({version: 1}).then(function(api){
  	console.log('DroneDeploy Api: ', api);

  	api.Plans.getCurrentlyViewed().then(function(plan){
  		var zoom = 16;
  		console.log("plan.then", plan)
  		api.Tiles.get({planId: plan.id, layerName: 'ortho' || 'dem', zoom: zoom}).then(function(tileInformation)
  		{
  			console.log("tileInformation template", tileInformation.template);
  			const tiles = getTilesFromGeometry(plan.geometry, tileInformation.template, zoom);
  			console.log("number of tiles: ",tiles.length)
  			for (x in tiles){
  			console.log("tile ", tiles[x]);
  			api.Messaging.showToast("Downloading PDF with zoom level = " + zoom, {
                    timeout: 1000
                });
  		}
  			
  		createPDF(tiles);			
  		});
  		

  	});
  
  	api.Plans.getCurrentlyViewed().subscribe(function(plan){
  		console.log("Plan.subscribe", plan);
  	});
});

}

function createPDF(tiles)
{
	console.log(" in saving pdf", tiles)
	
	const toDataURL = tiles => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }))

  
    console.log(fromResolve)

  	/* var request = new XMLHttpRequest();
      request.open('GET', tiles, true);
      request.onreadystatechange = function() {
        // Makes sure the document is ready to parse.
        if(request.readyState == 4) {
          // Makes sure it's found the file.
          if(request.status == 200) {
            savePDF(request.responseText);
          }
        }
      };
      request.send(null);*/

}

function savePDF(dataURL)
{
	console.log("in save PDF", dataURL)
	
	var doc = new jsPDF('p');
	doc.addImage(dataURL, "PNG", 15, 40, 180, 160);
  	doc.save("test.pdf");

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

