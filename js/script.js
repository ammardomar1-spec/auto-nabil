/**
 * Auto Mohamed Nabil - Luxury Dealership Landing Page Script
 * معالجة وتدقيق الفورم والإرسال إلى Google Apps Script وتكامل الواتساب
 */

// رابط الـ Web App الخاص بـ Google Apps Script مشفر (Base64) لحمايته
const _0x4a = "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4dFFOd1I1TVN6ZS16Xy0zQWZBUnE4YjB0cDdlWVNaWUNsNG90aVd5ZzFaNEdCSEtwdzlqb2E2QkNPVHdzdDFSQ2JiZy9leGVj";
const GOOGLE_SCRIPT_URL = atob(_0x4a); 

// أرقام هواتف المعرض للتواصل والواتساب
const PRIMARY_WHATSAPP = "201095178455";

// ============================================================
// 📝 عدل من هنا فقط لإضافة فيديوهاتك وصورك
// ------------------------------------------------------------
// الفيديوهات: حط رابط المشاهدة الأصلي (يوتيوب / تيك توك / فيسبوك)
// + صورة مصغرة + عنوان. الضغط على الكارت يفتح الرابط في تاب جديد.
// الصور: حط رابط الصورة + وصف. يفضل صور بعرض 800px على الأقل.
// لو هترفع صور محلية: حطها في فولدر images/ واستخدم src مثل "images/car1.jpg"
// ============================================================
const GALLERY_VIDEOS = [
  {
    title: "جولة في المعرض — عربيات فابريكا متاحة الآن",
    url: "https://www.youtube.com/",
    thumbnail: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&auto=format&fit=crop",
    duration: "0:45"
  },
  {
    title: "فحص عملي قبل التسليم — شاسيه وموتور ودهان",
    url: "https://www.tiktok.com/",
    thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
    duration: "1:20"
  },
  {
    title: "تسليم عميل جديد — رأيه بعد الاستلام",
    url: "https://www.facebook.com/",
    thumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80&auto=format&fit=crop",
    duration: "0:58"
  },
  {
    title: "وصل حديثاً — إلنترا حالة ممتازة",
    url: "https://www.youtube.com/",
    thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop",
    duration: "1:05"
  }
];

