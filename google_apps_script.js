/**
 * ==============================================================================
 * Google Apps Script - أوتو محمد نبيل (Auto Mohamed Nabil)
 * ==============================================================================
 * 
 * طريقة الاستخدام:
 * 1. افتح Google Sheets جديد وسمّه مثلاً: "طلبات سيارات - أوتو محمد نبيل".
 * 2. من القائمة العلوية اضغط على: Extensions (الإضافات) -> Apps Script.
 * 3. امسح أي كود موجود والصق هذا الكود بالكامل.
 * 4. اضغط على أيقونة الحفظ (Save / زر القرص).
 * 5. اضغط على الزر الأزرق في الأعلى: Deploy (نشر) -> New deployment (نشر جديد).
 * 6. بجانب "Select type" اختر Web app (تطبيق ويب عبر الترس).
 * 7. املأ البيانات كالتالي:
 *    - Description: استقبال طلبات صفحة الهبوط
 *    - Execute as: Me (حسابك)
 *    - Who has access: Anyone (أي شخص - مهمة جداً لكي يستطيع الزوار الإرسال)
 * 8. اضغط Deploy، ووافق على الصلاحيات (Authorize access).
 * 9. انسخ رابط "Web app URL" وضعه في ملف js/script.js في متغير GOOGLE_SCRIPT_URL.
 * ==============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // انتظر حتى 30 ثانية لضمان عدم تداخل الإرسال المتزامن
  lock.tryLock(30000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // العناوين الرئيسية للصفحة (إذا كانت الورقة فارغة)
    var headers = [
      "تاريخ الإرسال",
      "الاسم بالكامل",
      "رقم الموبايل",
      "المحافظة",
      "الماركة والموديل المطلوب",
      "سنة الموديل",
      "الميزانية المتوقعة",
      "حالة العربية",
      "جاهزية الشراء",
      "تفاصيل إضافية"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1E293B");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // استخراج البيانات من الطلب
    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    var now = new Date();
    var formattedDate = Utilities.formatDate(now, "Africa/Cairo", "yyyy-MM-dd hh:mm a");

    var row = [
      formattedDate,
      data.fullName || "",
      data.phone || "",
      data.governorate || "",
      data.carModel || "",
      data.modelYear || "",
      data.budget || "",
      data.carCondition || "",
      data.readiness || "",
      data.notes || ""
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "تم حفظ الطلب بنجاح"
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("سيرفر استقبال البيانات يعمل بنجاح (Auto Mohamed Nabil Web App Active).");
}
