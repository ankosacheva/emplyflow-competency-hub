/**
 * EmplyFlow Hub — приём заявок в Google Sheet + письмо.
 *
 * Установка:
 * 1. Создайте Google Sheet, лист назовите Leads
 * 2. Расширения → Apps Script → вставьте этот файл целиком
 * 3. Укажите NOTIFY_EMAIL ниже
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. URL деплоя положите в window.HUB_LEAD_ENDPOINT на сайте
 */

var SHEET_NAME = 'Leads';
var NOTIFY_EMAIL = 'kosacheva.company@gmail.com'; // куда слать уведомление

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || '{}';
    var data = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'timestamp', 'name', 'company', 'email', 'phone', 'industry',
        'who', 'count', 'competency', 'case', 'comment', 'source', 'page'
      ]);
    }

    sheet.appendRow([
      data.ts || new Date().toISOString(),
      data.name || '',
      data.company || '',
      data.email || '',
      data.phone || '',
      data.industry || '',
      data.who || '',
      data.count || '',
      data.competencyTitle || data.competency || '',
      data.caseTitle || data.caseId || '',
      data.comment || '',
      data.source || '',
      data.page || ''
    ]);

    if (NOTIFY_EMAIL) {
      var subject = 'Заявка EmplyFlow Hub: ' + (data.company || data.name || 'без названия');
      var body = [
        'Имя: ' + (data.name || ''),
        'Компания: ' + (data.company || ''),
        'Email: ' + (data.email || ''),
        'Телефон: ' + (data.phone || ''),
        'Отрасль: ' + (data.industry || ''),
        'Кого оценить: ' + (data.who || '') + ' · ' + (data.count || ''),
        'Компетенция: ' + (data.competencyTitle || data.competency || ''),
        'Кейс: ' + (data.caseTitle || data.caseId || ''),
        'Источник: ' + (data.source || ''),
        'Комментарий: ' + (data.comment || ''),
        'Страница: ' + (data.page || '')
      ].join('\n');
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'emplyflow-hub-leads' }))
    .setMimeType(ContentService.MimeType.JSON);
}
