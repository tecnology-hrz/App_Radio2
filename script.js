const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const radioStream = document.getElementById('radioStream');
const volumeSlider = document.getElementById('volumeSlider');
const status = document.getElementById('status');
const nowPlaying = document.getElementById('nowPlaying');

let isPlaying = false;
let currentStreamIndex = 0;

// URLs posibles del stream de Azura Cast
const streamUrls = [
    'https://a7.asurahosting.com/public/conexi%C3%B3n_celestial_est%C3%A9reo_/stream',
    'https://a7.asurahosting.com/public/conexi%C3%B3n_celestial_est%C3%A9reo_/radio.mp3',
    'https://a7.asurahosting.com/listen/conexi%C3%B3n_celestial_est%C3%A9reo_/stream',
    'https://a7.asurahosting.com:8000/stream',
    'https://a7.asurahosting.com/radio/8000/radio.mp3'
];

// Configurar volumen inicial
radioStream.volume = 0.7;

playBtn.addEventListener('click', togglePlay);
volumeSlider.addEventListener('input', adjustVolume);

function tryNextStream() {
    if (currentStreamIndex < streamUrls.length) {
        const url = streamUrls[currentStreamIndex];
        console.log('Probando stream:', url);
        status.textContent = `Probando conexión ${currentStreamIndex + 1}/${streamUrls.length}...`;

        radioStream.src = url;
        radioStream.load();

        return radioStream.play().then(() => {
            playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
            playBtn.classList.add('playing');
            status.textContent = 'Reproduciendo en vivo';
            nowPlaying.textContent = 'Conexión Celestial Estéreo - En vivo';
            isPlaying = true;
            console.log('Stream funcionando:', url);
        }).catch(error => {
            console.log('Stream falló:', url, error);
            currentStreamIndex++;
            if (currentStreamIndex < streamUrls.length) {
                return tryNextStream();
            } else {
                throw new Error('Ningún stream disponible');
            }
        });
    } else {
        throw new Error('No hay más streams para probar');
    }
}

function togglePlay() {
    if (isPlaying) {
        radioStream.pause();
        playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        playBtn.classList.remove('playing');
        status.textContent = 'Detenido';
        nowPlaying.textContent = 'Presiona play para escuchar';
        isPlaying = false;
        
        // Detener animación periódica cuando se pausa
        detenerAnimacionPeriodica();
    } else {
        currentStreamIndex = 0;
        tryNextStream().then(() => {
            // Iniciar animación periódica cuando se reproduce exitosamente
            iniciarAnimacionPeriodica();
        }).catch(error => {
            console.error('Error al reproducir:', error);
            status.textContent = 'Error: No se pudo conectar a ningún stream';
            nowPlaying.textContent = 'Verifica tu conexión a internet';
            playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
            playBtn.classList.remove('playing');
            
            // Asegurar que no se inicie la animación si hay error
            detenerAnimacionPeriodica();
        });
    }
}

function adjustVolume() {
    const volume = volumeSlider.value / 100;
    radioStream.volume = volume;
}

// Eventos del audio
radioStream.addEventListener('loadstart', () => {
    status.textContent = 'Conectando...';
});

radioStream.addEventListener('canplay', () => {
    status.textContent = 'Listo para reproducir';
});

radioStream.addEventListener('error', () => {
    status.textContent = 'Error de conexión';
    nowPlaying.textContent = 'No se pudo conectar al stream';
    if (isPlaying) {
        playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
        playBtn.classList.remove('playing');
        isPlaying = false;
    }
});

// Simular información de "ahora suena"
function updateNowPlaying() {
    if (isPlaying) {
        const songs = [
            'Conexión Celestial Estéreo - Música en vivo',
            'Transmisión en directo',
            'Tu estación favorita',
            'Conectado a Conexión Celestial'
        ];
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        nowPlaying.textContent = randomSong;
    }
}

// Actualizar cada 30 segundos
setInterval(updateNowPlaying, 30000);

