/**
 * Pylogicx Academy — Quiz Results Collector
 *
 * HOW TO SET THIS UP (do this once):
 *
 * 1. Go to Google Sheets → create a new blank spreadsheet
 *    Name it: "Pylogicx Quiz Results"
 *
 * 2. Click Extensions → Apps Script
 *
 * 3. Delete everything in the editor and paste this entire file
 *
 * 4. Click Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    → Click Deploy → Copy the Web App URL
 *
 * 5. Open docs/javascripts/quiz.js and paste that URL into
 *    the APPS_SCRIPT_URL variable at the top of the file.
 *
 * 6. Run: mkdocs gh-deploy
 *    That's it. Results will appear in your sheet live.
 */

const SHEET_NAME = "Quiz Results";

// Accepts POST from the quiz page and writes one row per submission
function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    const grade = gradeLabel(data.percentage);

    sheet.appendRow([
      new Date().toLocaleString("en-GB"),   // Timestamp
      data.student_name,                    // Full name
      data.student_email,                   // Email
      data.week,                            // e.g. "Week 1"
      `${data.score} / ${data.total}`,      // e.g. "4 / 5"
      `${data.percentage}%`,                // e.g. "80%"
      grade,                                // Pass / Needs Review / Fail
    ]);

    // Auto-colour the Grade column
    const lastRow = sheet.getLastRow();
    const gradeCell = sheet.getRange(lastRow, 7);
    if (grade === "Pass")           gradeCell.setBackground("#d9ead3");
    else if (grade === "Needs Review") gradeCell.setBackground("#fff2cc");
    else                            gradeCell.setBackground("#f4cccc");

    return json({ status: "ok" });

  } catch (err) {
    return json({ status: "error", message: err.toString() });
  }
}

// GET handler so you can test the URL in a browser tab
function doGet() {
  return ContentService.createTextOutput("Pylogicx quiz endpoint is live.");
}

// ── Helpers ────────────────────────────────────────────────────────────────

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
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    // Header row
    const headers = [
      "Timestamp", "Student Name", "Email",
      "Week", "Score", "Percentage", "Grade"
    ];
    sheet.appendRow(headers);

    // Style the header
    const header = sheet.getRange(1, 1, 1, headers.length);
    header.setFontWeight("bold");
    header.setBackground("#4a86e8");
    header.setFontColor("#ffffff");

    // Freeze header so it stays visible when scrolling
    sheet.setFrozenRows(1);

    // Column widths
    sheet.setColumnWidth(1, 160); // Timestamp
    sheet.setColumnWidth(2, 160); // Name
    sheet.setColumnWidth(3, 200); // Email
    sheet.setColumnWidth(4, 80);  // Week
    sheet.setColumnWidth(5, 80);  // Score
    sheet.setColumnWidth(6, 90);  // Percentage
    sheet.setColumnWidth(7, 110); // Grade
  }

  return sheet;
}
