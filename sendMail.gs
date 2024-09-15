function sendmail(newsletterId) {
  let data = getNewsletterById(newsletterId);
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Email Data');
  let running = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Running');
  let send = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Send');
  let emails = sheet.getRange('A2:A').getValues().filter(String).map(el=>el[0]);
  running.getRange('A2:C2').setValues([[new Date(), newsletterId, 'Running']]);
  for(email of emails){
    if(getMailApp(email, data[2], data[3])){
      send.appendRow([new Date(), newsletterId, email, 'Sended']);
    }else{
      send.appendRow([new Date(), newsletterId, email, 'Not Sended']);
    }
  }
  running.getRange('A2:C2').setValues([[new Date(), newsletterId, 'Free']]);
  return newPage('index');
}

function getMailApp(to, title, htmlBody) {
  var options = {
    to: to,
    cc: 'divyanshk231@gmail.com',
    bcc: 'divyanshk231@gmail.com',
    name: title,
    // from: 'max0637859167@gmail.com', // for paid accounts + alias
    subject: title,
    htmlBody: htmlBody,
    noreply: 1,
    // replytoname: 'Maaan', // works for Gmail API
    // attachments: array,
    // inlineimages: object
  }
  try {
    // try using MailApp, or GmailApp
    var response = MMailApp.send(options);
    Logger.log(response);
    return true;
  } catch(err) {
    Logger.log(err);
    return false
  }
}
