// ===================================
// JOURNAL FILTERING & SEARCH
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initJournalFilters();
});

function initJournalFilters() {
    const searchInput = document.getElementById('journal-search');
    const typeFilter = document.getElementById('type-filter');
    const topicFilter = document.getElementById('topic-filter');
    const sortSelect = document.getElementById('sort-select');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const searchClear = document.querySelector('.search-clear');
    const resultsCount = document.getElementById('results-count');
    const activeFilters = document.getElementById('active-filters');
    const noResults = document.getElementById('no-results');
    const resetSearchBtn = document.getElementById('reset-search');
    const journalGrid = document.getElementById('journal-grid');
    
    if (!journalGrid) return;
    
    const cards = Array.from(journalGrid.querySelectorAll('.journal-card'));
    
    // Parse URL parameters for pre-filtering
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('type')) {
        typeFilter.value = urlParams.get('type');
    }
    if (urlParams.has('topic')) {
        topicFilter.value = urlParams.get('topic');
    }
    
    // Initial filter
    filterCards();
    
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            filterCards();
            
            // Show/hide clear button
            if (this.value.trim()) {
                searchClear.removeAttribute('hidden');
            } else {
                searchClear.setAttribute('hidden', '');
            }
        }, 300));
    }
    
    // Clear search
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            this.setAttribute('hidden', '');
            filterCards();
            searchInput.focus();
        });
    }
    
    // Filter dropdowns
    if (typeFilter) {
        typeFilter.addEventListener('change', filterCards);
    }
    
    if (topicFilter) {
        topicFilter.addEventListener('change', filterCards);
    }
    
    // Sort
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortCards(this.value);
            filterCards();
        });
    }
    
    // Clear all filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            searchInput.value = '';
            typeFilter.value = '';
            topicFilter.value = '';
            sortSelect.value = 'date-desc';
            searchClear.setAttribute('hidden', '');
            
            // Reset URL
            window.history.replaceState({}, '', window.location.pathname);
            
            sortCards('date-desc');
            filterCards();
        });
    }
    
    // Reset search button in no results
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            typeFilter.value = '';
            topicFilter.value = '';
            sortSelect.value = 'date-desc';
            searchClear.setAttribute('hidden', '');
            
            sortCards('date-desc');
            filterCards();
        });
    }
    
    function filterCards() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const typeValue = typeFilter.value;
        const topicValue = topicFilter.value;
        
        let visibleCount = 0;
        const activeFiltersList = [];
        
        cards.forEach(card => {
            const cardType = card.getAttribute('data-type');
            const cardTopic = card.getAttribute('data-topic');
            const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
            const cardExcerpt = card.querySelector('.card-excerpt').textContent.toLowerCase();
            
            let matches = true;
            
            // Search filter
            if (searchTerm && !cardTitle.includes(searchTerm) && !cardExcerpt.includes(searchTerm)) {
                matches = false;
            }
            
            // Type filter
            if (typeValue && cardType !== typeValue) {
                matches = false;
            }
            
            // Topic filter
            if (topicValue && cardTopic !== topicValue) {
                matches = false;
            }
            
            // Show/hide card
            if (matches) {
                card.removeAttribute('hidden');
                card.style.display = '';
                visibleCount++;
            } else {
                card.setAttribute('hidden', '');
                card.style.display = 'none';
            }
        });
        
        // Update results count
        if (resultsCount) {
            const countText = visibleCount === 1 ? 'article' : 'articles';
            resultsCount.innerHTML = `Showing <strong>${visibleCount}</strong> ${countText}`;
        }
        
        // Show/hide no results message
        if (noResults) {
            if (visibleCount === 0) {
                noResults.removeAttribute('hidden');
                journalGrid.style.display = 'none';
            } else {
                noResults.setAttribute('hidden', '');
                journalGrid.style.display = '';
            }
        }
        
        // Update active filters display
        if (searchTerm) {
            activeFiltersList.push({
                label: `Search: "${searchTerm}"`,
                clear: () => {
                    searchInput.value = '';
                    searchClear.setAttribute('hidden', '');
                    filterCards();
                }
            });
        }
        
        if (typeValue) {
            const typeLabel = typeFilter.options[typeFilter.selectedIndex].text;
            activeFiltersList.push({
                label: `Type: ${typeLabel}`,
                clear: () => {
                    typeFilter.value = '';
                    filterCards();
                }
            });
        }
        
        if (topicValue) {
            const topicLabel = topicFilter.options[topicFilter.selectedIndex].text;
            activeFiltersList.push({
                label: `Topic: ${topicLabel}`,
                clear: () => {
                    topicFilter.value = '';
                    filterCards();
                }
            });
        }
        
        // Display active filters
        if (activeFilters) {
            const filtersList = activeFilters.querySelector('.active-filters-list');
            
            if (activeFiltersList.length > 0) {
                activeFilters.removeAttribute('hidden');
                filtersList.innerHTML = activeFiltersList.map(filter => `
                    <span class="filter-tag" role="listitem">
                        ${filter.label}
                        <button type="button" aria-label="Remove filter" class="filter-remove">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </span>
                `).join('');
                
                // Add event listeners to remove buttons
                filtersList.querySelectorAll('.filter-remove').forEach((btn, index) => {
                    btn.addEventListener('click', activeFiltersList[index].clear);
                });
            } else {
                activeFilters.setAttribute('hidden', '');
            }
        }
    }
    
    function sortCards(sortBy) {
        const sortedCards = [...cards].sort((a, b) => {
            switch(sortBy) {
                case 'date-desc':
                    return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                
                case 'date-asc':
                    return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
                
                case 'title-asc':
                    return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
                
                case 'title-desc':
                    return b.getAttribute('data-title').localeCompare(a.getAttribute('data-title'));
                
                default:
                    return 0;
            }
        });
        
        // Reorder in DOM
        sortedCards.forEach(card => {
            journalGrid.appendChild(card);
        });
    }
    
    // Pill click handling for quick filters
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.includes('?')) {
                e.preventDefault();
                
                const urlParams = new URLSearchParams(href.split('?')[1]);
                
                if (urlParams.has('type')) {
                    typeFilter.value = urlParams.get('type');
                }
                
                if (urlParams.has('topic')) {
                    topicFilter.value = urlParams.get('topic');
                }
                
                filterCards();
                
                // Scroll to top of journal listing
                document.querySelector('.journal-controls').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Debounce function to limit search frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Announce results to screen readers
function announceResults(count) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    
    const countText = count === 1 ? 'article' : 'articles';
    announcement.textContent = `${count} ${countText} found`;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}
