const form = document.getElementById("downloadForm");
const input = document.getElementById("urlInput");
const result = document.getElementById("result");
const resultText = document.getElementById("resultText");
const pasteBtn = document.getElementById("pasteBtn");
const downloadBtn = document.getElementById("downloadBtn");

let videoBlob = null;
let videoUrl = null;


// =========================
// YAPIŞDIR
// =========================

pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();

    input.value = text;
    input.focus();

  } catch (error) {
    input.focus();
    alert("Linki əl ilə yapışdır.");
  }
});


// =========================
// VİDEONU TAP
// =========================

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = input.value.trim();

  if (!url) {
    alert("Video linkini daxil et.");
    return;
  }

  try {
    new URL(url);
  } catch {
    alert("Düzgün link daxil et.");
    return;
  }

  // Köhnə videonu təmizlə
  videoBlob = null;

  if (videoUrl) {
    URL.revokeObjectURL(videoUrl);
    videoUrl = null;
  }

  // Nəticəni göstər
  result.classList.remove("hidden");

  // Yüklə düyməsini gizlət
  downloadBtn.classList.add("hidden");

  // Köhnə önizləməni sil
  const oldVideo = document.getElementById("videoPreview");

  if (oldVideo) {
    oldVideo.remove();
  }

  // Yüklənir
  resultText.innerHTML =
    '<div class="loading-spinner"></div> Video hazırlanır...';

  try {

    const response = await fetch(
      "https://video-backend-cgkh.onrender.com/api/download",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          url: url
        })
      }
    );

    if (!response.ok) {
      throw new Error("Video tapılmadı.");
    }

    // Videonu yadda saxla
    videoBlob = await response.blob();

    // Video URL
    videoUrl = URL.createObjectURL(videoBlob);

    // Video önizləməsi yarat
    const video = document.createElement("video");

    video.id = "videoPreview";
    video.src = videoUrl;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.style.width = "100%";
    video.style.maxWidth = "500px";
    video.style.borderRadius = "16px";
    video.style.marginTop = "15px";
    video.style.display = "block";
    video.style.marginLeft = "auto";
    video.style.marginRight = "auto";

    // Önizləməni əlavə et
    resultText.innerHTML =
      "✅ Video tapıldı! Aşağıdan videoya baxa bilərsən.";

    result.appendChild(video);

    // Yüklə düyməsini göstər
    downloadBtn.classList.remove("hidden");

  } catch (error) {

    console.error(error);

    videoBlob = null;

    resultText.textContent =
      "❌ Video yüklənmədi. Linki yoxla və yenidən cəhd et.";
  }
});


// =========================
// YÜKLƏ
// =========================

downloadBtn.addEventListener("click", async () => {

  if (!videoBlob) {
    alert("Əvvəlcə videonu tap.");
    return;
  }

  const downloadUrl = URL.createObjectURL(videoBlob);

  // iPhone / iOS
  if (navigator.share) {

    try {

      const file = new File(
        [videoBlob],
        "video.mp4",
        {
          type: "video/mp4"
        }
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {

        await navigator.share({
          files: [file],
          title: "Video",
          text: "Video"
        });

        URL.revokeObjectURL(downloadUrl);

        return;
      }

    } catch (error) {

      console.log("Paylaşma bağlandı və ya ləğv edildi.");

    }
  }

  // Android / digər brauzerlər
  const a = document.createElement("a");

  a.href = downloadUrl;
  a.download = "video.mp4";

  document.body.appendChild(a);

  a.click();

  a.remove();

  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 3000);

});
