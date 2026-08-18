// --- 1. Background Particles ---
function createParticles() {
    const container = document.getElementById('particles-container');
    const symbols = ['ॐ', '✨', '•'];
    for(let i=0; i<30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 10 + 10) + 's';
        p.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(p);
    }
}
createParticles();

// --- 2. Live Clock & Devotees Counter ---
function updateClock() {
    const now = new Date();
    document.getElementById('live-clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
setInterval(updateClock, 1000);
updateClock();

function updateDevotees() {
    const el = document.getElementById('devotees-number');
    let current = parseInt(el.innerText);
    // Random walk between 108 and 999
    current += Math.floor(Math.random() * 5) - 2; 
    if(current < 108) current = 108;
    if(current > 999) current = 999;
    el.innerText = current;
}
setInterval(updateDevotees, 5000);

// --- 3. Deity & Shloka Carousel (Synced) ---
const deities = [
    { name: "गणेश — Ganesh", img: "images/ganesh.jpg", shloka: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ — Bow to Lord Ganesha" },
    { name: "राधा कृष्ण — Radha Krishna", img: "images/radha-krishna.jpg", shloka: "हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हारे" },
    { name: "शिव — Shiv", img: "images/shiv.jpg", shloka: "ॐ नमः शिवाय — The five-syllable mantra of Shiva" },
    { name: "हनुमान — Hanuman", img: "images/hanuman.jpg", shloka: "जय हनुमान ज्ञान गुण सागर" },
    { name: "दुर्गा — Durga", img: "images/durga.jpg", shloka: "या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता" },
    { name: "सरस्वती — Saraswati", img: "images/saraswati.jpg", shloka: "सरस्वति नमस्तुभ्यं वरदे कामरूपिणी" }
];
let deityIndex = 0;
const deityImg = document.getElementById('deity-image');
const deityName = document.getElementById('deity-name');
const shlokaEl = document.getElementById('shloka-text');

setInterval(() => {
    // Fade out both
    deityImg.style.opacity = 0;
    deityName.style.opacity = 0;
    shlokaEl.classList.remove('fade-in');
    shlokaEl.classList.add('fade-out');

    setTimeout(() => {
        deityIndex = (deityIndex + 1) % deities.length;
        
        // Update content
        deityImg.src = deities[deityIndex].img;
        deityName.innerText = deities[deityIndex].name;
        shlokaEl.innerText = deities[deityIndex].shloka;

        // Fade in both
        deityImg.style.opacity = 1;
        deityName.style.opacity = 1;
        shlokaEl.classList.remove('fade-out');
        shlokaEl.classList.add('fade-in');
    }, 1000);
}, 6000);

// --- 5. Tabs Logic ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// Helper format time
function formatTime(seconds) {
    if(isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s<10?'0':''}${s}`;
}

// --- 6. YouTube Player Logic ---
let YOUTUBE_PLAYLIST = [
    { id: "3NiGrQ8A6GQ", title: "Ganesh Aarti", artist: "Devotional" },
    { id: "hkUCCqWdFuI", title: "Hare Krishna Kirtan", artist: "ISKCON" },
    { id: "5Xjn9pUEYZg", title: "Om Namah Shivaya", artist: "Anuradha Paudwal" },
    { id: "ajPj16BQn_4", title: "Hanuman Chalisa", artist: "Hariharan" },
    { id: "7cEQI6_6LWs", title: "Durga Aarti", artist: "Devotional" },
    { id: "T5HxSj9aFUY", title: "Saraswati Vandana", artist: "Classical" },
    { id: "YNIB5i7Q0EY", title: "Jai Shri Ram", artist: "Devotional" },
    { id: "pUGiP9K4zTo", title: "Radha Krishna Bhajan", artist: "Devotional" },
    { id: "6UrVoRr9l8k", title: "Shiv Tandav", artist: "Classical" },
    { id: "RQ0sM2nInXM", title: "Mahamrityunjaya Mantra", artist: "Devotional" }
];

// --- OAuth 2.0 Integration ---
const CLIENT_ID = '1094123233351-jit2eb2uj33ro9mrlmqj12h44km6c2lk.apps.googleusercontent.com'; // User provided client ID from Google Cloud Console
let tokenClient;
let accessToken = null;

// Initialize Google Identity Services
window.onload = function () {
    if(window.google) {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
            callback: (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    accessToken = tokenResponse.access_token;
                    document.getElementById('google-login-btn').style.display = 'none';
                    document.getElementById('yt-playlist-selector').style.display = 'block';
                    fetchYouTubePlaylists();
                }
            },
        });
    }
};

document.getElementById('google-login-btn').addEventListener('click', () => {
    if (CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
        alert("Please set your actual Google Client ID in script.js to use this feature!");
        return;
    }
    if (tokenClient) {
        tokenClient.requestAccessToken();
    } else {
        alert("Google Identity Services failed to load.");
    }
});

async function fetchYouTubePlaylists() {
    if (!accessToken) return;
    try {
        const res = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await res.json();
        const select = document.getElementById('playlist-select');
        
        if (data.items) {
            data.items.forEach(playlist => {
                const option = document.createElement('option');
                option.value = playlist.id;
                option.textContent = playlist.snippet.title;
                select.appendChild(option);
            });
        }
    } catch(e) {
        console.error("Failed to fetch playlists:", e);
    }
}

document.getElementById('playlist-select').addEventListener('change', async (e) => {
    if(e.target.value === 'default') {
        // Handle default reset if needed (or ignore)
        return;
    }
    await fetchVideosFromPlaylist(e.target.value);
});

async function fetchVideosFromPlaylist(playlistId) {
    if (!accessToken) return;
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await res.json();
        
        if (data.items && data.items.length > 0) {
            YOUTUBE_PLAYLIST = data.items.map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                artist: item.snippet.videoOwnerChannelTitle || "YouTube"
            }));
            
            // Reset player and play first song of the new playlist
            currentYtIndex = 0;
            ytPlayer.loadVideoById(YOUTUBE_PLAYLIST[currentYtIndex].id);
            updateYtUI();
        } else {
            alert("This playlist appears to be empty.");
        }
    } catch(e) {
        console.error("Failed to fetch videos from playlist:", e);
    }
}

let ytPlayer;
let currentYtIndex = 0;
let ytInterval;

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('yt-player-container', {
        height: '0',
        width: '0',
        videoId: YOUTUBE_PLAYLIST[0].id,
        playerVars: { 'autoplay': 0, 'controls': 0 },
        events: {
            'onReady': onYtPlayerReady,
            'onStateChange': onYtPlayerStateChange
        }
    });
}

function updateYtUI() {
    document.getElementById('yt-song-title').innerText = YOUTUBE_PLAYLIST[currentYtIndex].title;
    document.getElementById('yt-song-artist').innerText = YOUTUBE_PLAYLIST[currentYtIndex].artist;
}

function onYtPlayerReady(event) {
    updateYtUI();
    document.getElementById('yt-volume-slider').value = ytPlayer.getVolume();
}

function onYtPlayerStateChange(event) {
    const playBtn = document.getElementById('yt-play-btn');
    if (event.data == YT.PlayerState.PLAYING) {
        playBtn.innerText = '⏸';
        document.getElementById('player-card').classList.add('playing');
        ytInterval = setInterval(() => {
            const curr = ytPlayer.getCurrentTime();
            const tot = ytPlayer.getDuration();
            document.getElementById('yt-current-time').innerText = formatTime(curr);
            document.getElementById('yt-total-time').innerText = formatTime(tot);
            document.getElementById('yt-progress-bar').value = (curr / tot) * 100 || 0;
        }, 1000);
    } else {
        playBtn.innerText = '▶';
        document.getElementById('player-card').classList.remove('playing');
        clearInterval(ytInterval);
    }

    if (event.data == YT.PlayerState.ENDED) {
        ytNext();
    }
}

function ytPlayPause() {
    if(!ytPlayer) return;
    if(ytPlayer.getPlayerState() == YT.PlayerState.PLAYING) ytPlayer.pauseVideo();
    else ytPlayer.playVideo();
}

function ytNext() {
    currentYtIndex = (currentYtIndex + 1) % YOUTUBE_PLAYLIST.length;
    ytPlayer.loadVideoById(YOUTUBE_PLAYLIST[currentYtIndex].id);
    updateYtUI();
}

function ytPrev() {
    currentYtIndex = (currentYtIndex - 1 + YOUTUBE_PLAYLIST.length) % YOUTUBE_PLAYLIST.length;
    ytPlayer.loadVideoById(YOUTUBE_PLAYLIST[currentYtIndex].id);
    updateYtUI();
}

document.getElementById('yt-play-btn').addEventListener('click', ytPlayPause);
document.getElementById('yt-next-btn').addEventListener('click', ytNext);
document.getElementById('yt-prev-btn').addEventListener('click', ytPrev);

document.getElementById('yt-progress-bar').addEventListener('input', (e) => {
    if(!ytPlayer) return;
    const seekTo = (e.target.value / 100) * ytPlayer.getDuration();
    ytPlayer.seekTo(seekTo, true);
});
document.getElementById('yt-volume-slider').addEventListener('input', (e) => {
    if(ytPlayer) ytPlayer.setVolume(e.target.value);
});


// --- 7. Local Music Logic ---
let localTracks = [];
let currentLocalIndex = -1;
const localAudio = document.getElementById('local-audio-element');

async function fetchLocalMusic() {
    try {
        const res = await fetch('/api/music');
        localTracks = await res.json();
        renderLocalPlaylist();
    } catch(e) {
        console.error(e);
    }
}

function renderLocalPlaylist() {
    const container = document.getElementById('local-playlist');
    container.innerHTML = '';
    localTracks.forEach((track, index) => {
        const row = document.createElement('div');
        row.className = 'song-row' + (index === currentLocalIndex ? ' playing' : '');
        row.innerHTML = `
            <span class="play-icon">${index === currentLocalIndex ? '🔊' : '▶'}</span>
            <span class="song-name">${track.originalName}</span>
            <button class="delete-btn" title="Delete">🗑️</button>
        `;
        
        row.addEventListener('click', (e) => {
            if(e.target.classList.contains('delete-btn')) {
                deleteLocalTrack(track.filename, index);
            } else {
                playLocalTrack(index);
            }
        });
        
        container.appendChild(row);
    });
}

async function deleteLocalTrack(filename, index) {
    try {
        const res = await fetch(`/api/music/${filename}`, { method: 'DELETE' });
        if(res.ok) {
            if(index === currentLocalIndex) {
                localAudio.pause();
                currentLocalIndex = -1;
                document.getElementById('local-player-controls').style.display = 'none';
            } else if (index < currentLocalIndex) {
                currentLocalIndex--;
            }
            fetchLocalMusic();
        }
    } catch(e) { console.error(e); }
}

function playLocalTrack(index) {
    if(index < 0 || index >= localTracks.length) return;
    
    // If playing YT, pause it
    if(ytPlayer && ytPlayer.getPlayerState() == YT.PlayerState.PLAYING) {
        ytPlayer.pauseVideo();
    }

    currentLocalIndex = index;
    const track = localTracks[index];
    localAudio.src = track.url;
    localAudio.play();
    
    document.getElementById('local-player-controls').style.display = 'block';
    document.getElementById('local-song-title').innerText = track.originalName;
    renderLocalPlaylist(); // update playing styling
}

document.getElementById('local-play-btn').addEventListener('click', () => {
    if(localAudio.paused) localAudio.play();
    else localAudio.pause();
});

document.getElementById('local-next-btn').addEventListener('click', () => {
    playLocalTrack((currentLocalIndex + 1) % localTracks.length);
});

document.getElementById('local-prev-btn').addEventListener('click', () => {
    playLocalTrack((currentLocalIndex - 1 + localTracks.length) % localTracks.length);
});

localAudio.addEventListener('play', () => {
    document.getElementById('local-play-btn').innerText = '⏸';
    document.getElementById('player-card').classList.add('playing');
});

localAudio.addEventListener('pause', () => {
    document.getElementById('local-play-btn').innerText = '▶';
    document.getElementById('player-card').classList.remove('playing');
});

localAudio.addEventListener('ended', () => {
    playLocalTrack((currentLocalIndex + 1) % localTracks.length);
});

localAudio.addEventListener('timeupdate', () => {
    const curr = localAudio.currentTime;
    const tot = localAudio.duration;
    document.getElementById('local-current-time').innerText = formatTime(curr);
    document.getElementById('local-total-time').innerText = formatTime(tot);
    if(tot) {
        document.getElementById('local-progress-bar').value = (curr / tot) * 100;
    }
});

document.getElementById('local-progress-bar').addEventListener('input', (e) => {
    if(localAudio.duration) {
        localAudio.currentTime = (e.target.value / 100) * localAudio.duration;
    }
});

document.getElementById('local-volume-slider').addEventListener('input', (e) => {
    localAudio.volume = e.target.value;
});

// --- 8. Drag and Drop Logic ---
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const spinner = document.getElementById('upload-spinner');

dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if(e.dataTransfer.files.length) {
        uploadFiles(e.dataTransfer.files);
    }
});

fileInput.addEventListener('change', () => {
    if(fileInput.files.length) uploadFiles(fileInput.files);
});

async function uploadFiles(files) {
    spinner.style.display = 'block';
    
    for(let i=0; i<files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('audio', file);
        
        try {
            await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
        } catch(e) {
            console.error("Upload failed", e);
        }
    }
    
    spinner.style.display = 'none';
    fileInput.value = '';
    fetchLocalMusic();
}

// Initial fetch
fetchLocalMusic();