const GALLERY_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&auto=format&fit=crop", alt: "سيارة متاحة في المعرض — صورة 1" },
  { src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop", alt: "سيارة متاحة في المعرض — صورة 2" },
  { src: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80&auto=format&fit=crop", alt: "سيارة متاحة في المعرض — صورة 3" },
  { src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop", alt: "سيارة متاحة في المعرض — صورة 4" },
  { src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80&auto=format&fit=crop", alt: "تسليم عميل — صورة 5" },
  { src: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80&auto=format&fit=crop", alt: "تسليم عميل — صورة 6" }
];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("carRequestForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitBtnText = document.getElementById("submitBtnText");
  const submitSpinner = document.getElementById("submitSpinner");
  const formAlert = document.getElementById("formAlert");
  const successModal = document.getElementById("successModal");
  const closeSuccessModal = document.getElementById("closeSuccessModal");
  const whatsappConfirmBtn = document.getElementById("whatsappConfirmBtn");
  const mainHeader = document.getElementById("mainHeader");
  
  // شريط الترويسة الشفاف يتدرج بسلاسة عند التمرير
  if (mainHeader) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) {
        mainHeader.classList.add("shadow-lg", "shadow-black/50", "bg-[#06080D]/95");
        mainHeader.classList.remove("bg-[#0B0F17]/85");
      } else {
        mainHeader.classList.remove("shadow-lg", "shadow-black/50", "bg-[#06080D]/95");
        mainHeader.classList.add("bg-[#0B0F17]/85");
      }
    }, { passive: true });
  }

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
    hideError();

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

    // التدقيق الصارم للحقول الأساسية
    if (!carModel) {
      showError("من فضلك اكتب ماركة وموديل العربية المطلوبة.");
      document.getElementById("carModel").focus();
      return;
    }

    if (!modelYear) {
      showError("من فضلك اختر سنة الموديل المطلوبة.");
      document.getElementById("modelYear").focus();
      return;
    }

    if (!budget) {
      showError("من فضلك اختر الميزانية المتوقعة.");
      document.getElementById("budget").focus();
      return;
    }

    if (!fullName) {
      showError("من فضلك أدخل الاسم بالكامل.");
      document.getElementById("fullName").focus();
      return;
    }

    if (!validateEgyptianPhone(phone)) {
      showError("يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقماً (مثال: 01012345678).");
      phoneInput.focus();
      return;
    }

    if (!finalGov) {
      showError("من فضلك اختر المحافظة.");
      govSelect.focus();
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
          mode: "no-cors" // إلزامي لتفادي حظر الـ CORS من خوادم Google
        });
      } else {
        // محاكاة سريعة في حال لم يتم وضع رابط Webhook
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // إظهار المودال بنجاح
      showSuccessState(payload);
      form.reset();
      if (otherGovContainer) otherGovContainer.classList.add("hidden");

    } catch (err) {
      console.error("Submission Error:", err);
      showError("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى أو التواصل معنا عبر الهاتف أو الواتساب.");
    } finally {
      setLoadingState(false);
    }
  });

  function setLoadingState(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtnText.textContent = "جاري حجز المعاينة وتسجيل طلبك...";
      submitSpinner.classList.remove("hidden");
      submitBtn.classList.add("opacity-80", "cursor-not-allowed");
    } else {
      submitBtn.disabled = false;
      submitBtnText.textContent = "إرسال الطلب وحجز المعاينة";
      submitSpinner.classList.add("hidden");
      submitBtn.classList.remove("opacity-80", "cursor-not-allowed");
    }
  }

  function showError(message) {
    formAlert.textContent = message;
    formAlert.classList.remove("hidden");
    formAlert.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function hideError() {
    formAlert.classList.add("hidden");
    formAlert.textContent = "";
  }

  function showSuccessState(data) {
    // تجهيز رابط الواتساب التلقائي الملخص بالبيانات
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

    // إظهار المودال وتعيين التركيز عليه
    successModal.classList.remove("hidden");
    successModal.classList.add("flex");
    if (whatsappConfirmBtn) whatsappConfirmBtn.focus();
  }

  function closeModal() {
    successModal.classList.add("hidden");
    successModal.classList.remove("flex");
  }

  if (closeSuccessModal) {
    closeSuccessModal.addEventListener("click", closeModal);
  }

  // إغلاق المودال عند الضغط في المساحة الخارجية
  window.addEventListener("click", (e) => {
    if (e.target === successModal) {
      closeModal();
    }
  });

  // إغلاق المودال بمفتاح Escape لدعم إمكانية الوصول Accessibility
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !successModal.classList.contains("hidden")) {
      closeModal();
    }
  });

  initGalleries();
});

/**
 * معرض الفيديوهات والصور — كاروسيل بسحب اللمس + أسهم + dots + لايت بوكس
 */
function initGalleries() {
  initVideoCarousel();
  initPhotoCarousel();
}

function scrollTrackBy(track, dirMultiplier) {
  if (!track) return;
  const card = track.querySelector(".carousel-card");
  const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
  const isRTL = document.documentElement.dir === "rtl";
  // في RTL اتجاه الـ scroll معكوس في Chrome/Edge
  const left = dirMultiplier * step * (isRTL ? -1 : 1);
  track.scrollBy({ left, behavior: "smooth" });
}

function buildDots(dotsEl, count, onGo) {
  if (!dotsEl) return;
  dotsEl.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "carousel-dot" + (i === 0 ? " active" : "");
    b.setAttribute("aria-label", "انتقال إلى عنصر " + (i + 1));
    b.addEventListener("click", () => onGo(i));
    dotsEl.appendChild(b);
  }
}

function syncDotsOnScroll(track, dotsEl) {
  if (!track || !dotsEl) return;
  const cards = track.querySelectorAll(".carousel-card");
  const dots = dotsEl.querySelectorAll(".carousel-dot");
  if (!cards.length || !dots.length) return;
  let raf = null;
  track.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const cardW = cards[0].getBoundingClientRect().width + 16;
      const absScroll = Math.abs(track.scrollLeft);
      const idx = Math.min(dots.length - 1, Math.round(absScroll / cardW));
      dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    });
  }, { passive: true });
}

