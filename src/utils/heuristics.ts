export interface HeuristicResult {
  normalizedUrl: string;
  domain: string;
  title: string;
  description: string;
  tags: string[];
  readingTimeMinutes: number;
  faviconUrl: string;
  category?: string;
}

export function guessMetadataFromUrl(rawInput: string): HeuristicResult {
  let trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      normalizedUrl: '',
      domain: '',
      title: '',
      description: '',
      tags: [],
      readingTimeMinutes: 3,
      faviconUrl: '',
    };
  }

  // 1. Automatic Protocol Normalization
  let normalizedUrl = trimmed;
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  // 2. Domain Extraction
  let domain = '';
  let pathname = '';
  try {
    const parsed = new URL(normalizedUrl);
    domain = parsed.hostname.replace(/^www\./i, '');
    pathname = parsed.pathname + parsed.search;
  } catch {
    domain = trimmed.split('/')[0].replace(/^www\./i, '');
  }

  // 3. Heuristic Enrichment & Smart Tagging
  let title = domain;
  let description = `Saved bookmark from ${domain}`;
  const tagsSet = new Set<string>();
  let readingTimeMinutes = 4;
  let category = 'General';

  const lowerDomain = domain.toLowerCase();
  const lowerPath = pathname.toLowerCase();

  if (lowerDomain.includes('github.com')) {
    category = 'Development';
    tagsSet.add('Dev');
    tagsSet.add('Code');
    tagsSet.add('OpenSource');
    readingTimeMinutes = 7;

    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const repoOwner = parts[0];
      const repoName = parts[1];
      title = `${repoOwner}/${repoName}`;
      description = `GitHub Repository: ${repoOwner}/${repoName} - Source code, issues, and release details.`;
    } else {
      title = 'GitHub Workspace';
      description = 'GitHub code hosting and project hub.';
    }
  } else if (lowerDomain.includes('youtube.com') || lowerDomain.includes('youtu.be')) {
    category = 'Media';
    tagsSet.add('Video');
    tagsSet.add('Media');
    readingTimeMinutes = 12;
    title = 'YouTube Video Content';
    description = 'High velocity video stream & media recording.';
  } else if (lowerDomain.includes('twitter.com') || lowerDomain.includes('x.com')) {
    category = 'Social';
    tagsSet.add('Social');
    tagsSet.add('Signal');
    readingTimeMinutes = 2;
    title = 'X / Twitter Post';
    description = 'Social post broadcast and ecosystem discussion.';
  } else if (lowerDomain.includes('figma.com')) {
    category = 'Design';
    tagsSet.add('Design');
    tagsSet.add('Canvas');
    readingTimeMinutes = 5;
    title = 'Figma Design Canvas';
    description = 'Interactive UI/UX canvas, design tokens, and vector wireframes.';
  } else if (lowerDomain.includes('medium.com') || lowerDomain.includes('dev.to') || lowerDomain.includes('substack.com')) {
    category = 'Articles';
    tagsSet.add('Article');
    tagsSet.add('Reading');
    readingTimeMinutes = 6;
    title = `${domain.split('.')[0].toUpperCase()} Article`;
    description = 'Long-form article, deep dive insights, and technical writing.';
  } else if (lowerDomain.includes('docs.') || lowerPath.includes('doc') || lowerPath.includes('api')) {
    category = 'Documentation';
    tagsSet.add('Docs');
    tagsSet.add('Reference');
    readingTimeMinutes = 8;
    title = `${domain} Documentation`;
    description = 'API reference docs, technical manuals, and architecture specs.';
  } else {
    tagsSet.add('Web');
    tagsSet.add('Bookmark');
    // Simple heuristic reading time based on length of domain + path
    readingTimeMinutes = Math.max(2, Math.min(15, Math.ceil((pathname.length + 20) / 10)));
  }

  // 4. Favicon Resolution via Google's S2 CDN service
  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
    : '';

  return {
    normalizedUrl,
    domain,
    title,
    description,
    tags: Array.from(tagsSet),
    readingTimeMinutes,
    faviconUrl,
    category,
  };
}
