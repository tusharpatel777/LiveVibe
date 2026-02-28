const IFRAME_PATTERNS = [
  {
    regex: /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]+)/,
    label: 'YouTube',
  },
  {
    regex: /twitch\.tv\/(?:videos\/(\d+)|(\w+))/,
    label: 'Twitch',
  },
  {
    regex: /dailymotion\.com\/video\/([\w]+)/,
    label: 'Dailymotion',
  },
];

export function classifyVideoUrl(url) {
  if (!url || typeof url !== 'string') {
    return { isValid: false, type: null, label: null, error: 'URL is required' };
  }

  try {
    const parsed = new URL(url);

    if (parsed.pathname.endsWith('.m3u8')) {
      return { isValid: true, type: 'hls', label: 'HLS Stream', error: null };
    }

    if (/\.(mp4|webm|ogg)(\?.*)?$/.test(parsed.pathname)) {
      return { isValid: true, type: 'direct', label: 'Direct Video', error: null };
    }

    for (const pattern of IFRAME_PATTERNS) {
      if (url.match(pattern.regex)) {
        return { isValid: true, type: 'iframe', label: pattern.label, error: null };
      }
    }

    return { isValid: false, type: null, label: null, error: 'Unsupported URL format' };
  } catch {
    return { isValid: false, type: null, label: null, error: 'Invalid URL' };
  }
}
