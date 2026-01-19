// ==========================================
// 🔴 צעד 1: הדבק את המפתחות כאן!
// ==========================================
//
// לך ל-Supabase.com → Settings → API
// העתק את Project URL וה-anon public key
// והדבק אותם בין המירכאות למטה:

const SUPABASE_URL = 'https://zqvxvyvtabnypqgscrat.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxdnh2eXZ0YWJueXBxZ3NjcmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDUyNDIsImV4cCI6MjA4NDM4MTI0Mn0.cj9CCXFtNMyD7sKpu6XatlOyZeLlyHL0ZkfaraIzt_w';

// דוגמה איך זה צריך להיראות:
// const SUPABASE_URL = 'https://zqvxvyvtabnypqgscrat.supabase.co';
// const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxdnh2eXZ0YWJueXBxZ3NjcmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDUyNDIsImV4cCI6MjA4NDM4MTI0Mn0.cj9CCXFtNMyD7sKpu6XatlOyZeLlyHL0ZkfaraIzt_w';

// ==========================================
// אל תגע בשאר הקוד!
// ==========================================

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

let kidsData = [];
let currentIndex = 0;
let settings = { logo_garden: null, logo_personal: null };

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span style="font-size: 1.5rem;">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function loadKids() {
    try {
        const { data, error } = await supabaseClient
            .from('kids')
            .select('*')
            .order('name', { ascending: true });
        if (error) throw error;
        kidsData = data || [];
        renderGallery();
    } catch (error) {
        console.error('Error loading kids:', error);
        showToast('שגיאה בטעינת הנתונים', 'error');
    }
}

async function loadSettings() {
    try {
        const { data, error } = await supabaseClient
            .from('settings')
            .select('*')
            .limit(1)
            .single();
        
        // If no settings found, use defaults
        if (error || !data) {
            console.log('No settings found, using defaults');
            settings = { logo_garden: null, logo_personal: null };
        } else {
            settings = data || { logo_garden: null, logo_personal: null };
        }
        
        // Load garden logo
        const logoSplash = document.getElementById('logo-splash');
        const logoDetail = document.getElementById('logo-detail');
        if (settings.logo_garden && settings.logo_garden.trim() !== '') {
            console.log('Loading garden logo:', settings.logo_garden);
            if (logoSplash) {
                logoSplash.src = settings.logo_garden;
                logoSplash.style.display = 'block';
                logoSplash.onload = () => {
                    console.log('Garden logo loaded successfully (splash)');
                };
                logoSplash.onerror = () => {
                    console.error('Failed to load garden logo (splash):', settings.logo_garden);
                    logoSplash.style.display = 'none';
                };
            }
            if (logoDetail) {
                logoDetail.src = settings.logo_garden;
                logoDetail.style.display = 'block';
                logoDetail.onload = () => {
                    console.log('Garden logo loaded successfully (detail)');
                };
                logoDetail.onerror = () => {
                    console.error('Failed to load garden logo (detail):', settings.logo_garden);
                    logoDetail.style.display = 'none';
                };
            }
        } else {
            console.log('No garden logo configured');
            if (logoSplash) logoSplash.style.display = 'none';
            if (logoDetail) logoDetail.style.display = 'none';
        }
        
        // Load personal logo (Grandpa Shimon)
        const personalLogos = document.querySelectorAll('.logo-saba-target');
        if (settings.logo_personal && settings.logo_personal.trim() !== '') {
            console.log('Loading personal logo:', settings.logo_personal);
            personalLogos.forEach((el, index) => {
                el.src = settings.logo_personal;
                el.style.display = 'block';
                el.onload = () => {
                    console.log(`Personal logo loaded successfully (${index})`);
                };
                el.onerror = () => {
                    console.error(`Failed to load personal logo (${index}):`, settings.logo_personal);
                    el.style.display = 'none';
                };
            });
        } else {
            console.log('No personal logo configured');
            personalLogos.forEach(el => el.style.display = 'none');
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        settings = { logo_garden: null, logo_personal: null };
    }
}

function renderGallery() {
    const root = document.getElementById('grid-root');
    if (kidsData.length === 0) {
        root.innerHTML = '<div style="padding: 40px; color: #666;">אין ילדים להצגה</div>';
        return;
    }
    root.innerHTML = '';
    kidsData.forEach((kid, i) => {
        const card = document.createElement('div');
        card.className = 'child-card';
        card.onclick = () => showDetail(i);
        
        // Use image_after first, then image_before, then placeholder
        let imgSrc = '';
        let hasImage = false;
        
        if (kid.image_after && kid.image_after.trim() !== '') {
            imgSrc = kid.image_after;
            hasImage = true;
        } else if (kid.image_before && kid.image_before.trim() !== '') {
            imgSrc = kid.image_before;
            hasImage = true;
        } else {
            // Create a placeholder with the kid's name
            imgSrc = `https://via.placeholder.com/150/667eea/ffffff?text=${encodeURIComponent(kid.name)}`;
            console.warn(`No image found for ${kid.name} - using placeholder`);
        }
        
        // Log missing images for debugging
        if (!hasImage) {
            console.log(`Kid ${kid.name} (ID: ${kid.id}) - image_after: ${kid.image_after}, image_before: ${kid.image_before}`);
        }
        
        card.innerHTML = `
            <img src="${imgSrc}" class="card-img" alt="${kid.name}" 
                 onerror="this.src='https://via.placeholder.com/150/667eea/ffffff?text=${encodeURIComponent(kid.name)}'; console.error('Failed to load image for ${kid.name}')"
                 onload="${hasImage ? `console.log('Image loaded for ${kid.name}')` : ''}">
            <div style="font-weight:bold; margin-top:5px; font-size:0.9rem;">${kid.name}</div>
        `;
        root.appendChild(card);
    });
    setupSlider();
}

function showDetail(index) {
    if (index < 0 || index >= kidsData.length) return;
    currentIndex = index;
    const kid = kidsData[index];
    document.getElementById('kid-title').innerText = `היצירה של ${kid.name}`;
    
    // Update URL without reloading
    const shareUrl = `${window.location.origin}${window.location.pathname}?kid=${encodeURIComponent(kid.name)}`;
    window.history.pushState({ kid: kid.name }, '', shareUrl);
    
    // Handle before image
    const beforeImgEl = document.getElementById('view-before');
    const beforeWrap = document.getElementById('view-before-wrap');
    if (kid.image_before && kid.image_before.trim() !== '') {
        beforeImgEl.src = kid.image_before;
        beforeImgEl.onerror = () => {
            beforeImgEl.src = `https://via.placeholder.com/400/667eea/ffffff?text=${encodeURIComponent('תמונה לפני')}`;
        };
        beforeWrap.style.display = 'block';
    } else {
        beforeImgEl.src = `https://via.placeholder.com/400/667eea/ffffff?text=${encodeURIComponent('אין תמונה לפני')}`;
        beforeWrap.style.display = 'block';
    }
    
    // Handle after image
    const afterImgEl = document.getElementById('view-after');
    if (kid.image_after && kid.image_after.trim() !== '') {
        afterImgEl.src = kid.image_after;
        afterImgEl.onerror = () => {
            afterImgEl.src = `https://via.placeholder.com/400/667eea/ffffff?text=${encodeURIComponent('תמונה אחרי')}`;
        };
    } else {
        afterImgEl.src = `https://via.placeholder.com/400/667eea/ffffff?text=${encodeURIComponent('אין תמונה אחרי')}`;
    }
    
    // Handle video
    const videoEl = document.getElementById('view-video');
    if (kid.video_url && kid.video_url.trim() !== '') {
        videoEl.src = kid.video_url;
        videoEl.style.display = 'block';
        videoEl.onerror = () => {
            console.error('Failed to load video:', kid.video_url);
            videoEl.style.display = 'none';
        };
    } else {
        videoEl.style.display = 'none';
        videoEl.src = ''; // Clear src to stop loading
    }
    
    navTo('detail');
}

function move(direction) {
    currentIndex = (currentIndex + direction + kidsData.length) % kidsData.length;
    showDetail(currentIndex);
}

function setupSlider() {
    const root = document.getElementById('slider-root');
    const handle = document.getElementById('slider-handle');
    const wrap = document.getElementById('view-before-wrap');
    if (!root) return;
    const updatePosition = (e) => {
        const rect = root.getBoundingClientRect();
        const x = (e.pageX || (e.touches ? e.touches[0].pageX : 0)) - rect.left;
        let pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
        handle.style.left = pct + '%';
        wrap.style.width = (100 - pct) + '%';
    };
    root.onmousemove = updatePosition;
    root.ontouchmove = updatePosition;
}

function navTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    if (screenId !== 'detail') {
        document.getElementById('view-video').pause();
        // Clear URL parameter when leaving detail view
        if (window.location.search.includes('kid=')) {
            window.history.pushState({}, '', window.location.pathname);
        }
    }
}

