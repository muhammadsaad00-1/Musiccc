const API_BASE = 'http://localhost:8000';
let editingPerformerId = null;
let editingEventId = null;

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Update active section
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');
    });
});

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
    document.querySelectorAll('.image-preview').forEach(p => p.innerHTML = '');
}

function openPerformerModal() {
    editingPerformerId = null;
    document.getElementById('performer-form').reset();
    document.getElementById('performer-modal-title').textContent = 'Add New Performer';
    document.getElementById('performer-submit-btn').textContent = 'Add Performer';
    openModal('performer-modal');
}

function openEventModal() {
    editingEventId = null;
    document.getElementById('event-form').reset();
    document.getElementById('event-modal-title').textContent = 'Add New Event';
    document.getElementById('event-submit-btn').textContent = 'Add Event';
    loadPerformersForSelect();
    openModal('event-modal');
}

// Toast
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} active`;
    setTimeout(() => toast.classList.remove('active'), 3000);
}

// Image preview
document.getElementById('profile-image').addEventListener('change', (e) => {
    previewImage(e.target, 'profile-preview');
});

document.getElementById('header-image').addEventListener('change', (e) => {
    previewImage(e.target, 'header-preview');
});

document.getElementById('gallery-images').addEventListener('change', (e) => {
    previewMultipleImages(e.target, 'gallery-preview');
});

document.getElementById('event-image').addEventListener('change', (e) => {
    previewImage(e.target, 'event-preview');
});

function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function previewMultipleImages(input, previewId) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = '';
    
    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imgContainer = document.createElement('div');
                imgContainer.style.cssText = 'position: relative; width: 100px; height: 100px;';
                imgContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Gallery ${index + 1}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
                    <span style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.6); color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${index + 1}</span>
                `;
                preview.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Load Performers
async function loadPerformers() {
    try {
        const response = await fetch(`${API_BASE}/performers`);
        if (!response.ok) throw new Error('Failed to fetch');
        const performers = await response.json();
        displayPerformers(performers);
    } catch (error) {
        console.error('Error loading performers:', error);
        document.getElementById('performers-grid').innerHTML = 
            '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load performers. Make sure the backend is running.</p></div>';
    }
}

