// ============================================
// Admin Dashboard JavaScript
// ============================================

const API_BASE = 'http://localhost:8001';
let performersData = [];
let eventsData = [];

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFilePreview();
    loadPerformers();
    loadEvents();
    loadPerformersForEventDropdown();
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
    // Performer image preview
    const performerImageInput = document.getElementById('performerImage');
    if (performerImageInput) {
        performerImageInput.addEventListener('change', (e) => {
            handleImagePreview(e.target, 'performerImagePreview');
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
// Load Performers
// ============================================
async function loadPerformers() {
    try {
        const response = await fetch(`${API_BASE}/performers`);
        performersData = await response.json();
        displayPerformers(performersData);
    } catch (error) {
        console.error('Error loading performers:', error);
        showToast('Failed to load performers', 'error');
    }
}

function displayPerformers(performers) {
    const grid = document.getElementById('performersGrid');
    
    if (performers.length === 0) {
        grid.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-music"></i>
                <p>No performers added yet. Click "Add Performer" to get started!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = performers.map(performer => `
        <div class="card">
            <div class="card-image">
                <img src="${performer.profile_image_url || 'https://via.placeholder.com/400x300?text=No+Image'}" 
                     alt="${performer.name}"
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="card-badge">${performer.category}</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${performer.name}</h3>
                ${performer.description ? `<p class="card-description">${performer.description.substring(0, 100)}${performer.description.length > 100 ? '...' : ''}</p>` : ''}
                <div class="card-meta">
                    ${performer.price ? `
                        <div class="card-meta-item">
                            <i class="fas fa-dollar-sign"></i>
                            <span>$${performer.price}</span>
                        </div>
                    ` : ''}
                    ${performer.genres && performer.genres.length > 0 ? `
                        <div class="card-meta-item">
                            <i class="fas fa-music"></i>
                            <span>${performer.genres.join(', ')}</span>
                        </div>
                    ` : ''}
                </div>
                ${performer.locations && performer.locations.length > 0 ? `
                    <div class="card-meta">
                        <div class="card-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${performer.locations.join(', ')}</span>
                        </div>
                    </div>
                ` : ''}
                <div class="card-actions">
                    ${performer.instagram_url ? `<a href="${performer.instagram_url}" target="_blank" class="btn-icon"><i class="fab fa-instagram"></i></a>` : ''}
                    ${performer.youtube_url ? `<a href="${performer.youtube_url}" target="_blank" class="btn-icon"><i class="fab fa-youtube"></i></a>` : ''}
                    <button class="btn-delete" onclick="deletePerformer('${performer.id}')">
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

    grid.innerHTML = events.map(event => `
        <div class="card">
            <div class="card-image">
                <img src="${event.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}" 
                     alt="${event.name}"
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            </div>
            <div class="card-content">
                <h3 class="card-title">${event.name}</h3>
                ${event.description ? `<p class="card-description">${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>` : ''}
                <div class="card-meta">
                    ${event.pricing ? `
                        <div class="card-meta-item">
                            <i class="fas fa-dollar-sign"></i>
                            <span>$${event.pricing}</span>
                        </div>
                    ` : ''}
                    ${event.performers && event.performers.length > 0 ? `
                        <div class="card-meta-item">
                            <i class="fas fa-microphone"></i>
                            <span>${event.performers.map(p => `${p.name} (${p.category})`).join(', ')}</span>
                        </div>
                    ` : ''}
                </div>
                ${event.event_recommendations ? `
                    <div class="card-meta">
                        <div class="card-meta-item">
                            <i class="fas fa-lightbulb"></i>
                            <span>${event.event_recommendations.substring(0, 80)}...</span>
                        </div>
                    </div>
                ` : ''}
                <div class="card-actions">
                    <button class="btn-delete" onclick="deleteEvent('${event.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// Load Performers for Event Dropdown
// ============================================
async function loadPerformersForEventDropdown() {
    try {
        const response = await fetch(`${API_BASE}/performers`);
        const performers = await response.json();
        const select = document.getElementById('eventPerformerSelect');
        
        if (performers.length === 0) {
            select.innerHTML = '<option value="">No performers available - add performers first</option>';
        } else {
            select.innerHTML = `
                <option value="">Select a performer (optional)</option>
                ${performers.map(performer => `
                    <option value="${performer.id}">${performer.name} (${performer.category})</option>
                `).join('')}
            `;
        }
    } catch (error) {
        console.error('Error loading performers for dropdown:', error);
    }
}

// ============================================
// Add Performer Form
// ============================================
document.getElementById('performerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    
    try {
        const formData = new FormData(e.target);
        
        // Convert comma-separated strings to JSON arrays
        const locationsValue = formData.get('locations');
        if (locationsValue) {
            const locationsArray = locationsValue.split(',').map(l => l.trim()).filter(l => l);
            formData.set('locations', JSON.stringify(locationsArray));
        }
        
        const genresValue = formData.get('genres');
        if (genresValue) {
            const genresArray = genresValue.split(',').map(g => g.trim()).filter(g => g);
            formData.set('genres', JSON.stringify(genresArray));
        }
        
        const videosValue = formData.get('videos');
        if (videosValue) {
            const videosArray = videosValue.split(',').map(v => v.trim()).filter(v => v);
            formData.set('videos', JSON.stringify(videosArray));
        }
        
        const response = await fetch(`${API_BASE}/admin/performers`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showToast('Performer added successfully!', 'success');
            closeModal('performerModal');
            loadPerformers();
            loadPerformersForEventDropdown();
        } else {
            const error = await response.json();
            showToast(`Failed to add performer: ${error.detail || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error adding performer:', error);
        showToast('Failed to add performer. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Performer';
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
        
        // Get selected performer IDs from multi-select
        const select = document.getElementById('eventPerformerSelect');
        const selectedIds = Array.from(select.selectedOptions).map(option => option.value).filter(v => v);
        formData.set('performer_ids', JSON.stringify(selectedIds));
        
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
// Delete Performer
// ============================================
async function deletePerformer(id) {
    if (!confirm('Are you sure you want to delete this performer?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/admin/performers/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Performer deleted successfully!', 'success');
            loadPerformers();
            loadPerformersForEventDropdown();
        } else {
            showToast('Failed to delete performer', 'error');
        }
    } catch (error) {
        console.error('Error deleting performer:', error);
        showToast('Failed to delete performer. Please try again.', 'error');
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