// Share function - creates shareable link for current kid
function shareKid() {
    if (kidsData.length === 0 || currentIndex < 0 || currentIndex >= kidsData.length) {
        showToast('אין ילד נבחר לשיתוף', 'error');
        return;
    }
    
    const kid = kidsData[currentIndex];
    const shareUrl = `${window.location.origin}${window.location.pathname}?kid=${encodeURIComponent(kid.name)}`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: `היצירה של ${kid.name}`,
            text: `צפו ביצירה המדהימה של ${kid.name}!`,
            url: shareUrl
        }).catch(err => {
            console.log('Error sharing:', err);
            copyToClipboard(shareUrl);
        });
    } else {
        // Fallback to clipboard
        copyToClipboard(shareUrl);
    }
}

// Copy to clipboard helper
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('הקישור הועתק ללוח!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

// Fallback copy method
function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('הקישור הועתק ללוח!', 'success');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        // Show the URL in a prompt
        prompt('העתק את הקישור הבא:', text);
    }
    document.body.removeChild(textArea);
}

// Find kid by name
function findKidByName(name) {
    return kidsData.findIndex(kid => kid.name === name || kid.name.toLowerCase() === name.toLowerCase());
}

async function init() {
    const galleryRoot = document.getElementById('grid-root');
    galleryRoot.innerHTML = '<div class="loading-spinner"></div>';
    await Promise.all([loadSettings(), loadKids()]);
    setupSlider();
    
    // Check for kid parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const kidName = urlParams.get('kid');
    if (kidName && kidsData.length > 0) {
        const kidIndex = findKidByName(kidName);
        if (kidIndex >= 0) {
            // Small delay to ensure everything is rendered
            setTimeout(() => {
                showDetail(kidIndex);
            }, 100);
        } else {
            console.warn(`Kid "${kidName}" not found`);
            showToast(`ילד בשם "${kidName}" לא נמצא`, 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