// Función para abrir WhatsApp y pedir canción
function abrirWhatsAppPedirCancion() {
    const numeroWhatsApp = '573148348401 '; // Número sin el +
    const mensaje = 'Hola Conexión Celestial! 🎵 Me gustaría pedir una canción para la radio.';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    // Abrir WhatsApp en una nueva ventana
    window.open(urlWhatsApp, '_blank');
}

// Función para mostrar la animación flotante
function mostrarAnimacionFlotante() {
    const animacion = document.getElementById('floatingRequestAnimation');
    animacion.classList.add('show');
    
    // Ocultar automáticamente después de 8 segundos
    setTimeout(() => {
        if (animacion.classList.contains('show')) {
            animacion.classList.remove('show');
        }
    }, 8000);
}

// Función para cerrar la animación flotante
function cerrarAnimacionFlotante() {
    const animacion = document.getElementById('floatingRequestAnimation');
    animacion.classList.remove('show');
}

// Mostrar la animación cada 2 minutos (120000 ms) cuando la radio esté reproduciendo
let animacionInterval;

function iniciarAnimacionPeriodica() {
    // Limpiar intervalo anterior si existe
    if (animacionInterval) {
        clearInterval(animacionInterval);
    }
    
    // Mostrar primera animación después de 30 segundos
    setTimeout(mostrarAnimacionFlotante, 30000);
    
    // Luego mostrar cada 2 minutos
    animacionInterval = setInterval(mostrarAnimacionFlotante, 120000);
}

function detenerAnimacionPeriodica() {
    if (animacionInterval) {
        clearInterval(animacionInterval);
        animacionInterval = null;
    }
    
    // Ocultar animación si está visible
    const animacion = document.getElementById('floatingRequestAnimation');
    animacion.classList.remove('show');
}

// Funciones para navegación por pestañas
function switchTab(tabName) {
    // Remover clase active de todas las pestañas
    document.querySelectorAll('.nav-item').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Activar pestaña seleccionada
    event.target.closest('.nav-item').classList.add('active');
    document.getElementById(tabName + '-tab').classList.add('active');

    // Cargar podcasts si es la primera vez que se abre la pestaña
    if (tabName === 'podcasts' && !window.podcastsLoaded) {
        loadPodcasts();
        window.podcastsLoaded = true;
    }
}

// Configuración de la playlist de YouTube
const PLAYLIST_ID = 'PLr32YwjXTwdd7qAhQItaKDr1F-jM8F9zZ';

// Variable para el reproductor actual
let currentVideoPlayer = null;

