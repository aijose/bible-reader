export function getVerseFromSelection(selection, verseElements) {
  if (!selection || selection.isCollapsed) {
    return null;
  }
  
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  
  let verseElement = null;
  
  if (container.nodeType === Node.TEXT_NODE) {
    verseElement = container.parentElement;
  } else {
    verseElement = container;
  }
  
  while (verseElement && !verseElement.dataset?.verseId) {
    verseElement = verseElement.parentElement;
    if (verseElement === document.body) {
      return null;
    }
  }
  
  return verseElement?.dataset?.verseId || null;
}

export function isSelectionWithinSingleVerse(selection, verseElements) {
  if (!selection || selection.isCollapsed) {
    return false;
  }
  
  const range = selection.getRangeAt(0);
  const startVerse = getVerseFromPosition(range.startContainer, verseElements);
  const endVerse = getVerseFromPosition(range.endContainer, verseElements);
  
  return startVerse === endVerse && startVerse !== null;
}

function getVerseFromPosition(node, verseElements) {
  let current = node;
  
  while (current && current !== document.body) {
    if (current.dataset?.verseId) {
      return current.dataset.verseId;
    }
    current = current.parentElement;
  }
  
  return null;
}

export function clearSelection() {
  if (window.getSelection) {
    const selection = window.getSelection();
    if (selection.removeAllRanges) {
      selection.removeAllRanges();
    }
  }
}

export function createSelectionIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'selection-indicator';
  indicator.innerHTML = `
    <div class="bg-blue-600 text-white px-2 py-1 rounded shadow-lg text-sm cursor-pointer hover:bg-blue-700 transition-colors">
      View Commentary
    </div>
  `;
  return indicator;
}

export function positionIndicator(indicator, selection) {
  if (!selection || selection.isCollapsed) {
    return;
  }
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  indicator.style.position = 'absolute';
  indicator.style.left = `${rect.left + window.scrollX}px`;
  indicator.style.top = `${rect.bottom + window.scrollY + 5}px`;
  indicator.style.zIndex = '1000';
}

export function setupTextSelectionHandler(containerElement, onVerseSelect) {
  if (!containerElement) return;
  
  let selectionIndicator = null;
  
  function handleSelection() {
    const selection = window.getSelection();
    
    if (selectionIndicator) {
      document.body.removeChild(selectionIndicator);
      selectionIndicator = null;
    }
    
    if (!selection || selection.isCollapsed) {
      return;
    }
    
    const verseElements = containerElement.querySelectorAll('[data-verse-id]');
    
    if (!isSelectionWithinSingleVerse(selection, verseElements)) {
      clearSelection();
      return;
    }
    
    const verseId = getVerseFromSelection(selection, verseElements);
    if (!verseId) {
      return;
    }
    
    selectionIndicator = createSelectionIndicator();
    positionIndicator(selectionIndicator, selection);
    document.body.appendChild(selectionIndicator);
    
    selectionIndicator.addEventListener('click', () => {
      onVerseSelect(verseId);
      if (selectionIndicator) {
        document.body.removeChild(selectionIndicator);
        selectionIndicator = null;
      }
      clearSelection();
    });
  }
  
  function handleClickOutside(event) {
    if (selectionIndicator && !selectionIndicator.contains(event.target)) {
      document.body.removeChild(selectionIndicator);
      selectionIndicator = null;
      clearSelection();
    }
  }
  
  containerElement.addEventListener('mouseup', handleSelection);
  containerElement.addEventListener('touchend', handleSelection);
  document.addEventListener('click', handleClickOutside);
  
  return () => {
    containerElement.removeEventListener('mouseup', handleSelection);
    containerElement.removeEventListener('touchend', handleSelection);
    document.removeEventListener('click', handleClickOutside);
    
    if (selectionIndicator) {
      document.body.removeChild(selectionIndicator);
    }
  };
}