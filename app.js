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
        if (error) throw error;
        settings = data || { logo_garden: null, logo_personal: null };
        if (settings.logo_garden) {
            document.getElementById('logo-splash').src = settings.logo_garden;
            document.getElementById('logo-splash').style.display = 'block';
            document.getElementById('logo-detail').src = settings.logo_garden;
            document.getElementById('logo-detail').style.display = 'block';
        }
        if (settings.logo_personal) {
            document.querySelectorAll('.logo-saba-target').forEach(el => {
                el.src = settings.logo_personal;
                el.style.display = 'block';
            });
        }
    } catch (error) {
        console.error('Error loading settings:', error);
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
        const imgSrc = kid.image_after || kid.image_before || 'https://via.placeholder.com/150?text=' + encodeURIComponent(kid.name);
        card.innerHTML = `
            <img src="${imgSrc}" class="card-img" alt="${kid.name}">
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
    const beforeImg = kid.image_before || 'https://via.placeholder.com/400?text=No+Image';
    const afterImg = kid.image_after || 'https://via.placeholder.com/400?text=No+Image';
    document.getElementById('view-before').src = beforeImg;
    document.getElementById('view-after').src = afterImg;
    const videoEl = document.getElementById('view-video');
    if (kid.video_url) {
        videoEl.src = kid.video_url;
        videoEl.style.display = 'block';
    } else {
        videoEl.style.display = 'none';
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
    }
}

async function init() {
    const galleryRoot = document.getElementById('grid-root');
    galleryRoot.innerHTML = '<div class="loading-spinner"></div>';
    await Promise.all([loadSettings(), loadKids()]);
    setupSlider();
}

document.addEventListener('DOMContentLoaded', init);
