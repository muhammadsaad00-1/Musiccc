// ============================================
// User Frontend JavaScript
// ============================================

const API_BASE = 'http://localhost:8000';
let eventsData = [];
let singersData = [];
let currentFilter = 'all';

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initFilterTabs();
    loadEvents();
    loadSingers();
});

// ============================================
// Search Functionality
// ============================================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            filterContent(query);
        });
    }
}

function filterContent(query) {
    // Filter events
    const filteredEvents = eventsData.filter(event => {
        const name = event.event_name?.toLowerCase() || '';
        const location = event.location?.toLowerCase() || '';
        const singer = event.singer_name?.toLowerCase() || '';
        return name.includes(query) || location.includes(query) || singer.includes(query);
    });
    displayEvents(filteredEvents);

    // Filter singers
    const filteredSingers = singersData.filter(singer => {
        const name = singer.name?.toLowerCase() || '';
        const genre = singer.genre?.toLowerCase() || '';
        const location = singer.location?.toLowerCase() || '';
        return name.includes(query) || genre.includes(query) || location.includes(query);
    });
    displaySingers(filteredSingers);
}

// ============================================
// Filter Tabs
// ============================================
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Apply filter
            currentFilter = tab.dataset.filter;
            applyFilter();
        });
    });
}

function applyFilter() {
    let filtered = [...eventsData];
    
    if (currentFilter === 'upcoming') {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        filtered = filtered.filter(event => {
            const eventDate = new Date(event.event_date);
            return eventDate >= now && eventDate <= nextMonth;
        });
    } else if (currentFilter === 'featured') {
        // Show first 6 as "featured"
        filtered = filtered.slice(0, 6);
    }
    
    displayEvents(filtered);
}

// ============================================
// Load Events
// ============================================
async function loadEvents() {
    console.log('Loading events...');
    try {
        const response = await fetch(`${API_BASE}/events`);
        console.log('Events response status:', response.status);
        eventsData = await response.json();
        console.log('Events data:', eventsData);
        // Sort by date (newest first)
        eventsData.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
        displayEvents(eventsData);
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('eventsGrid').innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load events. Please try again later.</p>
            </div>
        `;
    }
}

function displayEvents(events) {
    console.log('Displaying events:', events.length);
    const grid = document.getElementById('eventsGrid');
    
    if (!grid) {
        console.error('eventsGrid element not found!');
        return;
    }
    
    if (events.length === 0) {
        grid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-calendar-alt"></i>
                <p>No events found. Check back soon for exciting performances!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = events.map(event => {
        const date = new Date(event.event_date);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        const fullDate = date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="event-card" onclick="showEventDetail(${event.id})">
                <div class="event-card-header">
                    <img src="${event.image_url || 'https://via.placeholder.com/600x400?text=Event'}" 
                         alt="${event.event_name}"
                         onerror="this.src='https://via.placeholder.com/600x400?text=Event'">
                    <div class="event-date-badge">
                        <span class="day">${day}</span>
                        <span class="month">${month}</span>
                    </div>
                </div>
                <div class="event-card-body">
                    <h3 class="event-card-title">${event.event_name}</h3>
                    <div class="event-card-info">
                        <div class="event-info-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${fullDate}</span>
                        </div>
                        <div class="event-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="event-info-item">
                            <i class="fas fa-microphone"></i>
                            <span>${event.singer_name || 'Special Performance'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    console.log('Events displayed successfully');
}

// ============================================
// Load Singers
// ============================================
async function loadSingers() {
    try {
        const response = await fetch(`${API_BASE}/singers`);
        singersData = await response.json();
        displaySingers(singersData);
    } catch (error) {
        console.error('Error loading singers:', error);
        document.getElementById('singersGrid').innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load artists. Please try again later.</p>
            </div>
        `;
    }
}

function displaySingers(singers) {
    const grid = document.getElementById('singersGrid');
    
    if (singers.length === 0) {
        grid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-music"></i>
                <p>No artists available yet. Stay tuned!</p>
            </div>
        `;
        return;
    }

    // Show only featured artists (first 8)
    const featuredSingers = singers.slice(0, 8);

    grid.innerHTML = featuredSingers.map(singer => `
        <div class="singer-card">
            <div class="singer-card-image">
                <img src="${singer.image_url || 'https://via.placeholder.com/400x500?text=Artist'}" 
                     alt="${singer.name}"
                     onerror="this.src='https://via.placeholder.com/400x500?text=Artist'">
                <div class="singer-genre-badge">${singer.genre}</div>
            </div>
            <div class="singer-card-body">
                <h3 class="singer-card-name">${singer.name}</h3>
                <div class="singer-card-details">
                    <div class="singer-detail-item">
                        <i class="fas fa-music"></i>
                        <span>${singer.genre} Artist</span>
                    </div>
                    <div class="singer-detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${singer.experience_years} years of experience</span>
                    </div>
                    <div class="singer-detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${singer.location}</span>
                    </div>
                    <div class="singer-detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Starting at $${singer.base_price}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Show Event Detail Modal
// ============================================
function showEventDetail(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return;

    const date = new Date(event.event_date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const modalContent = document.getElementById('eventDetailContent');
    modalContent.innerHTML = `
        <div style="position: relative; height: 400px; overflow: hidden; border-radius: 16px 16px 0 0;">
            <img src="${event.image_url || 'https://via.placeholder.com/900x400?text=Event'}" 
                 alt="${event.event_name}"
                 style="width: 100%; height: 100%; object-fit: cover;"
                 onerror="this.src='https://via.placeholder.com/900x400?text=Event'">
        </div>
        <div style="padding: 2rem;">
            <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem; color: var(--text-primary);">
                ${event.event_name}
            </h2>
            <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2rem;">
                <div style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem;">
                    <i class="fas fa-calendar-alt" style="color: var(--primary-light); font-size: 1.5rem; width: 30px;"></i>
                    <span style="color: var(--text-secondary);">${formattedDate}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem;">
                    <i class="fas fa-map-marker-alt" style="color: var(--primary-light); font-size: 1.5rem; width: 30px;"></i>
                    <span style="color: var(--text-secondary);">${event.location}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem; font-size: 1.125rem;">
                    <i class="fas fa-microphone" style="color: var(--primary-light); font-size: 1.5rem; width: 30px;"></i>
                    <span style="color: var(--text-secondary);">Featuring: ${event.singer_name || 'Special Guest'}</span>
                </div>
            </div>
            <div style="padding-top: 2rem; border-top: 1px solid var(--border-color);">
                <p style="color: var(--text-secondary); line-height: 1.8; font-size: 1.125rem; margin-bottom: 2rem;">
                    Don't miss this incredible live performance! Experience unforgettable music and entertainment 
                    in an amazing venue. Book your tickets now before they sell out!
                </p>
                <button class="btn-primary" style="width: 100%; padding: 1.25rem; font-size: 1.125rem;">
                    <i class="fas fa-ticket-alt"></i> Book Tickets
                </button>
            </div>
        </div>
    `;

    const modal = document.getElementById('eventDetailModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
