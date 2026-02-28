const IFRAME_PATTERNS = [
  {
    regex: /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]+)/,
    toEmbed: (match) => `https://www.youtube.com/embed/${match[1]}?autoplay=1&enablejsapi=1`,
  },
  {
    regex: /twitch\.tv\/(?:videos\/(\d+)|(\w+))/,
    toEmbed: (match, domain) => {
      if (match[1]) return `https://player.twitch.tv/?video=${match[1]}&parent=${domain}`;
      return `https://player.twitch.tv/?channel=${match[2]}&parent=${domain}`;
    },
  },
  {
    regex: /dailymotion\.com\/video\/([\w]+)/,
    toEmbed: (match) => `https://www.dailymotion.com/embed/video/${match[1]}`,
  },
];

export function classifyVideoUrl(url, domain = 'localhost') {
  if (!url || typeof url !== 'string') {
    return { isValid: false, type: null, embedUrl: null, error: 'URL is required' };
  }

  try {
    const parsed = new URL(url);

    if (parsed.pathname.endsWith('.m3u8')) {
      return { isValid: true, type: 'hls', embedUrl: url, error: null };
    }

    if (/\.(mp4|webm|ogg)(\?.*)?$/.test(parsed.pathname)) {
      return { isValid: true, type: 'direct', embedUrl: url, error: null };
    }

    for (const pattern of IFRAME_PATTERNS) {
      const match = url.match(pattern.regex);
      if (match) {
        return { isValid: true, type: 'iframe', embedUrl: pattern.toEmbed(match, domain), error: null };
      }
    }

    return { isValid: false, type: null, embedUrl: null, error: 'Unsupported video URL. Supported: YouTube, Twitch, Dailymotion, .m3u8, .mp4' };
  } catch {
    return { isValid: false, type: null, embedUrl: null, error: 'Invalid URL format' };
  }
}
