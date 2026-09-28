const form = document.getElementById("downloadForm");
const input = document.getElementById("urlInput");
const result = document.getElementById("result");
const resultText = document.getElementById("resultText");
const pasteBtn = document.getElementById("pasteBtn");
const downloadBtn = document.getElementById("downloadBtn");

pasteBtn.addEventListener("click", async () => {
  try {
    input.value = await navigator.clipboard.readText();
    input.focus();
  } catch {
    input.focus();
    alert("Clipboard icazəsi verilmədi. Linki əl ilə yapışdır.");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = input.value.trim();

  if (!url) return;

  try {
    new URL(url);
  } catch {
    alert("Düzgün link daxil et.");
    return;
  resultText.innerHTML = '<div class="loading-spinner"></div> Video hazırlanır...';
result.classList.remove("hidden");

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
        throw new Error("Video yüklənə bilmədi.");
    }

    const blob = await response.blob();

    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = downloadUrl;
    a.download = "video.mp4";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(downloadUrl);

    resultText.textContent = "Video uğurla yükləndi!";
} catch (error) {
    console.error(error);
    resultText.textContent = "Video yüklənmədi. Linki yoxla və yenidən cəhd et.";
}
});
