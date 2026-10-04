document.addEventListener('DOMContentLoaded', () => {
    const downloadForm = document.getElementById('downloadForm');
    const urlInput = document.getElementById('urlInput');
    const pasteBtn = document.getElementById('pasteBtn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const resultText = document.getElementById('resultText');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentBlobUrl = null;
    let currentFileName = 'video.mp4';

    // Yapışdır düyməsi
    if (pasteBtn) {
        pasteBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                urlInput.value = text;
            } catch (err) {
                alert('Panodakı mətni oxumaq mümkün olmadı. Zəhmət olmasa linki əllə yapışdırın.');
            }
        });
    }

    // Form göndəriləndə (🎬 Videonu tap düyməsinə basılanda)
    if (downloadForm) {
        downloadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const url = urlInput.value.trim();
            if (!url) {
                alert('Zəhmət olmasa bir link daxil edin!');
                return;
            }

            // Təmizlik
            if (currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl);
                currentBlobUrl = null;
            }
            resultText.innerHTML = '';
            result.classList.add('hidden');
            downloadBtn.classList.add('hidden');
            loading.style.display = 'block';

            try {
                const response = await fetch('https://video-backend-cgkh.onrender.com/api/download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url: url })
                });

                if (!response.ok) {
                    throw new Error('Video tapılmadı və ya xəta baş verdi.');
                }

                const blob = await response.blob();
                currentBlobUrl = URL.createObjectURL(blob);

                // Video Preview
                const videoElement = document.createElement('video');
                videoElement.id = 'videoPreview';
                videoElement.controls = true;
                videoElement.playsInline = true;
                videoElement.preload = 'metadata';
                videoElement.src = currentBlobUrl;
                videoElement.style.width = '100%';
                videoElement.style.borderRadius = '12px';
                videoElement.style.marginTop = '15px';

                resultText.appendChild(videoElement);

                // Nəticəni və Yüklə düyməsini göstər
                result.classList.remove('hidden');
                downloadBtn.classList.remove('hidden');

            } catch (error) {
                alert(error.message || 'Xəta baş verdi. Zəhmət olmasa linki yoxlayıb yenidən cəhd edin.');
            } finally {
                loading.style.display = 'none';
            }
        });
    }

    // Yüklə düyməsinə basılanda (⬇️ Videonu yüklə)
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            if (!currentBlobUrl) return;

            // iOS / iPhone dəstəyi
            if (navigator.share && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                try {
                    const file = new File([await fetch(currentBlobUrl).then(r => r.blob())], currentFileName, { type: 'video/mp4' });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            files: [file],
                            title: 'Video Yüklə',
                        });
                        return;
                    }
                } catch (e) {
                    console.log('Share ləğv edildi və ya dəstəklənmədi');
                }
            }

            // Digər cihazlar üçün standart indirmə
            const a = document.createElement('a');
            a.href = currentBlobUrl;
            a.download = currentFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }
});