function displayPerformers(performers) {
    const grid = document.getElementById('performers-grid');
    
    if (performers.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-microphone"></i>
                <p>No performers yet. Click "Add Performer" to get started!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = performers.map(p => `
        <div class="card">
            <img src="${p.profile_image_url || 'https://via.placeholder.com/400x200'}" 
                 alt="${p.name}" class="card-image" 
                 onerror="this.src='https://via.placeholder.com/400x200'">
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <h3 class="card-title">${p.name}</h3>
                    <span class="badge">${p.category}</span>
                </div>
                ${p.description ? `<p class="card-description">${p.description.substring(0, 120)}...</p>` : ''}
                <div class="card-meta">
                    ${p.price ? `<div class="meta-item"><i class="fas fa-dollar-sign"></i> $${p.price}</div>` : ''}
                    ${p.locations && p.locations.length > 0 ? `<div class="meta-item"><i class="fas fa-map-marker-alt"></i> ${p.locations[0]}${p.locations.length > 1 ? ` +${p.locations.length - 1}` : ''}</div>` : ''}
                    ${p.genres && p.genres.length > 0 ? `<div class="meta-item"><i class="fas fa-music"></i> ${p.genres.join(', ')}</div>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn-edit" onclick="editPerformer('${p.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deletePerformer('${p.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Events
async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE}/events`);
        if (!response.ok) throw new Error('Failed to fetch');
        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('events-grid').innerHTML = 
            '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load events. Make sure the backend is running.</p></div>';
    }
}

function displayEvents(events) {
    const grid = document.getElementById('events-grid');
    
    if (events.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-alt"></i>
                <p>No events yet. Click "Add Event" to get started!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = events.map(e => `
        <div class="card">
            <img src="${e.image_url || 'https://via.placeholder.com/400x200'}" 
                 alt="${e.name}" class="card-image"
                 onerror="this.src='https://via.placeholder.com/400x200'">
            <div class="card-content">
                <h3 class="card-title">${e.name}</h3>
                ${e.description ? `<p class="card-description">${e.description.substring(0, 120)}...</p>` : ''}
                <div class="card-meta">
                    ${e.pricing ? `<div class="meta-item"><i class="fas fa-dollar-sign"></i> $${e.pricing}</div>` : ''}
                    ${e.performers && e.performers.length > 0 ? `
                        <div class="meta-item">
                            <i class="fas fa-users"></i> 
                            ${e.performers.map(p => p.name).join(', ')}
                        </div>
                    ` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn-edit" onclick="editEvent('${e.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteEvent('${e.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Requirements
async function loadRequirements() {
    try {
        const response = await fetch(`${API_BASE}/requirements`);
        const requirements = await response.json();
        displayRequirements(requirements);
    } catch (error) {
        console.error('Error loading requirements:', error);
        document.getElementById('requirements-grid').innerHTML = 
            '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load requirements</p></div>';
    }
}

function displayRequirements(requirements) {
    const grid = document.getElementById('requirements-grid');
    
    if (requirements.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No booking requirements yet.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = requirements.map(r => `
        <div class="card">
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <h3 class="card-title">${r.customer_name}</h3>
                    <span class="badge" style="background: ${r.status === 'pending' ? '#f9731620' : '#10b98120'}; color: ${r.status === 'pending' ? '#f97316' : '#10b981'};">
                        ${r.status}
                    </span>
                </div>
                <div class="card-meta">
                    <div class="meta-item"><i class="fas fa-calendar"></i> ${r.event_type}</div>
                    <div class="meta-item"><i class="fas fa-map-marker-alt"></i> ${r.event_location}</div>
                    <div class="meta-item"><i class="fas fa-microphone"></i> ${r.artist_type}</div>
                </div>
                <div class="card-meta" style="margin-top: 12px;">
                    <div class="meta-item"><i class="fas fa-envelope"></i> ${r.customer_email}</div>
                    <div class="meta-item"><i class="fas fa-phone"></i> ${r.customer_phone}</div>
                </div>
                ${r.message ? `<p class="card-description" style="margin-top: 12px;">${r.message}</p>` : ''}
                <div class="card-actions">
                    <button class="btn-edit" onclick="updateRequirementStatus('${r.id}', 'completed')">
                        <i class="fas fa-check"></i> Mark Complete
                    </button>
                    <button class="btn-delete" onclick="deleteRequirement('${r.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load performers for event select
async function loadPerformersForSelect() {
    try {
        const response = await fetch(`${API_BASE}/performers`);
        const performers = await response.json();
        const select = document.getElementById('event-performers');
        
        if (performers.length === 0) {
            select.innerHTML = '<option value="">No performers available</option>';
        } else {
            select.innerHTML = performers.map(p => 
                `<option value="${p.id}">${p.name} (${p.category})</option>`
            ).join('');
        }
    } catch (error) {
        console.error('Error loading performers for select:', error);
    }
}

// Submit Performer Form
document.getElementById('performer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Convert comma-separated fields to JSON arrays
    ['locations', 'genres', 'videos', 'popular_songs'].forEach(field => {
        const value = formData.get(field);
        if (value) {
            const array = value.split(',').map(v => v.trim()).filter(v => v);
            formData.set(field, JSON.stringify(array));
        }
    });
    
    // When editing, remove empty file inputs to prevent overwriting existing images
    if (editingPerformerId) {
        const imageInput = document.getElementById('profile-image');
        const headerInput = document.getElementById('header-image');
        const galleryInput = document.getElementById('gallery-images');
        
        if (!imageInput.files || imageInput.files.length === 0) {
            formData.delete('image');
        }
        if (!headerInput.files || headerInput.files.length === 0) {
            formData.delete('header_image');
        }
        if (!galleryInput.files || galleryInput.files.length === 0) {
            formData.delete('gallery_images');
        }
    }
    
    try {
        const url = editingPerformerId 
            ? `${API_BASE}/admin/performers/${editingPerformerId}`
            : `${API_BASE}/admin/performers`;
        
        const method = editingPerformerId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        if (response.ok) {
            showToast(editingPerformerId ? 'Performer updated successfully!' : 'Performer added successfully!');
            closeModal('performer-modal');
            loadPerformers();
            editingPerformerId = null;
        } else {
            const error = await response.json();
            showToast(error.detail || 'Failed to save performer', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
});

// Submit Event Form
document.getElementById('event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Get selected performers
    const select = document.getElementById('event-performers');
    const selectedIds = Array.from(select.selectedOptions).map(o => o.value);
    formData.set('performer_ids', JSON.stringify(selectedIds));
    
    try {
        const url = editingEventId 
            ? `${API_BASE}/admin/events/${editingEventId}`
            : `${API_BASE}/admin/events`;
        
        const method = editingEventId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });
        
        if (response.ok) {
            showToast(editingEventId ? 'Event updated successfully!' : 'Event added successfully!');
            closeModal('event-modal');
            loadEvents();
            editingEventId = null;
        } else {
            const error = await response.json();
            showToast(error.detail || 'Failed to save event', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
});

// Delete functions
async function deletePerformer(id) {
    if (!confirm('Are you sure you want to delete this performer?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/performers/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Performer deleted successfully!');
            loadPerformers();
        } else {
            showToast('Failed to delete performer', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/admin/events/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Event deleted successfully!');
            loadEvents();
        } else {
            showToast('Failed to delete event', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

async function deleteRequirement(id) {
    if (!confirm('Are you sure you want to delete this requirement?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/requirements/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('Requirement deleted successfully!');
            loadRequirements();
        } else {
            showToast('Failed to delete requirement', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

async function updateRequirementStatus(id, status) {
    try {
        const response = await fetch(`${API_BASE}/requirements/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            showToast('Status updated successfully!');
            loadRequirements();
        } else {
            showToast('Failed to update status', 'error');
        }
    } catch (error) {
        showToast('An error occurred', 'error');
    }
}

// Edit functions
async function editPerformer(id) {
    try {
        const response = await fetch(`${API_BASE}/performers/${id}`);
        if (!response.ok) {
            console.error('Response status:', response.status);
            throw new Error('Failed to fetch performer');
        }
        
        const performer = await response.json();
        console.log('Loaded performer:', performer);
        
        if (performer.error) {
            throw new Error(performer.error);
        }
        
        editingPerformerId = id;
        
        // Populate form
        document.getElementById('performer-name').value = performer.name || '';
        document.getElementById('performer-description').value = performer.description || '';
        document.getElementById('performer-category').value = performer.category || '';
        document.getElementById('performer-price').value = performer.price || '';
        document.getElementById('performer-instagram').value = performer.instagram_url || '';
        document.getElementById('performer-youtube').value = performer.youtube_url || '';
        document.getElementById('performer-locations').value = (performer.locations || []).join(', ');
        document.getElementById('performer-genres').value = (performer.genres || []).join(', ');
        document.getElementById('performer-videos').value = (performer.videos || []).join(', ');
        document.getElementById('performer-popular-songs').value = (performer.popular_songs || []).join(', ');
        
        // Make image optional for editing
        const imageInput = document.getElementById('profile-image');
        if (imageInput) {
            imageInput.removeAttribute('required');
        }
        
        // Show existing images with "Keep existing" message
        if (performer.profile_image_url) {
            document.getElementById('profile-preview').innerHTML = `
                <div style="position: relative;">
                    <img src="${performer.profile_image_url}" alt="Current profile">
                    <div style="margin-top: 8px; color: #10b981; font-size: 12px;">
                        <i class="fas fa-check-circle"></i> Current image (will be kept if no new image selected)
                    </div>
                </div>
            `;
        }
        
        if (performer.header_image_url) {
            document.getElementById('header-preview').innerHTML = `
                <div style="position: relative;">
                    <img src="${performer.header_image_url}" alt="Current header">
                    <div style="margin-top: 8px; color: #10b981; font-size: 12px;">
                        <i class="fas fa-check-circle"></i> Current header (will be kept if no new image selected)
                    </div>
                </div>
            `;
        }
        
        if (performer.gallery_image_urls && performer.gallery_image_urls.length > 0) {
            const galleryPreview = document.getElementById('gallery-preview');
            galleryPreview.style.display = 'flex';
            galleryPreview.style.flexWrap = 'wrap';
            galleryPreview.style.gap = '10px';
            galleryPreview.innerHTML = performer.gallery_image_urls.map((url, idx) => `
                <div style="position: relative; width: 100px; height: 100px;">
                    <img src="${url}" alt="Gallery ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
                    <span style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.6); color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">${idx + 1}</span>
                </div>
            `).join('') + `
                <div style="width: 100%; margin-top: 8px; color: #10b981; font-size: 12px;">
                    <i class="fas fa-check-circle"></i> Current gallery (${performer.gallery_image_urls.length} images - will be kept if no new images selected)
                </div>
            `;
        }
        
        // Update modal title and button
        document.getElementById('performer-modal-title').textContent = 'Edit Performer';
        document.getElementById('performer-submit-btn').textContent = 'Update Performer';
        
        openModal('performer-modal');
    } catch (error) {
        console.error('Edit performer error:', error);
        showToast('Failed to load performer data: ' + error.message, 'error');
    }
}

async function editEvent(id) {
    try {
        const response = await fetch(`${API_BASE}/events/${id}`);
        if (!response.ok) {
            console.error('Response status:', response.status);
            throw new Error('Failed to fetch event');
        }
        
        const event = await response.json();
        console.log('Loaded event:', event);
        
        if (event.error) {
            throw new Error(event.error);
        }
        
        editingEventId = id;
        
        // Populate form
        document.getElementById('event-name').value = event.name || '';
        document.getElementById('event-description').value = event.description || '';
        document.getElementById('event-pricing').value = event.pricing || '';
        document.getElementById('event-recommendations').value = event.event_recommendations || '';
        
        // Load performers and then select the ones for this event
        await loadPerformersForSelect();
        
        // Select the performers for this event
        const select = document.getElementById('event-performers');
        const performerIds = event.performer_ids || [];
        Array.from(select.options).forEach(option => {
            option.selected = performerIds.includes(option.value);
        });
        
        // Make image optional for editing
        const imageInput = document.getElementById('event-image');
        if (imageInput) {
            imageInput.removeAttribute('required');
        }
        
        // Update modal title and button
        document.getElementById('event-modal-title').textContent = 'Edit Event';
        document.getElementById('event-submit-btn').textContent = 'Update Event';
        
        openModal('event-modal');
    } catch (error) {
        console.error('Edit event error:', error);
        showToast('Failed to load event data: ' + error.message, 'error');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPerformers();
    loadEvents();
    loadRequirements();
});
