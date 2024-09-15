function doGet() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Newsletter Management')
    .setWidth(800);
  return htmlOutput;
}

function newPage(page) {
  return HtmlService.createHtmlOutputFromFile(page).getContent()
}

function showPage(id){
  return HtmlService.createHtmlOutputFromFile('show').append("<p id='id'>"+id+"</p>").getContent()
}

function formatDate() {
  var date = new Date();

  var day = Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd');
  var month = Utilities.formatDate(date, Session.getScriptTimeZone(), 'MM');
  var year = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy');

  var formattedDate = day + "/" + month + "/" + year;
  Logger.log(formattedDate);  // Logs the formatted date
}

function reqData(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Newsletter');
  var data = sheet.getDataRange().getValues();
  var formattedData = [];
  var timeZone = 'Asia/Kolkata';
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (i > 0) {
      var timestamp = row[0];
      if (timestamp instanceof Date) {
        var formattedDate = Utilities.formatDate(timestamp, timeZone, 'dd MMM yyyy');
        row[0] = `${formattedDate}`;
      }
    }
    formattedData.push(row);
  }
  return formattedData;
}

function addNewsletter(title='hello', htmlBody='buddy'){
  let data = [new Date(), Utilities.getUuid(), title, htmlBody, 0,0];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Newsletter');
  sheet.appendRow(data);
  return newPage('index');
}

function getNewsletterById(id){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Newsletter');
  var data = sheet.getDataRange().getValues();
  var timeZone = 'Asia/Kolkata';
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (i > 0 && data[i][1]==id) {
      var timestamp = row[0];
      if (timestamp instanceof Date) {
        var formattedDate = Utilities.formatDate(timestamp, timeZone, 'dd MMM yyyy');
        row[0] = `${formattedDate}`;
      }
      return row;
    }
  }
}

function updateNewsletter(id, title, htmlBody) {
  let data = [new Date(), id, title, htmlBody, 0, 0];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Newsletter');
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var rowIndex = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][1] === id) {
      rowIndex = i + 1;
      break;
    }
  }
  if (rowIndex === -1) {
    Logger.log('ID not found!');
  }
  sheet.getRange(rowIndex, 1, 1, data.length).setValues([data]);
  return newPage('index');
}

function deleteNewsletter(id) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Newsletter');
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var rowIndex = -1;
  for (var i = 0; i < values.length; i++) {
    if (values[i][1] === id) { 
      rowIndex = i + 1; 
      break;
    }
  }
  if (rowIndex === -1) {
    Logger.log('ID not found!');
  }
  sheet.deleteRow(rowIndex);
  Logger.log('Row with ID ' + id + ' has been deleted.');
  return newPage('index');
}


function worker(){
  let running = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Running');
  if(running.getRange('C2').getValue()=='Running'){
    return true;
  }
  return false
}

