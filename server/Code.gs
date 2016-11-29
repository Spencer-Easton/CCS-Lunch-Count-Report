function doGet(e) {
  var indexPage = HtmlService.createTemplateFromFile('app/index');   
  return indexPage.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME).setTitle("Lunch Count Report");
}

function include(page){
  return HtmlService.createTemplateFromFile(page).evaluate().getContent();
}

function getHeaders(){
  var ss = SpreadsheetApp.openById('1Dd_olm3AEHXExRy5qZR8zeP6hRp6GiFjtS9ctON2uUw').getSheetByName('Form Responses 1'),
      range = ss.getRange(1, 1, 1, ss.getLastColumn()),
      headers = range.getValues();
  return headers;
}

function getCustomRangeData(startDate,endDate){
  var returnData = [];
  var ss = SpreadsheetApp.openById('1Dd_olm3AEHXExRy5qZR8zeP6hRp6GiFjtS9ctON2uUw').getSheetByName('Form Responses 1');
  var dataRange = ss.getRange(2, 1, ss.getLastRow(), ss.getLastColumn());  
  var values = dataRange.getValues();
   for(var i = 0; i<values.length - 1; i++){ //last row always seems to be null        
    var thisMoment = moment(values[i][0]);
    if(thisMoment.isSameOrAfter(startDate,"day") && thisMoment.isSameOrBefore(endDate,"day")){    
      values[i][0] = thisMoment.format("MMM Do YYYY").toString(); // need to convert the date Objs to string for display
      returnData.push(values[i]);
    }  
  }
  return returnData;
}

function getRangeData(range){
  range = range || "day";
  var ranges = {"day":getDayofYear,"week": getWeekOfYear,"month": getMonthOfYear,"year":getYear}; //functions defined below    
  if(!(range in ranges)){
    throw new Error("Invalid Range");
  }
  var returnData = [];
  
  var ss = SpreadsheetApp.openById('1Dd_olm3AEHXExRy5qZR8zeP6hRp6GiFjtS9ctON2uUw').getSheetByName('Form Responses 1');
  var dataRange = ss.getRange(2, 1, ss.getLastRow(), ss.getLastColumn());
  
  var now = ranges[range](moment()); // Get current date in report range format
  var values = dataRange.getValues();
  
  for(var i = 0; i<values.length - 1; i++){ //last row always seems to be null       
    var resData =  ranges[range](values[i][0]); // convert this row to report range format
    if(resData === now){ // check the entry if it is in report range
      values[i][0] = moment(values[i][0]).format("MMM Do YYYY").toString(); // need to convert the date Objs to string for display
      returnData.push(values[i]);
    }  
  }
  return returnData;
}

function getDayofYear(date){return moment(date).format("DDD");}
function getWeekOfYear(date){return moment(date).format("W");}
function getMonthOfYear(date){return moment(date).format("M");}
function getYear(date){return moment(date).format("YYYY");}