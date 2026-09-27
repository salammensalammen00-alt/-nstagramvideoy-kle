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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = input.value.trim();

  if (!url) return;

  try {
    new URL(url);
  } catch {
    alert("Düzgün link daxil et.");
    return;
  }

  result.classList.remove("hidden");
  resultText.textContent = "Bu demo yalnız linki qəbul edir. Real video faylının hazırlanması backend/API ilə qoşulmalıdır.";
});

downloadBtn.addEventListener("click", () => {
  alert("Real yükləmə üçün backend bağlantısı hələ əlavə edilməyib.");
});
