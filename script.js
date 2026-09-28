const form = document.getElementById("downloadForm");
const input = document.getElementById("urlInput");
const result = document.getElementById("result");
const resultText = document.getElementById("resultText");
const pasteBtn = document.getElementById("pasteBtn");
const downloadBtn = document.getElementById("downloadBtn");

let currentDownloadUrl = null;


// YAPIŞDIR düyməsi
pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();

    input.value = text;
    input.focus();

  } catch (error) {
    input.focus();

    alert(
      "Clipboard icazəsi verilmədi. Linki əl ilə yapışdır."
    );
  }
});


// VİDEONU TAP düyməsi
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = input.value.trim();

  // Link boşdursa
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

  // Köhnə linki təmizlə
  if (currentDownloadUrl) {
    URL.revokeObjectURL(currentDownloadUrl);
    currentDownloadUrl = null;
  }

  // Nəticə bölməsini göstər
  result.classList.remove("hidden");

  // Yüklənmə animasiyası
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


    // Server səhv qaytarıbsa
    if (!response.ok) {
      throw new Error("Video yüklənə bilmədi.");
    }


    // Videonu götür
    const blob = await response.blob();


    // Yükləmə linkini hazırla
    currentDownloadUrl = URL.createObjectURL(blob);


    // Hazır olduğunu göstər
    resultText.textContent =
      "Video hazırdır! Aşağıdakı «Yüklə» düyməsinə bas.";


  } catch (error) {

    console.error(error);

    resultText.textContent =
      "Video yüklənmədi. Linki yoxla və yenidən cəhd et.";
  }
});


// YÜKLƏ düyməsi
downloadBtn.addEventListener("click", () => {

  if (!currentDownloadUrl) {
    alert("Əvvəlcə videonu tap.");
    return;
  }


  const a = document.createElement("a");

  a.href = currentDownloadUrl;

  a.download = "video.mp4";

  document.body.appendChild(a);

  a.click();

  a.remove();
});
