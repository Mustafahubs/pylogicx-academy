/**
 * Pylogicx Academy — Quiz Results Collector
 *
 * AFTER UPDATING THIS FILE:
 *   Deploy → Manage deployments → pick your deployment → Edit
 *   → Version: New version → Deploy
 *   (URL stays the same — no need to update quiz.js)
 */

const SPREADSHEET_ID = "1DXNn_q399E5ZdBrAAvn5rt9ftt2s7DOI7IKno6bjfrY";
const SHEET_NAME     = "Pylogicx Quizzes Results";

// ── Called by the browser quiz page (GET + URL parameters) ───────────────────
function doGet(e) {
  // If student_name is present this is a quiz submission, not a health check
  if (e.parameter && e.parameter.student_name) {
    return handleSubmission(e.parameter);
  }

  // Plain health-check — visit the URL in a browser to confirm it's live
  return ContentService.createTextOutput("Pylogicx quiz endpoint is live ✅");
}

// ── Called by testSubmission() below (POST) ───────────────────────────────────
function doPost(e) {
  try {
    let p;
    if (e.parameter && e.parameter.payload) {
      p = JSON.parse(e.parameter.payload);
    } else if (e.postData && e.postData.contents) {
      p = JSON.parse(e.postData.contents);
    } else {
      throw new Error("No payload found");
    }
    return handleSubmission(p);
  } catch (err) {
    console.error(err);
    return json({ status: "error", message: err.toString() });
  }
}

// ── Shared logic: write one row to the sheet ──────────────────────────────────
function handleSubmission(p) {
  const sheet = getOrCreateSheet();
  const pct   = Number(p.percentage) || 0;
  const grade = gradeLabel(pct);

  sheet.appendRow([
    new Date().toLocaleString("en-GB"),
    p.student_name  || "—",
    p.student_email || "—",
    p.week          || "—",
    `${p.score} / ${p.total}`,
    `${pct}%`,
    grade,
  ]);

  const cell = sheet.getRange(sheet.getLastRow(), 7);
  if      (grade === "Pass")         cell.setBackground("#d9ead3");
  else if (grade === "Needs Review") cell.setBackground("#fff2cc");
  else                               cell.setBackground("#f4cccc");

  return json({ status: "ok" });
}

// ── Run this in the editor to verify the sheet connection is working ──────────
function testSubmission() {
  const result = handleSubmission({
    student_name:  "Test Student",
    student_email: "test@pylogicx.com",
    week:          "Week 1",
    score:         4,
    total:         5,
    percentage:    80,
  });
  Logger.log(result.getContent());
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function gradeLabel(pct) {
  if (pct >= 80) return "Pass";
  if (pct >= 60) return "Needs Review";
  return "Fail";
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = ["Timestamp", "Student Name", "Email", "Week", "Score", "Percentage", "Grade"];
    sheet.appendRow(headers);
    const h = sheet.getRange(1, 1, 1, headers.length);
    h.setFontWeight("bold");
    h.setBackground("#4a86e8");
    h.setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 210);
    sheet.setColumnWidth(4, 80);
    sheet.setColumnWidth(5, 80);
    sheet.setColumnWidth(6, 90);
    sheet.setColumnWidth(7, 110);
  }

  return sheet;
}
