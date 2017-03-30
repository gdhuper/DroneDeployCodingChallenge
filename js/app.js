var loadApp = function() {

    //creating element variables by element Id's  
    var main = document.getElementById("main");
    var report_button = document.getElementById("report_button");
    var button_text = document.getElementById("button_text");
    var desc_text = document.getElementById("desc_text");


    //Adding event listener to button
    report_button.addEventListener('click', loadApi);

    /******Getting array of Tiles - Retrieved from: https://dronedeploy.gitbooks.io/dronedeploy-apps/content/tiles/example-tiles-as-array.html ***********/

    function getTilesFromGeometry(geometry, template, zoom) {
        function long2tile(lon, zoom) {
            return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
        }

        function lat2tile(lat, zoom) {
            return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
        }

        function replaceInTemplate(point) {
            return template.replace('{z}', point.z)
                .replace('{x}', point.x)
                .replace('{y}', point.y);
        }

        var allLat = geometry.map(function(point) {
            return point.lat;
        });
        var allLng = geometry.map(function(point) {
            return point.lng;
        });
        var minLat = Math.min.apply(null, allLat);
        var maxLat = Math.max.apply(null, allLat);
        var minLng = Math.min.apply(null, allLng);
        var maxLng = Math.max.apply(null, allLng);
        var top_tile = lat2tile(maxLat, zoom); 
        var left_tile = long2tile(minLng, zoom);
        var bottom_tile = lat2tile(minLat, zoom);
        var right_tile = long2tile(maxLng, zoom);

        var tiles = [];
        //Replacing x,y, and z with their values from tiles
        for (var y = top_tile; y < bottom_tile + 1; y++) {
            for (var x = left_tile; x < right_tile + 1; x++) {
                tiles.push(replaceInTemplate({
                    x,
                    y,
                    z: zoom
                }))
            }
        }

        return tiles;
    }

    /*****************************************/


    /*
    * Instantiate DroneDeploy API and gets tile information
    */ 
    function loadApi() {

        console.log("calling testApi") //log message (remove laterg)
        //instantiating dronedeploy api
        new DroneDeploy({ version: 1 }).then(function(api) {
         
         	//calling api for getting plan of current view
            api.Plans.getCurrentlyViewed().then(function(plan) {
                var zoom = 16;
                
                //calling api to get Tiles using current plan id, layerName and zoom level.
                api.Tiles.get({ planId: plan.id, layerName: 'ortho' || 'dem', zoom: zoom }).then(function(tileInformation) {
                   	
                    const tiles = getTilesFromGeometry(plan.geometry, tileInformation.template, zoom); //array of tiles
                    console.log("number of tiles: ", tiles.length); //for debugging
                        //creating toast when downloading pdf
                        api.Messaging.showToast("Downloading PDF with zoom level = " + zoom, {
                            timeout: 1100
                        });
                    

                    	sendDataToServer(tiles);
                });


            });

            api.Plans.getCurrentlyViewed().subscribe(function(plan) {
                console.log("Plan.subscribe", plan);
            });
        });

    }

  /*
   * Sends tile url data to heroku server and gets back UrlData for saving as PDF
   */
    function sendDataToServer(tiles) {
    console.log("sending data to server", tiles); //Remove later

    //send tiles urls to heroku server and receives data URL of each image url from server
    jQuery.ajax({
        type: "POST",
        url: "https://limitless-crag-83270.herokuapp.com/index.php", 
        data: {
            "tiles": tiles
        },
        success: function(dataURL) {

            savePDF(dataURL); //call for saving map view

        }
    })

}


/*
 * instantiates jsPDF and saves the map images
 */
function savePDF(dataURL) {
	var i = new Image(); 

	i.onload = function(){
 	alert( i.width+", "+i.height );
	};

	i.src = dataURL;


    var doc = new jsPDF('p', 'mm');
    doc.text("Construction site test", 5, 5);

    doc.addImage(dataURL, "PNG", 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height );
    try {
        doc.save("test.pdf");
        console.log("pdf saved")
    	} 
    catch (err) {
        console.log("pdf not saved!");
        alert("not saved");
    			  }	


	}	

}


//Loads the app on startup
document.addEventListener('DOMContentLoaded', function() {
    loadApp();

});