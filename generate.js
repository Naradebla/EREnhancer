function createCoolArray(badArray){
	var result = Array(badArray.length);
	badArray.each(function(index,element){
		result[index] = $(this).text();
	});
	return result;
}
function getYearSpan(){
	return $("#ContentPlaceHolderMenu_ddlAnno").find(":selected").text();
}
function cleanArray(data){
	var aLenght = 0;
	for(var i = 0; i < data.length;i++){
		if(data[i] != null){
			aLenght++;
		}
	}
	var result = Array(aLenght);
	var c = 0;
	for(var i = 0; i < data.length; i++){
		if(data[i] != null){
			result[c] = data[i];
			c++;
		}
	}
	return result;
}
function dateToCoolDate(dates,yearSpan){
	var result = Array(dates.length);
	for(var i = 0; i < result.length;i++){
		if(dates[i] == null){
			continue;
		}
		var space = dates[i].search(" ");
		var day = dates[i].substring(0,space);
		var month = 0;
		switch(dates[i].substring(space + 1)){
			case "Ott":
				month = 10;
				break;
			case "Nov":
				month = 11;
				break;
			case "Dic":
				month = 12;
				break;
			case "Gen":
				month = 1;
				break;
			case "Feb":
				month = 2;
				break;
			case "Mar":
				month = 3;
				break;
			case "Apr":
				month = 4;
				break;
			
			default:
				month = 0;
		}
		var year = 0;
		if(month > 6){
			year = parseInt(yearSpan.substring(0,yearSpan.search("/")));
		}else{
			year = parseInt(yearSpan.substring(yearSpan.search("/") + 1));
		}
		result[i] = "" + month + "/" + day + "/" + year;
	}
	return result;
}
function countDays(dsow){
	var week = Array(7);
	for(var i = 0; i < week.length; i++){
		week[i] = 0;
	}
	for(var i = 0; i < dsow.length; i++){
		week[dsow[i]]++;
	}
	return week;
}
function maxInArray(array){
	var max = 0;
	for(var i = 0; i < array.length;i++){
		if(array[i] > max){
			max = array[i];
		}
	}
	return max;
}
function drawGraph(week){
	$("#GlobalContent").append("<canvas id=\"dowGraph\" width=\"500\" height=\"550\" style=\"border:1px solid #c3c3c3;\"> HTML5 is required to draw grpahs </canvas>");
	var canvas = $("#dowGraph");
	var weekdays = ["Dom","Lun","Mar","Mer","Gio","Ven","Sab"];
	var canvas = $("#dowGraph");
	var baseX = 100;
	var baseY = 500;
	var spaceX = 5;
	var widthX = 50;
	var max = maxInArray(week);
	var maxLen = baseY-25;
	var factor = maxLen/max;
	for(var i = 0; i < week.length; i++){
		var xVal = baseX + ((spaceX + widthX) * i);
		var yVal = baseY - (factor*week[i]);
		var hVal = factor*week[i];
		canvas.drawRect({
			fillStyle: '#5FAA62',
			x: xVal, y: yVal,
			width: widthX, 
			height: hVal,
			fromCenter: false
		});
		$('canvas').drawText({
			fillStyle: '#000',
			strokeStyle: '#25a',
			strokeWidth: 0,
			x: baseX-20, y: yVal,
			fontSize: 14,
			fontFamily: 'Verdana, sans-serif',
			text: week[i]
		});
	}
	var xVal = baseX + ((spaceX + widthX) * 7);
	var yVal = baseY;
	$('canvas').drawLine({
		strokeStyle: '#000',
		strokeWidth: 1,
		x1: baseX, y1: 0,
		x2: xVal, y2: 0,
		x3: xVal, y3: baseY,
		x4: baseX, y4: baseY,
		closed: true
	});
	for(var i = 0; i < weekdays.length;i++){
		var xVal = baseX + ((spaceX + widthX) * i) +(widthX/2);
		$('canvas').drawText({
			fillStyle: '#000',
			strokeStyle: '#25a',
			strokeWidth: 0,
			x: xVal, y: baseY+10,
			fontSize: 14,
			fontFamily: 'Verdana, sans-serif',
			text: weekdays[i]
		});
	}
	
}

$(document).ready(function(){
	if($("#ContentPlaceHolderMenu_lblTitleToolBar").text() != "SCUOLA-FAMIGLIA - Scheda Registro Docenti"){
		return;
	}
    //$("#GlobalContent").append("<p>Questa è una prova </p>");
	var dates = $("#ElencoVoti tr:first-child");
	var good = createCoolArray(dates.children());
	var data = $("#ElencoVoti tr[id^='AluV']");
	var Absents = Array(good.length);
	for(var i = 0; i < good.length; i++){
		data.each(function(index,element){
			var doubleCount = $(this).find("td").slice(0,i).find("table").length;
			var cI = i + (doubleCount * 2);
		/*	if(doubleCount > 0){
				console.log("double count on i=" + i);
			}*/
			var str = $(this).find("td").eq(cI).text();
			if(str.substring(0,1) == "A"){
				Absents[i] = good[i];
			}
		});		
	}
	Absents = cleanArray(Absents);
	for(var i = 0; i < Absents.length;i++){
		if(Absents[i] == null){
			continue;
		}
		//$("#GlobalContent").append("<p>"+Absents[i]+"</p>");
	}
	var year = getYearSpan();
	var coolAbsents = dateToCoolDate(Absents,year);
	var dow = Array(coolAbsents.length);
	var weekday = new Array(7);
	weekday[0]=  "Domenica";
	weekday[1] = "Lunedì";
	weekday[2] = "Maretdì";
	weekday[3] = "Mercoledì";
	weekday[4] = "Giovedì";
	weekday[5] = "Venerdì";
	weekday[6] = "Sabato";
	for(var i = 0; i < coolAbsents.length;i++){
		if(coolAbsents[i] == null){
			continue;
		}
		dow[i] = new Date(coolAbsents[i]).getDay();
		//$("#GlobalContent").append("<p>"+coolAbsents[i]+"</p>");
		//$("#GlobalContent").append("<p>"+weekday[dow[i]]+"</p>");
	}
	week = countDays(dow);
	for(var i = 0; i < weekday.length;i++){
		//$("#GlobalContent").append("<p>"+weekday[i]+": "+week[i]+"</p>");
	}
	drawGraph(week);

});