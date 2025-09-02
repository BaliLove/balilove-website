import React from 'react';

/**
 * Convert Bubble rich text format to clean HTML
 * Handles [b][/b], [h2][/h2], etc. formatting
 */
export function formatBubbleText(text: string): string {
  if (!text) return ''
  
  return text
    // Remove empty heading tags
    .replace(/\[h[1-6]\]\s*\[\/h[1-6]\]/g, '')
    
    // Convert bold tags
    .replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
    
    // Convert italic tags
    .replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>')
    
    // Convert heading tags
    .replace(/\[h1\](.*?)\[\/h1\]/g, '<h1>$1</h1>')
    .replace(/\[h2\](.*?)\[\/h2\]/g, '<h2>$1</h2>')
    .replace(/\[h3\](.*?)\[\/h3\]/g, '<h3>$1</h3>')
    
    // Convert line breaks to paragraphs
    .split('\n\n')
    .filter(paragraph => paragraph.trim().length > 0)
    .map(paragraph => paragraph.trim())
    .filter(paragraph => !paragraph.match(/^\[\/?\w+\]$/)) // Remove standalone tags
    .join('</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
    
    // Clean up multiple spaces and line breaks
    .replace(/\s+/g, ' ')
    .replace(/<p>\s*<\/p>/g, '') // Remove empty paragraphs
}

/**
 * Convert formatted text to React JSX elements
 */
export function formatBubbleTextToJSX(text: string): JSX.Element[] {
  const formatted = formatBubbleText(text)
  
  // Split by paragraph tags and create React elements
  const paragraphs = formatted
    .split('</p><p>')
    .map(p => p.replace(/^<p>|<\/p>$/g, ''))
    .filter(p => p.trim().length > 0)
  
  return paragraphs.map((paragraph, index) => (
    <p 
      key={index} 
      className="mb-4 leading-relaxed text-base"
      dangerouslySetInnerHTML={{ __html: paragraph }}
    />
  ))
}

/**
 * Extract clean text without formatting (for meta descriptions, etc.)
 */
export function extractCleanText(text: string): string {
  return formatBubbleText(text)
    .replace(/<[^>]*>/g, '') // Strip all HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}