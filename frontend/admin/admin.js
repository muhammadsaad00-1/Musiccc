// ============================================
// Admin Dashboard JavaScript
// ============================================

const API_BASE = 'http://localhost:8001';
let performersData = [];
let eventsData = [];
let requestsData = [];
let currentFilter = 'all';
let selectedRequest = null;
let editingPerformerId = null;

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFilePreview();
    initFilterButtons();
    loadPerformers();
    loadEvents();
    loadPerformersForEventDropdown();
    loadBookingRequests();
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

    // Reset performer modal state
    if (modalId === 'performerModal') {
        editingPerformerId = null;
        const modalTitle = modal.querySelector('.modal-header h2');
        const submitBtn = form.querySelector('button[type="submit"]');
        modalTitle.innerHTML = '<i class="fas fa-microphone"></i> Add New Performer';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Add Performer';
        // Restore image required
        const imageInput = form.querySelector('[name="image"]');
        imageInput.setAttribute('required', 'required');
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
                    <button class="btn-edit" onclick="editPerformer('${performer.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
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

        let url = `${API_BASE}/admin/performers`;
        let method = 'POST';
        let successMessage = 'Performer added successfully!';

        if (editingPerformerId) {
            url = `${API_BASE}/admin/performers/${editingPerformerId}`;
            method = 'PUT';
            successMessage = 'Performer updated successfully!';
        }

        const response = await fetch(url, {
            method: method,
            body: formData
        });

        if (response.ok) {
            showToast(successMessage, 'success');
            closeModal('performerModal');
            editingPerformerId = null;
            loadPerformers();
            loadPerformersForEventDropdown();
        } else {
            const error = await response.json();
            showToast(`Failed to save performer: ${error.detail || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error saving performer:', error);
        showToast('Failed to save performer. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = editingPerformerId ? '<i class="fas fa-save"></i> Update Performer' : '<i class="fas fa-save"></i> Add Performer';
        editingPerformerId = null;
    }
});

// ============================================
// Edit Performer
// ============================================
function editPerformer(id) {
    const performer = performersData.find(p => p.id === id);
    if (!performer) return;

    editingPerformerId = id;
    const form = document.getElementById('performerForm');
    const modal = document.getElementById('performerModal');
    const modalTitle = modal.querySelector('.modal-header h2');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Update modal title and button
    modalTitle.innerHTML = '<i class="fas fa-edit"></i> Edit Performer';
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Performer';

    // Populate form fields
    form.querySelector('[name="name"]').value = performer.name || '';
    form.querySelector('[name="description"]').value = performer.description || '';
    form.querySelector('[name="category"]').value = performer.category || '';
    form.querySelector('[name="price"]').value = performer.price || '';
    form.querySelector('[name="instagram_url"]').value = performer.instagram_url || '';
    form.querySelector('[name="youtube_url"]').value = performer.youtube_url || '';
    form.querySelector('[name="locations"]').value = performer.locations ? performer.locations.join(', ') : '';
    form.querySelector('[name="genres"]').value = performer.genres ? performer.genres.join(', ') : '';
    form.querySelector('[name="videos"]').value = performer.videos ? performer.videos.join(', ') : '';

    // Make image optional when editing
    const imageInput = form.querySelector('[name="image"]');
    imageInput.removeAttribute('required');

    // Show current image preview if exists
    const preview = document.getElementById('performerImagePreview');
    if (performer.profile_image_url) {
        preview.innerHTML = `<img src="${performer.profile_image_url}" alt="Current Image">`;
        preview.classList.add('active');
    }

    openModal('performerModal');
}

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

// ============================================
// Filter Buttons Initialization
// ============================================
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.br-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            displayBookingRequests(requestsData);
        });
    });
}

// Filter by clicking on stat cards
function filterByStatus(status) {
    currentFilter = status;
    const filterButtons = document.querySelectorAll('.br-filter-btn');
    filterButtons.forEach(b => {
        b.classList.remove('active');
        if (b.dataset.filter === status) {
            b.classList.add('active');
        }
    });
    displayBookingRequests(requestsData);
}


// ============================================
// Load Booking Requests
// ============================================
async function loadBookingRequests() {
    try {
        const response = await fetch(`${API_BASE}/api/requirements`);
        requestsData = await response.json();
        updateRequestsStats();
        displayBookingRequests(requestsData);
        updateBadge();
    } catch (error) {
        console.error('Error loading booking requests:', error);
        const list = document.getElementById('requestsList');
        list.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load booking requests. Make sure the database table exists.</p>
            </div>
        `;
    }
}

function updateRequestsStats() {
    const pending = requestsData.filter(r => r.status === 'pending').length;
    const contacted = requestsData.filter(r => r.status === 'contacted').length;
    const booked = requestsData.filter(r => r.status === 'booked').length;
    const cancelled = requestsData.filter(r => r.status === 'cancelled').length;

    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('contactedCount').textContent = contacted;
    document.getElementById('bookedCount').textContent = booked;
    document.getElementById('cancelledCount').textContent = cancelled;
}

function updateBadge() {
    const pending = requestsData.filter(r => r.status === 'pending').length;
    const badge = document.getElementById('requestsBadge');
    if (pending > 0) {
        badge.textContent = pending;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function displayBookingRequests(requests) {
    const list = document.getElementById('requestsList');
    list.className = 'br-list';

    // Apply filter
    let filtered = requests;
    if (currentFilter !== 'all') {
        filtered = requests.filter(r => r.status === currentFilter);
    }

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="br-empty">
                <i class="fas fa-inbox"></i>
                <h3>${currentFilter === 'all' ? 'No Booking Requests Yet' : `No ${capitalizeFirst(currentFilter)} Requests`}</h3>
                <p>${currentFilter === 'all' ? 'When customers submit booking requests, they will appear here.' : `There are no requests with "${currentFilter}" status.`}</p>
            </div>
        `;
        return;
    }

    list.innerHTML = filtered.map(req => `
        <div class="br-card br-${req.status}" onclick="viewRequest('${req.id}')">
            <div class="br-avatar">${req.customer_name.charAt(0).toUpperCase()}</div>
            <div class="br-content">
                <div class="br-header">
                    <div>
                        <h4 class="br-customer-name">${req.customer_name}</h4>
                        <div class="br-customer-email">${req.customer_email}</div>
                    </div>
                    <span class="br-badge br-badge-${req.status}">${capitalizeFirst(req.status)}</span>
                </div>
                <div class="br-event">
                    <i class="fas fa-star"></i> ${req.event_type}
                </div>
                <div class="br-details">
                    <span class="br-detail"><i class="fas fa-calendar"></i> ${formatDate(req.event_date)}</span>
                    <span class="br-detail"><i class="fas fa-map-marker-alt"></i> ${req.event_location}</span>
                    <span class="br-detail br-detail-artist"><i class="fas fa-microphone"></i> ${capitalizeFirst(req.artist_type)}</span>
                    <span class="br-detail br-detail-budget"><i class="fas fa-coins"></i> ${formatBudget(req.budget)}</span>
                </div>
            </div>
            <div class="br-actions">
                <span class="br-time">${getTimeAgo(req.created_at)}</span>
                <div class="br-btns">
                    <a href="mailto:${req.customer_email}" onclick="event.stopPropagation();" class="br-btn br-btn-email">
                        <i class="fas fa-envelope"></i> Email
                    </a>
                    <a href="tel:${req.customer_phone}" onclick="event.stopPropagation();" class="br-btn br-btn-call">
                        <i class="fas fa-phone"></i> Call
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}



// Get relative time (e.g., "2 hours ago")
function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(dateString);
}


// ============================================
// View Request Details
// ============================================
function viewRequest(id) {
    selectedRequest = requestsData.find(r => r.id === id);
    if (!selectedRequest) return;

    const details = document.getElementById('requestDetails');
    details.innerHTML = `
        <div class="br-detail-section">
            <h3><i class="fas fa-user"></i> Customer Information</h3>
            <div class="br-detail-row">
                <span class="br-detail-label">Name</span>
                <span class="br-detail-value">${selectedRequest.customer_name}</span>
            </div>
            <div class="br-detail-row">
                <span class="br-detail-label">Email</span>
                <span class="br-detail-value">${selectedRequest.customer_email}</span>
            </div>
            <div class="br-detail-row">
                <span class="br-detail-label">Phone</span>
                <span class="br-detail-value">${selectedRequest.customer_phone}</span>
            </div>
        </div>
        <div class="br-detail-section">
            <h3><i class="fas fa-calendar-alt"></i> Event Details</h3>
            <div class="br-detail-row">
                <span class="br-detail-label">Event Type</span>
                <span class="br-detail-value highlight">${selectedRequest.event_type}</span>
            </div>
            <div class="br-detail-row">
                <span class="br-detail-label">Event Date</span>
                <span class="br-detail-value">${formatDate(selectedRequest.event_date)}</span>
            </div>
            <div class="br-detail-row">
                <span class="br-detail-label">Location</span>
                <span class="br-detail-value">${selectedRequest.event_location}</span>
            </div>
        </div>
        <div class="br-detail-section">
            <h3><i class="fas fa-microphone"></i> Requirements</h3>
            <div class="br-detail-row">
                <span class="br-detail-label">Artist Type</span>
                <span class="br-detail-value highlight">${capitalizeFirst(selectedRequest.artist_type)}</span>
            </div>
            <div class="br-detail-row">
                <span class="br-detail-label">Budget</span>
                <span class="br-detail-value budget">${formatBudget(selectedRequest.budget)}</span>
            </div>
        </div>
        ${selectedRequest.message ? `
        <div class="br-detail-section">
            <h3><i class="fas fa-comment"></i> Additional Notes</h3>
            <p style="color: #94a3b8; font-size: 0.9rem; margin: 0; line-height: 1.5;">${selectedRequest.message}</p>
        </div>
        ` : ''}
        <div class="br-detail-section">
            <h3><i class="fas fa-info-circle"></i> Current Status</h3>
            <span class="br-status-current ${selectedRequest.status}">
                ${getStatusIcon(selectedRequest.status)} ${capitalizeFirst(selectedRequest.status)}
            </span>
            <div class="br-received-time">
                <i class="fas fa-clock"></i> Received: ${formatDateTime(selectedRequest.created_at)}
            </div>
        </div>
    `;

    // Update contact links
    document.getElementById('emailLink').href = `mailto:${selectedRequest.customer_email}?subject=Re: Your Booking Request for ${selectedRequest.event_type}`;
    document.getElementById('phoneLink').href = `tel:${selectedRequest.customer_phone}`;

    // Highlight active status button
    document.querySelectorAll('.br-status-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.classList.contains(selectedRequest.status)) {
            btn.classList.add('active');
        }
    });

    openModal('requestModal');
}


