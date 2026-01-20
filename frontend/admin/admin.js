// ============================================
// Admin Dashboard JavaScript
// ============================================

const API_BASE = 'http://localhost:8000';
let singersData = [];
let eventsData = [];

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFilePreview();
    loadSingers();
    loadEvents();
    loadSingersForEventDropdown();
});

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
        });
    });
}

function switchSection(sectionName) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');

    // Update sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`)?.classList.add('active');
}

// ============================================
// Modal Functions
// ============================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Reset form
    const form = modal.querySelector('form');
    if (form) {
        form.reset();
        // Clear image previews
        modal.querySelectorAll('.image-preview').forEach(preview => {
            preview.classList.remove('active');
            preview.innerHTML = '';
        });
    }
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
// Image Preview
// ============================================
function initFilePreview() {
    // Singer image preview
    const singerImageInput = document.getElementById('singerImage');
    if (singerImageInput) {
        singerImageInput.addEventListener('change', (e) => {
            handleImagePreview(e.target, 'singerImagePreview');
        });
    }

    // Event image preview
    const eventImageInput = document.getElementById('eventImage');
    if (eventImageInput) {
        eventImageInput.addEventListener('change', (e) => {
            handleImagePreview(e.target, 'eventImagePreview');
        });
    }
}

function handleImagePreview(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }
}

// ============================================
// Toast Notifications
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} active`;
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
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
        showToast('Failed to load singers', 'error');
    }
}

function displaySingers(singers) {
    const grid = document.getElementById('singersGrid');
    
    if (singers.length === 0) {
        grid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-music"></i>
                <p>No singers added yet. Click "Add Singer" to get started!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = singers.map(singer => `
        <div class="card">
            <div class="card-image">
                <img src="${singer.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}" 
                     alt="${singer.name}"
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="card-badge">${singer.genre}</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${singer.name}</h3>
                <div class="card-meta">
                    <div class="card-meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${singer.experience_years} years exp</span>
                    </div>
                    <div class="card-meta-item">
                        <i class="fas fa-dollar-sign"></i>
                        <span>$${singer.base_price}</span>
                    </div>
                </div>
                <div class="card-meta">
                    <div class="card-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${singer.location}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-delete" onclick="deleteSinger(${singer.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Load Events
// ============================================
async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE}/events`);
        eventsData = await response.json();
        displayEvents(eventsData);
    } catch (error) {
        console.error('Error loading events:', error);
        showToast('Failed to load events', 'error');
    }
}

function displayEvents(events) {
    const grid = document.getElementById('eventsGrid');
    
    if (events.length === 0) {
        grid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-calendar-alt"></i>
                <p>No events added yet. Click "Add Event" to get started!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = events.map(event => {
        const date = new Date(event.event_date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });

        return `
            <div class="card">
                <div class="card-image">
                    <img src="${event.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}" 
                         alt="${event.event_name}"
                         onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${event.event_name}</h3>
                    <div class="card-meta">
                        <div class="card-meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="card-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                    </div>
                    <div class="card-meta">
                        <div class="card-meta-item">
                            <i class="fas fa-microphone"></i>
                            <span>${event.singer_name || 'Unknown Artist'}</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn-delete" onclick="deleteEvent(${event.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// Load Singers for Event Dropdown
// ============================================
async function loadSingersForEventDropdown() {
    try {
        const response = await fetch(`${API_BASE}/singers`);
        const singers = await response.json();
        const select = document.getElementById('eventSingerSelect');
        
        if (singers.length === 0) {
            select.innerHTML = '<option value="">No singers available - add singers first</option>';
        } else {
            select.innerHTML = `
                <option value="">Select a singer</option>
                ${singers.map(singer => `
                    <option value="${singer.id}">${singer.name} (${singer.genre})</option>
                `).join('')}
            `;
        }
    } catch (error) {
        console.error('Error loading singers for dropdown:', error);
    }
}

// ============================================
// Add Singer Form
// ============================================
document.getElementById('singerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    
    try {
        const formData = new FormData(e.target);
        
        const response = await fetch(`${API_BASE}/admin/singers`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showToast('Singer added successfully!', 'success');
            closeModal('singerModal');
            loadSingers();
            loadSingersForEventDropdown();
        } else {
            const error = await response.json();
            showToast(`Failed to add singer: ${error.detail || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error adding singer:', error);
        showToast('Failed to add singer. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Singer';
    }
});

// ============================================
// Add Event Form
// ============================================
document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    
    try {
        const formData = new FormData(e.target);
        
        const response = await fetch(`${API_BASE}/admin/events`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showToast('Event added successfully!', 'success');
            closeModal('eventModal');
            loadEvents();
        } else {
            const error = await response.json();
            showToast(`Failed to add event: ${error.detail || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error adding event:', error);
        showToast('Failed to add event. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Event';
    }
});

// ============================================
// Delete Singer
// ============================================
async function deleteSinger(id) {
    if (!confirm('Are you sure you want to delete this singer?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/singers/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Singer deleted successfully!', 'success');
            loadSingers();
            loadSingersForEventDropdown();
        } else {
            showToast('Failed to delete singer', 'error');
        }
    } catch (error) {
        console.error('Error deleting singer:', error);
        showToast('Failed to delete singer. Please try again.', 'error');
    }
}

// ============================================
// Delete Event
// ============================================
async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/events/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Event deleted successfully!', 'success');
            loadEvents();
        } else {
            showToast('Failed to delete event', 'error');
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        showToast('Failed to delete event. Please try again.', 'error');
    }
}
