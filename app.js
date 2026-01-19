// ==========================================
// Supabase Configuration
// ==========================================
// 🔴 חשוב! החלף את הערכים האלה בערכים שלך מ-Supabase
const SUPABASE_URL = 'YOUR_PROJECT_URL';  // https://zqvxvyvtabnypqgscrat.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'; // sb_publishable_rbpfGQKxQ0yOF2uycKZB4g_FWCdSt80

// יצירת Client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// Global State
// ==========================================
let kidsData = [];
let currentIndex = 0;
let settings = { logo_garden: null, logo_personal: null };

// ==========================================
// Toast Notifications
// ==========================================
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

// ==========================================
// Data Loading Functions
// ==========================================

// טעינת כל הילדים מהדאטאבייס
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

// טעינת הגדרות (לוגואים)
async function loadSettings() {
    try {
        const { data, error } = await supabaseClient
            .from('settings')
            .select('*')
            .limit(1)
            .single();
        
        if (error) throw error;
        
        settings = data || { logo_garden: null, logo_personal: null };
        
        // עדכון הלוגואים בממשק
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

// ==========================================
// Gallery Rendering
// ==========================================
function renderGallery() {
    const root = document.getElementById('grid-root');
    
    if (kidsData.length === 0) {
        root.innerHTML = '<div style="padding: 40px; color: #666;">אין ילדים להצגה. פנה למנהל המערכת.</div>';
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

// ==========================================
// Detail View
// ==========================================
function showDetail(index) {
    if (index < 0 || index >= kidsData.length) return;
    
    currentIndex = index;
    const kid = kidsData[index];
    
    document.getElementById('kid-title').innerText = `היצירה של ${kid.name}`;
    
    // תמונות
    const beforeImg = kid.image_before || 'https://via.placeholder.com/400?text=No+Image';
    const afterImg = kid.image_after || 'https://via.placeholder.com/400?text=No+Image';
    
    document.getElementById('view-before').src = beforeImg;
    document.getElementById('view-after').src = afterImg;
    
    // וידאו
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

// ==========================================
// Slider Functionality
// ==========================================
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

// ==========================================
// Navigation
// ==========================================
function navTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    
    if (screenId !== 'detail') {
        document.getElementById('view-video').pause();
    }
}

// ==========================================
// Initialization
// ==========================================
async function init() {
    // הצג spinner
    const galleryRoot = document.getElementById('grid-root');
    galleryRoot.innerHTML = '<div class="loading-spinner"></div>';
    
    // טען נתונים
    await Promise.all([
        loadSettings(),
        loadKids()
    ]);
    
    // הגדר Slider
    setupSlider();
}

// טען את האפליקציה כשהדף מוכן
document.addEventListener('DOMContentLoaded', init);

// ==========================================
// Real-time Updates (Optional)
// ==========================================
// אם תרצה עדכונים חיים כשמישהו מוסיף ילד חדש:
/*
supabaseClient
    .channel('kids-changes')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'kids' },
        (payload) => {
            console.log('Change detected:', payload);
            loadKids(); // רענן את הגלריה
        }
    )
    .subscribe();
*/