// ============================================
// Update Request Status
// ============================================
async function updateRequestStatus(status) {
    if (!selectedRequest) return;

    try {
        const formData = new FormData();
        formData.append('status', status);

        const response = await fetch(`${API_BASE}/api/requirements/${selectedRequest.id}/status`, {
            method: 'PUT',
            body: formData
        });

        if (response.ok) {
            showToast(`Status updated to ${status}!`, 'success');
            selectedRequest.status = status;

            // Update in data array
            const index = requestsData.findIndex(r => r.id === selectedRequest.id);
            if (index !== -1) {
                requestsData[index].status = status;
            }

            // Refresh displays
            updateRequestsStats();
            displayBookingRequests(requestsData);
            updateBadge();

            // Update modal status display
            viewRequest(selectedRequest.id);
        } else {
            showToast('Failed to update status', 'error');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showToast('Failed to update status. Please try again.', 'error');
    }
}

// ============================================
// Helper Functions
// ============================================
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatBudget(budget) {
    if (!budget) return 'Not specified';
    return budget.replace('-', ' - ').replace(/k/gi, 'K').toUpperCase();
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatusIcon(status) {
    const icons = {
        pending: '<i class="fas fa-clock"></i>',
        contacted: '<i class="fas fa-phone"></i>',
        booked: '<i class="fas fa-check-circle"></i>',
        cancelled: '<i class="fas fa-times-circle"></i>'
    };
    return icons[status] || '<i class="fas fa-question"></i>';
}
