// DOM Elements
const memeGrid = document.getElementById('memeGrid');
const addMemeBtn = document.getElementById('addMemeBtn');
const addMemeModal = document.getElementById('addMemeModal');
const viewMemeModal = document.getElementById('viewMemeModal');
const closeModalBtns = document.querySelectorAll('.close');
const addMemeForm = document.getElementById('addMemeForm');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const viewOptions = document.querySelectorAll('.view-option');
const toggleViewBtn = document.getElementById('toggleViewBtn');
const featuredCarousel = document.getElementById('featuredCarousel');
const statsTotalMemes = document.getElementById('totalMemes');
const statsTotalCategories = document.getElementById('totalCategories');
const statsFeaturedMemes = document.getElementById('featuredMemes');

// Sample memes data
let memes = [
    {
        id: 1,
        title: "Programming Bugs",
        imageUrl: "programming-meme-2.jpg",
        category: "funny",
        description: "When you fix one bug but create three more",
        featured: true,
        dateAdded: new Date('2023-06-15'),
        likes: 123
    },
    {
        id: 2,
        title: "Cute Puppy",
        imageUrl: "https://i.imgur.com/7l5zQXU.jpg",
        category: "cute",
        description: "Just a happy puppy brightening your day",
        featured: false,
        dateAdded: new Date('2023-07-22'),
        likes: 87
    },
    {
        id: 3,
        title: "Gaming Life",
        imageUrl: "https://i.imgur.com/3oGP0UN.jpg",
        category: "gaming",
        description: "Every gamer knows this feeling",
        featured: true,
        dateAdded: new Date('2023-05-10'),
        likes: 142
    },
    {
        id: 4,
        title: "Monday Mood",
        imageUrl: "https://i.imgur.com/LF0RMv3.jpg",
        category: "funny",
        description: "When the alarm goes off on Monday morning",
        featured: false,
        dateAdded: new Date('2023-08-03'),
        likes: 65
    },
    {
        id: 5,
        title: "Movie Night",
        imageUrl: "https://i.imgur.com/hTuFkL9.jpg",
        category: "movie",
        description: "When the movie starts getting interesting just as you're falling asleep",
        featured: true,
        dateAdded: new Date('2023-08-15'),
        likes: 91
    }
];

// Initialize stats
updateStats();

// Event Listeners
addMemeBtn.addEventListener('click', () => {
    addMemeModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Close modals
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style="display: block;"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
    }
});

// View options toggle
viewOptions.forEach(option => {
    option.addEventListener('click', () => {
        const viewType = option.dataset.view;
        
        // Update active class
        viewOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Change view type
        if (viewType === 'grid') {
            memeGrid.classList.remove('list-view');
            toggleViewBtn.innerHTML = '<i class="fas fa-th-large"></i>';
        } else {
            memeGrid.classList.add('list-view');
            toggleViewBtn.innerHTML = '<i class="fas fa-list"></i>';
        }
    });
});

toggleViewBtn.addEventListener('click', () => {
    const isGridView = !memeGrid.classList.contains('list-view');
    if (isGridView) {
        // Switch to list view
        memeGrid.classList.add('list-view');
        toggleViewBtn.innerHTML = '<i class="fas fa-list"></i>';
        viewOptions.forEach(opt => {
            opt.classList.remove('active');
            if (opt.dataset.view === 'list') opt.classList.add('active');
        });
    } else {
        // Switch to grid view
        memeGrid.classList.remove('list-view');
        toggleViewBtn.innerHTML = '<i class="fas fa-th-large"></i>';
        viewOptions.forEach(opt => {
            opt.classList.remove('active');
            if (opt.dataset.view === 'grid') opt.classList.add('active');
        });
    }
});

// Simplified image validation - just check file extension
function validateImageUrl(url) {
    // Convert to lowercase and check file extensions
    const lowercaseUrl = url.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return validExtensions.some(ext => lowercaseUrl.endsWith(ext));
}

// Check for allowed domains
function isAllowedImageDomain(url) {
    try {
        const hostname = new URL(url).hostname;
        // Add popular image hosting services
        const allowedDomains = [
            'imgur.com',
            'i.imgur.com',
            'ibb.co', 
            'i.ibb.co',
            'postimg.cc',
            'postimg.org',
            'postimages.org',
            'imagehost.com',
            'imgbb.com',
            'flickr.com',
            'staticflickr.com',
            'live.staticflickr.com',
            'pinimg.com',
            'media-amazon.com',
            'wikimedia.org',
            'pixabay.com',
            'pexels.com',
            'unsplash.com'
        ];
        return allowedDomains.some(domain => hostname.includes(domain));
    } catch {
        return false;
    }
}

addMemeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let imageUrl = document.getElementById('memeUrl').value.trim();

    // Add https:// if missing
    if (!imageUrl.startsWith('http')) {
        imageUrl = 'https://' + imageUrl;
    }

    const submitBtn = addMemeForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    submitBtn.disabled = true;

    try {
        // Simplified validation
        if (!validateImageUrl(imageUrl)) {
            showNotification('URL must end with .jpg, .jpeg, .png, .gif, or .webp', 'error');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        if (!isAllowedImageDomain(imageUrl)) {
            showNotification('Please use a trusted image hosting service like Imgur', 'error');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        const newMeme = {
            id: Date.now(),
            title: document.getElementById('memeTitle').value.trim() || 'Untitled Meme',
            imageUrl: imageUrl,
            category: document.getElementById('memeCategory').value,
            description: document.getElementById('memeDescription').value.trim() || 'No description',
            featured: document.getElementById('memeFeatured').checked,
            dateAdded: new Date(),
            likes: 0
        };

        memes.unshift(newMeme);
        closeModalHandler(addMemeModal);
        addMemeForm.reset();
        
        // Update all displays
        renderMemes(filterMemes());
        renderFeaturedMemes();
        updateStats();
        
        showNotification('Meme added successfully! 🎉');
    } catch (error) {
        console.error('Error adding meme:', error);
        showNotification('Error adding meme. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

searchInput.addEventListener('input', debounce(() => {
    renderMemes(filterMemes());
}, 300));

categoryFilter.addEventListener('change', () => {
    renderMemes(filterMemes());
});

sortFilter.addEventListener('change', () => {
    renderMemes(filterMemes());
});

function createMemeCard(meme, index) {
    const card = document.createElement('div');
    card.className = 'meme-card';
    card.dataset.id = meme.id;
    card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;

    // Create image container with fixed aspect ratio
    const imageContainer = document.createElement('div');
    imageContainer.className = 'meme-image-container';
    
    // Add loading indicator before image loads
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'image-loading';
    loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    imageContainer.appendChild(loadingDiv);

    // Create image element
    const img = document.createElement('img');
    img.className = 'meme-image';
    img.alt = meme.title;
    
    // Handle image loading
    img.onload = () => {
        loadingDiv.remove();
        img.style.opacity = '1';
    };
    
    // Handle image loading errors
    img.onerror = () => {
        loadingDiv.innerHTML = 'Image not available';
        img.style.display = 'none';
    };
    
    // Set image source
    img.src = meme.imageUrl;
    imageContainer.appendChild(img);
    
    // Add image container to card
    card.appendChild(imageContainer);
    
    // Add meme info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'meme-info';
    
    // Create the meme header with title and category
    const memeHeader = document.createElement('div');
    memeHeader.innerHTML = `
        <h3 class="meme-title">${escapeHtml(meme.title)}</h3>
        <span class="meme-category">${meme.category}</span>
    `;
    
    // Add description
    const memeDescription = document.createElement('p');
    memeDescription.className = 'meme-description';
    memeDescription.textContent = meme.description;
    
    // Add action buttons
    const memeActions = document.createElement('div');
    memeActions.className = 'meme-actions';
    memeActions.innerHTML = `
        <button class="action-btn view" title="View Details"><i class="fas fa-eye"></i></button>
        <button class="action-btn favorite" title="Like" data-likes="${meme.likes}"><i class="far fa-heart"></i></button>
        <button class="action-btn share" title="Share"><i class="fas fa-share-alt"></i></button>
        ${meme.featured ? '<span class="action-btn" title="Featured"><i class="fas fa-star"></i></span>' : ''}
    `;
    
    // Add all elements to the info div
    infoDiv.appendChild(memeHeader);
    infoDiv.appendChild(memeDescription);
    infoDiv.appendChild(memeActions);
    
    // Add info div to card
    card.appendChild(infoDiv);
    
    // Event listeners for actions
    const viewBtn = memeActions.querySelector('.view');
    viewBtn.addEventListener('click', () => viewMeme(meme));
    
    const likeBtn = memeActions.querySelector('.favorite');
    likeBtn.addEventListener('click', function() {
        const isFavorited = this.classList.contains('active');
        if (isFavorited) {
            // Unlike
            this.classList.remove('active');
            this.querySelector('i').className = 'far fa-heart';
            meme.likes--;
        } else {
            // Like
            this.classList.add('active');
            this.querySelector('i').className = 'fas fa-heart';
            meme.likes++;
        }
        this.setAttribute('data-likes', meme.likes);
        this.title = `${meme.likes} Likes`;
    });
    
    // Make entire card clickable for view
    card.addEventListener('click', (e) => {
        // Only trigger view if not clicking on an action button
        if (!e.target.closest('.action-btn')) {
            viewMeme(meme);
        }
    });
    
    return card;
}

function createFeaturedMemeCard(meme) {
    const card = document.createElement('div');
    card.className = 'featured-item';
    card.dataset.id = meme.id;
    
    // Create featured meme content
    const imageContainer = document.createElement('div');
    imageContainer.className = 'meme-image-container';
    
    // Create loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'image-loading';
    loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    imageContainer.appendChild(loadingDiv);
    
    // Create image
    const img = document.createElement('img');
    img.className = 'meme-image';
    img.alt = meme.title;
    
    img.onload = () => {
        loadingDiv.remove();
        img.style.opacity = '1';
    };
    
    img.onerror = () => {
        loadingDiv.innerHTML = 'Image not available';
        img.style.display = 'none';
    };
    
    img.src = meme.imageUrl;
    imageContainer.appendChild(img);
    
    // Create info section
    const infoDiv = document.createElement('div');
    infoDiv.className = 'meme-info';
    infoDiv.innerHTML = `
        <h3 class="meme-title">${escapeHtml(meme.title)}</h3>
        <span class="meme-category">${meme.category}</span>
    `;
    
    // Add elements to card
    card.appendChild(imageContainer);
    card.appendChild(infoDiv);
    
    // Make card clickable to view meme details
    card.addEventListener('click', () => viewMeme(meme));
    
    return card;
}

function renderMemes(memesToRender) {
    memeGrid.innerHTML = '';
    if (memesToRender.length === 0) {
        memeGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No memes found. Try a different search or category!</p>
            </div>
        `;
        return;
    }

    memesToRender.forEach((meme, index) => {
        memeGrid.appendChild(createMemeCard(meme, index));
    });
}

function renderFeaturedMemes() {
    featuredCarousel.innerHTML = '';
    const featuredMemes = memes.filter(meme => meme.featured);
    
    if (featuredMemes.length === 0) {
        featuredCarousel.innerHTML = '<p>No featured memes yet!</p>';
        return;
    }
    
    featuredMemes.forEach(meme => {
        featuredCarousel.appendChild(createFeaturedMemeCard(meme));
    });
}

function filterMemes() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortOption = sortFilter.value;

    // First filter by search and category
    let filteredMemes = memes.filter(meme => {
        const matchesSearch = meme.title.toLowerCase().includes(searchTerm) ||
                              meme.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || meme.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    
    // Then sort the results
    switch(sortOption) {
        case 'newest':
            filteredMemes.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'oldest':
            filteredMemes.sort((a, b) => a.dateAdded - b.dateAdded);
            break;
        case 'az':
            filteredMemes.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'za':
            filteredMemes.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            // Newest first by default
            filteredMemes.sort((a, b) => b.dateAdded - a.dateAdded);
    }
    
    return filteredMemes;
}

function viewMeme(meme) {
    const viewMemeContent = document.getElementById('viewMemeContent');
    
    // Format date
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = meme.dateAdded.toLocaleDateString(undefined, dateOptions);
    
    viewMemeContent.innerHTML = `
        <div class="view-meme-image">
            <img src="${meme.imageUrl}" alt="${escapeHtml(meme.title)}">
        </div>
        <div class="view-meme-details">
            <h2>${escapeHtml(meme.title)}</h2>
            <div class="view-meme-meta">
                <span class="meta-item"><i class="fas fa-folder"></i> ${meme.category}</span>
                <span class="meta-item"><i class="fas fa-calendar"></i> ${formattedDate}</span>
                <span class="meta-item"><i class="fas fa-heart"></i> ${meme.likes} likes</span>
            </div>
            <div class="view-meme-description">
                <p>${escapeHtml(meme.description)}</p>
            </div>
            <div class="view-meme-actions">
                <button class="primary-btn" id="downloadMemeBtn">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="primary-btn" id="shareMemeBtn">
                    <i class="fas fa-share-alt"></i> Share
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const downloadBtn = viewMemeContent.querySelector('#downloadMemeBtn');
    downloadBtn.addEventListener('click', () => {
        // Create a temporary a element
        const a = document.createElement('a');
        a.href = meme.imageUrl;
        a.download = `${meme.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    
    const shareBtn = viewMemeContent.querySelector('#shareMemeBtn');
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: meme.title,
                text: meme.description,
                url: window.location.href
            }).catch(error => {
                console.error('Error sharing:', error);
                showNotification('Sharing failed. Try again later.', 'error');
            });
        } else {
            // Fallback for browsers that don't support the Share API
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('Link copied to clipboard! 📋');
            }).catch(() => {
                showNotification('Failed to copy link 😕', 'error');
            });
        }
    });
    
    // Open the modal
    viewMemeModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModalHandler(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function updateStats() {
    // Count total memes
    statsTotalMemes.textContent = memes.length;
    
    // Count unique categories
    const uniqueCategories = [...new Set(memes.map(meme => meme.category))];
    statsTotalCategories.textContent = uniqueCategories.length;
    
    // Count featured memes
    const featuredCount = memes.filter(meme => meme.featured).length;
    statsFeaturedMemes.textContent = featuredCount;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Add CSS for the new loading style
const style = document.createElement('style');
style.textContent = `
    .meme-image-container {
        position: relative;
        width: 100%;
        padding-top: 75%; /* 4:3 Aspect Ratio */
        overflow: hidden;
        background-color: #f0f0f0;
    }

    .meme-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .image-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #777;
        font-size: 1rem;
        text-align: center;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .fa-spin {
        animation: spin 1s linear infinite;
        font-size: 2rem;
        margin-bottom: 10px;
    }

    .notification {
        position: fixed;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-gradient, linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%));
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .notification.error {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .notification.show {
        bottom: 20px;
    }
`;
document.head.appendChild(style);

// Initial Render
renderMemes(filterMemes());
renderFeaturedMemes();
