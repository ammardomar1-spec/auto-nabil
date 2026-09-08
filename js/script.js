/**
 * Auto Mohamed Nabil - Landing Page Script
 * معالجة الفورم والتحقق والإرسال إلى Google Apps Script
 */

// ضع رابط الـ Web App الخاص بـ Google Apps Script هنا بعد نشره
// مثال: "https://script.google.com/macros/s/AKfycbx.../exec"
const GOOGLE_SCRIPT_URL = ""; 

// أرقام هواتف المعرض للتواصل والواتساب
const PRIMARY_WHATSAPP = "201201298587"; 

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("carRequestForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitBtnText = document.getElementById("submitBtnText");
  const submitSpinner = document.getElementById("submitSpinner");
  const formAlert = document.getElementById("formAlert");
  const successModal = document.getElementById("successModal");
  const closeSuccessModal = document.getElementById("closeSuccessModal");
  const whatsappConfirmBtn = document.getElementById("whatsappConfirmBtn");
  
  // التحكم في ظهور حقل "محافظة أخرى"
  const govSelect = document.getElementById("governorate");
  const otherGovContainer = document.getElementById("otherGovContainer");
  const otherGovInput = document.getElementById("otherGovernorate");

  if (govSelect && otherGovContainer) {
    govSelect.addEventListener("change", (e) => {
      if (e.target.value === "أخرى") {
        otherGovContainer.classList.remove("hidden");
        otherGovInput.required = true;
        otherGovInput.focus();
      } else {
        otherGovContainer.classList.add("hidden");
        otherGovInput.required = false;
        otherGovInput.value = "";
      }
    });
  }

  // التحقق من صحة رقم الموبايل المصري
  const phoneInput = document.getElementById("phone");
  function validateEgyptianPhone(number) {
    const cleaned = number.replace(/\s+/g, "").replace("+2", "");
    const regex = /^01[0125][0-9]{8}$/;
    return regex.test(cleaned);
  }

  // معالجة إرسال الفورم
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formAlert.classList.add("hidden");
    formAlert.textContent = "";

    // استخراج القيم
    const fullName = document.getElementById("fullName").value.trim();
    const phone = phoneInput.value.trim();
    const govValue = govSelect.value;
    const finalGov = govValue === "أخرى" ? (otherGovInput.value.trim() || "أخرى") : govValue;
    const carModel = document.getElementById("carModel").value.trim();
    const modelYear = document.getElementById("modelYear").value;
    const budget = document.getElementById("budget").value;
    
    // الخيارات الراديو (حالة العربية وجاهزية الشراء)
    const carConditionElem = document.querySelector('input[name="carCondition"]:checked');
    const carCondition = carConditionElem ? carConditionElem.value : "غير محدد";

    const readinessElem = document.querySelector('input[name="readiness"]:checked');
    const readiness = readinessElem ? readinessElem.value : "غير محدد";

    const notes = document.getElementById("notes").value.trim();

    // التحقق من الحقول الأساسية
    if (!fullName) {
      showError("من فضلك أدخل الاسم بالكامل.");
      return;
    }

    if (!validateEgyptianPhone(phone)) {
      showError("يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقم (مثال: 01012345678).");
      phoneInput.focus();
      return;
    }

    if (!finalGov) {
      showError("من فضلك اختر المحافظة.");
      return;
    }

    if (!carModel) {
      showError("من فضلك اكتب ماركة وموديل العربية المطلوبة.");
      return;
    }

    const payload = {
      fullName,
      phone,
      governorate: finalGov,
      carModel,
      modelYear,
      budget,
      carCondition,
      readiness,
      notes
    };

    // تغيير حالة الزر إلى جاري الإرسال
    setLoadingState(true);

    try {
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith("http")) {
        // إرسال فعلي إلى Google Apps Script
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload),
          mode: "no-cors" // مهم لضمان عدم توقف الإرسال بسبب قيود CORS للمتصفح مع Google
        });
      } else {
        // محاكاة سريعة (Demo Mode) في حال لم يتم وضع رابط Apps Script بعد
        console.warn("Auto Mohamed Nabil: GOOGLE_SCRIPT_URL لم يتم تعيينه بعد. يتم حفظ البيانات في Demo Mode.");
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // إظهار المودال بنجاح
      showSuccessState(payload);
      form.reset();
      if (otherGovContainer) otherGovContainer.classList.add("hidden");

    } catch (err) {
      console.error("Submission Error:", err);
      showError("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى أو التواصل معنا هاتفياً أو عبر واتساب.");
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtnText.textContent = "جاري تسجيل طلبك...";
      submitSpinner.classList.remove("hidden");
      submitBtn.classList.add("opacity-80", "cursor-not-allowed");
    } else {
      submitBtn.disabled = false;
      submitBtnText.textContent = "إرسال الطلب الآن 🚘";
      submitSpinner.classList.add("hidden");
      submitBtn.classList.remove("opacity-80", "cursor-not-allowed");
    }
  }

  function showError(message) {
    formAlert.textContent = message;
    formAlert.classList.remove("hidden");
    formAlert.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showSuccessState(data) {
    // تجهيز رابط الواتساب الجاهز بالبيانات
    const msg = `السلام عليكم، سجلت طلبي في الموقع لمساعدتي في شراء سيارة:\n` +
      `👤 الاسم: ${data.fullName}\n` +
      `📱 الموبايل: ${data.phone}\n` +
      `📍 المحافظة: ${data.governorate}\n` +
      `🚘 العربية المطلوبة: ${data.carModel} (${data.modelYear})\n` +
      `💰 الميزانية: ${data.budget}\n` +
      `✨ الحالة: ${data.carCondition}\n` +
      `⏱ الجاهزية: ${data.readiness}`;

    const encodedMsg = encodeURIComponent(msg);
    whatsappConfirmBtn.href = `https://wa.me/${PRIMARY_WHATSAPP}?text=${encodedMsg}`;

    // إظهار المودال
    successModal.classList.remove("hidden");
    successModal.classList.add("flex");
  }

  if (closeSuccessModal) {
    closeSuccessModal.addEventListener("click", () => {
      successModal.classList.add("hidden");
      successModal.classList.remove("flex");
    });
  }

  // إغلاق المودال عند الضغط في المساحة الخارجية
  window.addEventListener("click", (e) => {
    if (e.target === successModal) {
      successModal.classList.add("hidden");
      successModal.classList.remove("flex");
    }
  });
});
