const SPREADSHEET_ID = '1xwBz5CrQ3es75YkNK2pxoLK8HtG-5I9dnjFpxfudiC8';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    
    sheet.getRange("A:A").clearContent();
    
    if (data && data.length > 0) {
      const values = data.map(item => [item]);
      sheet.getRange(1, 1, values.length, 1).setValues(values);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON)
      .withHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .withHeaders({
        'Access-Control-Allow-Origin': '*'
      });
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("Método GET não suportado. Use POST.")
    .withHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
    });
}