function goToIndex(track, index) {
  if (!track) return;
  const cards = track.querySelectorAll(".carousel-card");
  if (!cards[index]) return;
  cards[index].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
}

function initVideoCarousel() {
  const track = document.getElementById("videoTrack");
  const dotsEl = document.getElementById("videoDots");
  if (!track || typeof GALLERY_VIDEOS === "undefined") return;

  track.innerHTML = GALLERY_VIDEOS.map((v) => `
    <a href="${v.url}" target="_blank" rel="noopener noreferrer"
       class="carousel-card carousel-card-video luxury-card overflow-hidden group block">
      <div class="video-thumb-zoom relative aspect-video overflow-hidden">
        <img src="${v.thumbnail}" alt="${v.title}" loading="lazy"
             class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
        <span class="absolute inset-0 flex items-center justify-center">
          <span class="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/30 border-t border-white/50 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 -ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </span>
        </span>
        ${v.duration ? `<span class="absolute bottom-2.5 left-2.5 text-[11px] font-bold bg-black/70 text-white px-2 py-0.5 rounded-md border border-white/15" dir="ltr">${v.duration}</span>` : ""}
        <span class="absolute top-2.5 right-2.5 text-[11px] font-bold bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded-md">▶ مشاهدة</span>
      </div>
      <div class="p-3.5">
        <h3 class="font-bold text-sm text-white leading-relaxed line-clamp-2">${v.title}</h3>
      </div>
    </a>
  `).join("");

  buildDots(dotsEl, GALLERY_VIDEOS.length, (i) => goToIndex(track, i));
  syncDotsOnScroll(track, dotsEl);

  ["videoNext", "videoNextM"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => scrollTrackBy(track, 1));
  });
  ["videoPrev", "videoPrevM"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => scrollTrackBy(track, -1));
  });

  enableDragScroll(track);
}

function initPhotoCarousel() {
  const track = document.getElementById("photoTrack");
  const dotsEl = document.getElementById("photoDots");
  if (!track || typeof GALLERY_PHOTOS === "undefined") return;

  track.innerHTML = GALLERY_PHOTOS.map((p, i) => `
    <button type="button" data-index="${i}"
       class="carousel-card carousel-card-photo photo-zoom luxury-card overflow-hidden group text-right p-0">
      <div class="relative aspect-[4/3] overflow-hidden">
        <img src="${p.src}" alt="${p.alt}" loading="lazy" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
        <span class="absolute bottom-2.5 right-2.5 left-2.5 text-xs font-bold text-white leading-relaxed truncate">${p.alt}</span>
        <span class="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        </span>
      </div>
    </button>
  `).join("");

  buildDots(dotsEl, GALLERY_PHOTOS.length, (i) => goToIndex(track, i));
  syncDotsOnScroll(track, dotsEl);

  ["photoNext", "photoNextM"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => scrollTrackBy(track, 1));
  });
  ["photoPrev", "photoPrevM"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => scrollTrackBy(track, -1));
  });

  enableDragScroll(track);

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  let current = 0;

  function openLightbox(i) {
    current = (i + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
    lightboxImg.src = GALLERY_PHOTOS[current].src;
    lightboxImg.alt = GALLERY_PHOTOS[current].alt;
    lightboxCaption.textContent = GALLERY_PHOTOS[current].alt;
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    document.body.style.overflow = "";
  }

  track.querySelectorAll("[data-index]").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(Number(btn.dataset.index)));
  });

  const closeBtn = document.getElementById("lightboxClose");
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  const nextBtn = document.getElementById("lightboxNext");
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); openLightbox(current + 1); });
  const prevBtn = document.getElementById("lightboxPrev");
  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); openLightbox(current - 1); });
  if (lightbox) lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(current + 1);
    if (e.key === "ArrowRight") openLightbox(current - 1);
  });
}

// سحب بالماوس على الديسكتوب زي الموبايل
function enableDragScroll(track) {
  let isDown = false, startX = 0, startScroll = 0;
  track.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    startScroll = track.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    track.scrollLeft = startScroll - (e.clientX - startX);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
    window.addEventListener(ev, () => { isDown = false; })
  );
}