// Función para cargar podcasts desde YouTube
async function loadPodcasts() {
    const podcastsContainer = document.getElementById('podcasts-container');
    
    // Mostrar loading
    podcastsContainer.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Cargando podcasts cristianos...</p>
        </div>
    `;

    try {
        const podcasts = await fetchYouTubePodcasts();
        displayPodcasts(podcasts);

    } catch (error) {
        console.error('Error cargando podcasts:', error);
        podcastsContainer.innerHTML = `
            <div class="loading">
                <p style="color: #ffab91;">Error al cargar podcasts. Intenta nuevamente.</p>
                <button class="refresh-btn" onclick="loadPodcasts()" style="margin-top: 15px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                    </svg>
                </button>
            </div>
        `;
    }
}

// Función para obtener videos de YouTube usando método alternativo
async function fetchYouTubePodcasts() {
    try {
        // Intentar obtener datos de la playlist real usando diferentes métodos
        console.log('Intentando cargar playlist:', PLAYLIST_ID);
        
        // Método 1: Intentar con noembed
        try {
            const noembed = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/playlist?list=${PLAYLIST_ID}`);
            if (noembed.ok) {
                const data = await noembed.json();
                console.log('Datos de noembed:', data);
            }
        } catch (e) {
            console.log('Noembed falló:', e);
        }

        // Método 2: Intentar con una API alternativa para obtener información básica
        try {
            const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`;
            const rssResponse = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
            
            if (rssResponse.ok) {
                const rssData = await rssResponse.json();
                console.log('Datos RSS:', rssData);
                
                if (rssData.items && rssData.items.length > 0) {
                    return rssData.items.map(item => {
                        // Extraer ID del video de la URL
                        const videoId = item.link.match(/v=([^&]+)/)?.[1] || '';
                        return {
                            id: videoId,
                            title: item.title,
                            description: item.description || 'Contenido cristiano de Puerto Celestial',
                            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                            publishedAt: new Date(item.pubDate).toLocaleDateString('es-ES'),
                            channelTitle: 'Conexión Celestial'
                        };
                    });
                }
            }
        } catch (e) {
            console.log('RSS falló:', e);
        }

        // Si todos los métodos fallan, usar datos estáticos
        console.log('Usando datos estáticos como respaldo');
        return getStaticPlaylistData();
        
    } catch (error) {
        console.error('Error fetching playlist:', error);
        return getStaticPlaylistData();
    }
}

// Datos de respaldo - Se actualizarán con los videos reales de la playlist
function getStaticPlaylistData() {
    return [
        {
            id: 'dmUen41230o',
            title: 'Video de la Playlist - Conexión Celestial',
            description: 'Contenido cristiano de la playlist de Conexión Celestial Estéreo.',
            thumbnail: 'https://img.youtube.com/vi/dmUen41230o/maxresdefault.jpg',
            publishedAt: new Date().toLocaleDateString('es-ES'),
            channelTitle: 'Conexión Celestial'
        }
    ];
}

function displayPodcasts(podcastItems) {
    const podcastsContainer = document.getElementById('podcasts-container');
    
    if (podcastItems.length === 0) {
        podcastsContainer.innerHTML = `
            <div class="loading">
                <p>No hay podcasts disponibles en este momento.</p>
            </div>
        `;
        return;
    }

    const podcastsHTML = podcastItems.map(item => `
        <div class="podcast-item" onclick="playPodcastVideo('${item.id}', '${item.title.replace(/'/g, "\\'")}')">
            <div class="podcast-thumbnail" style="background-image: url('${item.thumbnail}')">
                <div class="podcast-play-icon">▶</div>
            </div>
            <div class="podcast-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="podcast-meta">
                    <span class="podcast-source">${item.channelTitle}</span>
                    <span class="podcast-date">${item.publishedAt}</span>
                </div>
            </div>
        </div>
    `).join('');

    podcastsContainer.innerHTML = podcastsHTML;
}

// Función para reproducir video integrado en la app
function playPodcastVideo(videoId, title) {
    // Pausar la radio si está reproduciéndose
    if (isPlaying) {
        togglePlay();
    }
    
    // Cerrar reproductor anterior si existe
    if (currentVideoPlayer) {
        currentVideoPlayer.remove();
    }
    
    // Crear reproductor de video integrado
    const playerHTML = `
        <div id="video-player-overlay" class="video-player-overlay">
            <div class="video-player-container">
                <div class="video-player-header">
                    <h3>${title}</h3>
                    <button class="close-player-btn" onclick="closeVideoPlayer()">✕</button>
                </div>
                <div class="video-player-wrapper">
                    <iframe 
                        id="youtube-player"
                        width="100%" 
                        height="315" 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                        title="${title}"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        </div>
    `;
    
    // Agregar el reproductor al DOM
    document.body.insertAdjacentHTML('beforeend', playerHTML);
    currentVideoPlayer = document.getElementById('video-player-overlay');
}

// Función para cerrar el reproductor de video
function closeVideoPlayer() {
    if (currentVideoPlayer) {
        currentVideoPlayer.remove();
        currentVideoPlayer = null;
    }
}

// Cargar podcasts al iniciar la aplicación
window.addEventListener('load', () => {
    setTimeout(() => {
        if (document.getElementById('podcasts-tab').classList.contains('active')) {
            loadPodcasts();
            window.podcastsLoaded = true;
        }
    }, 1000);
});
