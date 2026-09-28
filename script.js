const form = document.getElementById("downloadForm");
const input = document.getElementById("urlInput");
const result = document.getElementById("result");
const resultText = document.getElementById("resultText");
const pasteBtn = document.getElementById("pasteBtn");
const downloadBtn = document.getElementById("downloadBtn");

let videoBlob = null;


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


  // Linki yoxla
  try {
    new URL(url);
  } catch {
    alert("Düzgün link daxil et.");
    return;
  }


  // Köhnə videonu təmizlə
  videoBlob = null;


  // Nəticəni göstər
  result.classList.remove("hidden");


  // Yüklənmə yazısı
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


    // Hazırdır
    resultText.textContent =
      "Video hazırdır! «Yüklə» düyməsinə bas.";


  } catch (error) {

    console.error(error);

    videoBlob = null;

    resultText.textContent =
      "Video yüklənmədi. Linki yoxla və yenidən cəhd et.";
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


  // Mobil cihaz üçün video linki yarat
  const videoUrl = URL.createObjectURL(videoBlob);


  // iPhone üçün paylaşma funksiyasını yoxla
  if (navigator.share) {

    try {

      const file = new File(
        [videoBlob],
        "video.mp4",
        {
          type: "video/mp4"
        }
      );


      // Fayl paylaşmaq mümkündürsə
      if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {

        await navigator.share({
          files: [file],
          title: "Video",
          text: "Video"
        });

        URL.revokeObjectURL(videoUrl);

        return;
      }

    } catch (error) {

      // İstifadəçi paylaşmanı bağlayıbsa
      console.log("Paylaşma bağlandı.");
    }
  }


  // Android və digər brauzerlər
  const a = document.createElement("a");

  a.href = videoUrl;
  a.download = "video.mp4";

  document.body.appendChild(a);

  a.click();

  a.remove();


  // Linki bir az sonra sil
  setTimeout(() => {
    URL.revokeObjectURL(videoUrl);
  }, 3000);

});
