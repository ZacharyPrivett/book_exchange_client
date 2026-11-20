import DOMPurify from 'dompurify';

// Book descriptions (e.g. from Google Books) arrive as HTML with simple
// formatting tags. Strip everything except a small allowlist before
// rendering so untrusted markup can't inject scripts or other elements.
const ALLOWED_DESCRIPTION_TAGS = ['b', 'i', 'br', 'strong', 'em', 'p'];

export const sanitizeDescriptionHtml = (html: string | null | undefined): string =>
  html
    ? DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ALLOWED_DESCRIPTION_TAGS,
        ALLOWED_ATTR: [],
      })
    : '';
