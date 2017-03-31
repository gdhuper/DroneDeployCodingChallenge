# DroneDeploy Coding Challenge
  ---
Option-2:
***

Create an app for the DroneDeploy platform. The app should provide a button on the data page that will create a PDF of the map shown. For example:

[Screenshot](https://www.dropbox.com/s/af50irnf2mrzhua/Screenshot%202016-12-09%2014.44.51.png?dl=0)

When the button is clicked it should download a PDF that contains an image of the map being view. 
See <http://developer.dronedeploy.com>, in particular how to access “Tiles”.


___
### How I approached this problem? 
1. Read the question as many times as possible to make sure I get it right
2. Read through API documentation (specifically for Tiles)
3. Followed tutorials and started writing code by creating a simple HTML page for calling and testing DroneDeploy API's
  ```javascript
   new DroneDeploy({ version: 1 }).then(function(api) {
          //use api here to call other api's
         });
  ```
  
 4. Called 'Tiles' api to get the tiles currently viewed and created an array out of it.
   ```javascript
   dronedeployApi.Tiles.get({planId, layerName, zoom})
  .then(function(tileInformation){ console.log(tileInformation) });
   ```
  ### Problems I ran into:
  
  1. Trouble getting proxy values from Promise callback functions.
  2. CORS: setup a PHP heroku server to convert tiles (from url's) to dataURL and send the data back to client side for saving
  images as PDF using jsPDF.js
  ---
###### This was a really fun project to work on and it pushed me to learn some new set of skills in a short amount of time.
######  I got to learn more about Dronedeploy app platform and I realized how the power of API's can be harnessed to create apps to suit one's needs

![alt text](https://github.com/gdhuper/DroneDeployCodingChallenge/blob/master/img/workingshot.png "working screenshot")


