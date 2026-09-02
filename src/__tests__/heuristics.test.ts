import { describe, it, expect } from 'vitest';
import { guessMetadataFromUrl } from '../utils/heuristics';

describe('Heuristic Metadata Sniffer (guessMetadataFromUrl)', () => {
  it('normalizes protocol when omitted', () => {
    const res = guessMetadataFromUrl('github.com/facebook/react');
    expect(res.normalizedUrl).toBe('https://github.com/facebook/react');
    expect(res.domain).toBe('github.com');
  });

  it('correctly enriches GitHub links with repo title and smart tags', () => {
    const res = guessMetadataFromUrl('https://github.com/tailwindlabs/tailwindcss');
    expect(res.title).toBe('tailwindlabs/tailwindcss');
    expect(res.tags).toContain('Dev');
    expect(res.tags).toContain('Code');
    expect(res.tags).toContain('OpenSource');
    expect(res.faviconUrl).toContain('google.com/s2/favicons?domain=github.com');
  });

  it('correctly enriches YouTube links with media category and video tags', () => {
    const res = guessMetadataFromUrl('youtube.com/watch?v=12345');
    expect(res.category).toBe('Media');
    expect(res.tags).toContain('Video');
    expect(res.tags).toContain('Media');
    expect(res.readingTimeMinutes).toBe(12);
  });

  it('correctly enriches X/Twitter links with social tags', () => {
    const res = guessMetadataFromUrl('https://x.com/user/status/100');
    expect(res.category).toBe('Social');
    expect(res.tags).toContain('Social');
    expect(res.tags).toContain('Signal');
  });

  it('correctly enriches Figma canvas links', () => {
    const res = guessMetadataFromUrl('figma.com/file/sample-canvas');
    expect(res.category).toBe('Design');
    expect(res.tags).toContain('Design');
    expect(res.tags).toContain('Canvas');
  });
});
