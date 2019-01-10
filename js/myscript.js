var flist = new Array();
var localStore = "A3IM-";
var studentData;
function Forecast(fcode, fdate, fday, fhigh, flow, ftext){
   this.fcode = fcode;
   this.fdate = fdate;
   this.fday = fday;
   this.fhigh = fhigh;
   this.flow = flow;
   this.ftext = ftext;
}

$(document).on("pagecreate", "#homePage", function(){
   $.getJSON("a3_Weather.json", function(data){
      console.log(data);
      // Loop through forecast and create Forecast objects
      var start = data.query.results.channel.item.forecast;
		for (let x = 0; x < start.length; x++){
			newForecast = new Forecast(
				start[x].code,
				start[x].date,
				start[x].day,
				start[x].high,
				start[x].low,
				start[x].text
			);
			// Add object to flist array
			flist.push(newForecast);
		}
      console.log(flist);

      // Get info from json file and append to header
      studentData = data.query.results.channel.MyData;
      console.log(studentData);
      $("#homeHeader").append(`
         ${studentData.studentName}</br>
         ${data.query.results.channel.item.A3_description}`);


      // Fill mainContent
      var weatherData = data.query.results.channel;
      $("#mainContent").html(`
         City: ${weatherData.location.city} </br>
         Country: ${weatherData.location.country}</br>
         Region: ${weatherData.location.region} </br>
         Latitude: ${weatherData.item.lat} </br>
         Longitude: ${weatherData.item.long} </br>
         <img src='images/${studentData.weatherImg}' width=150px>
      `);

      // Create icons and links for homepage footer
      makeLink(studentData.aboutIcon, '#aboutMe', 'About Me', 'a');
      makeLink(studentData.otherIcon, 'https://www.reddit.com', 'Reddit', 'b');
      $("a[href='#aboutMe']").attr("data-rel", "dialog");
      $("a[href='https://www.reddit.com']").attr("target", "_blank");

      // Fill panelWeather
      $("#weatherTable").html(`
         <h3>Wind Conditions:</h3>
         Chill: ${weatherData.wind.chill}&deg;F</br>
         Direction: ${weatherData.wind.direction}</br>
         Speed: ${weatherData.wind.speed}</br>
         <h3>Atmospheric Conditions:</h3>
         Humidity: ${weatherData.atmosphere.humidity}%</br>
         Pressure: ${weatherData.atmosphere.pressure}</br>
         Rising: ${weatherData.atmosphere.rising}</br>
         Visibility: ${weatherData.atmosphere.visibility}</br>
         <h3>Astronomy:</h3>
         Sunrise: ${weatherData.astronomy.sunrise}</br>
         Sunset: ${weatherData.astronomy.sunset}
      `);

      // Fill Forecast page
      for (let i = 0; i < flist.length; i++){
         $("#forecastList").append(
   		`<section data-role='collapsible'>
   			<h3 class='ui-btn ui-icon-calendar ui-btn-icon-left'>
   			${flist[i].fdate}</h3>
   			<p>
   				<table>
   					<tr><th>Day:</th>
   					<td>${flist[i].fday}</td>
   					</tr>
   					<tr><th>High:</th>
   						<td>${flist[i].fhigh}&deg;F</td>
   					</tr>
   					<tr><th>Low:</th>
   						<td>${flist[i].flow}&deg;F</td>
   					</tr>
                  <tr><th>Conditions:</th>
   						<td>${flist[i].ftext}</td>
   					</tr>
   				</table>
   			</p>
   		</section>`);
      }

      $("#aboutHeader").html(`${studentData.studentName}`);
      $("#aboutData").html(`
         Student#: ${studentData.studentNumb} </br>
         Program: ${studentData.studentProg} </br>
         Favorite Quote: ${studentData.studentQuote}</br>
         <img src='images/${studentData.studentPic}' width=300px>
      `);
   });
});

$(document).ready(function(){
   // Click "Submit" on data entry page
   $("#submit").click(function(){
      localStorage.setItem(`${localStore}email`, $("#email").val());
      localStorage.setItem(`${localStore}city`, $("input[name='city']:checked").val());
      localStorage.setItem(`${localStore}cmt`, $("#comment").val());
      alert(`
         Thank you ${studentData.studentName}, Content Submitted.
      `);
   });

   // Click "Display Data" on main page
   $("#displayData").click(function(){
      $("#displayMain").html("");
      $("#displayMain").append("Latest Comment/Question:</br>"
      + localStorage.getItem(`${localStore}cmt`));
   });
});

function makeLink(icon, url, text, x){
   var fileName = icon;
   var iconName = fileName.split('.')[0];
   $("style").append(
      ".ui-icon-" + iconName + ":after {" +
      "background-image: url('images/" + fileName + "');" +
      "background-size: 22px 22px;}"
   );
   $("#links").append(`
      <div class="ui-block-${x}">
         <a href="${url}" class="ui-btn ui-icon-${iconName} ui-btn-icon-bottom">${text}</a>
      </div>`);
}
