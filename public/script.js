document.addEventListener('DOMContentLoaded', () => {
  // Get Ngrok URL dynamically
  const baseUrl = window.location.origin;
  const streamUrl = `${baseUrl}/proxy-hls/hls/stream.m3u8`;
  
  const video = document.getElementById('streamPlayer');
  const startTimeInput = document.getElementById('startTime');
  const durationInput = document.getElementById('duration');
  const clipNameInput = document.getElementById('clipName');
  const createClipBtn = document.getElementById('createClipBtn');
  const clipResult = document.getElementById('clipResult');
  const clipPlayer = document.getElementById('clipPlayer');
  const downloadLink = document.getElementById('downloadLink');

  // Initialize HLS player
  function initPlayer() {
    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: function(xhr, url) {
          xhr.withCredentials = false; // CORS fix
        }
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        console.log('Stream loaded successfully');
      });
      hls.on(Hls.Events.ERROR, function(event, data) {
        console.error('HLS error:', data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari/iOS
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', function() {
        video.play();
      });
    }
  }

  // Initialize the player
  initPlayer();

  // Handle clip creation
  createClipBtn.addEventListener('click', async () => {
    const startTime = startTimeInput.value;
    const duration = durationInput.value;
    const clipName = clipNameInput.value || 'clip';

    if (!startTime || !duration) {
      alert('Please specify start time and duration');
      return;
    }

    createClipBtn.disabled = true;
    createClipBtn.textContent = 'Creating...';

    try {
      const response = await fetch('/create-clip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          streamUrl: streamUrl,
          startTime: startTime,
          duration: duration,
          fileName: clipName
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Clip created:', data);

      if (data.success) {
        // Update the clip player
        clipPlayer.src = data.clipUrl;
        downloadLink.href = data.clipUrl;
        downloadLink.textContent = `Download ${clipName}.mp4`;
        downloadLink.download = `${clipName}.mp4`;
        clipResult.style.display = 'block';
        
        // Auto-trigger download
        setTimeout(() => {
          downloadLink.click();
        }, 500);
      } else {
        throw new Error(data.error || 'Unknown error creating clip');
      }
    } catch (error) {
      console.error('Clip creation failed:', error);
      alert(`Clip creation failed: ${error.message}`);
    } finally {
      createClipBtn.disabled = false;
      createClipBtn.textContent = 'Create Clip';
    }
  });

  // Update start time when video is seeked
  video.addEventListener('seeked', () => {
    startTimeInput.value = Math.floor(video.currentTime);
  });
});
