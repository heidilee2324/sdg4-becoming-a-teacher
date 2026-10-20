const SPREADSHEET_ID = 'REPLACE_WITH_GOOGLE_SHEET_ID';
const SHEET_NAME = '觀展回饋';
const HEADERS = ['送出時間', '理解程度（1–3）', '觀察線索', '觀展短句'];
const ALLOWED_LENSES = [
  '決策需要同時看見多個線索',
  '支持需要跨角色協調',
  '行為反覆時需要持續調整',
  '我還想再多了解',
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Feedback')
    .setTitle('成為教師之路｜觀展回饋')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setupFeedbackSheet() {
  const sheet = getFeedbackSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return '觀展回饋工作表已準備完成。';
}

function saveFeedback(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('回饋格式不正確。');
  }

  const rating = Number(payload.rating);
  const lens = String(payload.lens || '');
  const reflection = String(payload.reflection || '');

  if (![1, 2, 3].includes(rating)) throw new Error('請選擇理解程度。');
  if (!ALLOWED_LENSES.includes(lens)) throw new Error('請選擇觀察線索。');
  if (reflection.length > 300) throw new Error('觀展短句不可超過 300 字。');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getFeedbackSheet_();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      rating,
      safeCell_(lens, 100),
      safeCell_(reflection, 300),
    ]);
    SpreadsheetApp.flush();
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function getFeedbackSheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'REPLACE_WITH_GOOGLE_SHEET_ID') {
    throw new Error('請先在 Code.gs 設定試算表 ID。');
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function safeCell_(value, limit) {
  let text = String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, limit);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return text;
}
