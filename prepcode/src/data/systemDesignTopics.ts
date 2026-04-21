export interface SystemDesignTopic {
  id: string
  label: string
  pitch: string
  starterPrompt: string
}

export const systemDesignTopics: SystemDesignTopic[] = [
  {
    id: 'messaging',
    label: 'Real-time messaging',
    pitch: 'Chat app like Slack or WhatsApp — online presence, delivery guarantees, read receipts.',
    starterPrompt: 'Give me a system design question about a real-time messaging or chat system.',
  },
  {
    id: 'feed',
    label: 'Feed ranking',
    pitch: 'Social timeline — fanout, ranking signals, personalization at scale.',
    starterPrompt: 'Give me a system design question about a feed or timeline ranking system.',
  },
  {
    id: 'file-storage',
    label: 'File storage',
    pitch: 'Dropbox or S3 — chunking, dedup, sync conflicts, permissioned sharing.',
    starterPrompt: 'Give me a system design question about a file storage or sharing service.',
  },
  {
    id: 'url-shortener',
    label: 'URL shortener',
    pitch: 'Classic warmup — ID generation, redirect latency, analytics pipeline.',
    starterPrompt: 'Give me a system design question about a URL shortener or link management service.',
  },
  {
    id: 'payments',
    label: 'Payments / checkout',
    pitch: 'Idempotency, double-charge protection, retries, ledger consistency.',
    starterPrompt: 'Give me a system design question about a payment or checkout system.',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    pitch: 'Push, email, SMS fanout — rate limits, preferences, delivery tracking.',
    starterPrompt: 'Give me a system design question about a notification delivery service.',
  },
  {
    id: 'search-autocomplete',
    label: 'Search autocomplete',
    pitch: 'Typeahead — trie structures, ranking, personalized suggestions, latency.',
    starterPrompt: 'Give me a system design question about a search autocomplete or typeahead service.',
  },
  {
    id: 'rate-limiter',
    label: 'Rate limiter / API gateway',
    pitch: 'Token bucket, distributed counters, per-user vs global limits.',
    starterPrompt: 'Give me a system design question about a rate limiter or API gateway.',
  },
  {
    id: 'video-streaming',
    label: 'Video streaming',
    pitch: 'Upload → transcode → CDN — adaptive bitrate, storage tiers, playback.',
    starterPrompt: 'Give me a system design question about a video or media streaming platform.',
  },
  {
    id: 'collab-doc',
    label: 'Collaborative editor',
    pitch: 'Google Docs — operational transforms vs CRDTs, conflict resolution.',
    starterPrompt: 'Give me a system design question about a collaborative document editor.',
  },
  {
    id: 'ride-sharing',
    label: 'Ride-sharing',
    pitch: 'Uber dispatch — geo indexing, matching, surge pricing, ETAs.',
    starterPrompt: 'Give me a system design question about a ride-sharing or dispatch system.',
  },
  {
    id: 'booking',
    label: 'Ticket / reservation booking',
    pitch: 'Seat inventory, double-booking prevention, timed holds, payment handoff.',
    starterPrompt: 'Give me a system design question about a ticket or reservation booking system.',
  },
]

export function pickRandomTopic(): SystemDesignTopic {
  return systemDesignTopics[Math.floor(Math.random() * systemDesignTopics.length)]
}

export function findTopic(id: string): SystemDesignTopic | undefined {
  return systemDesignTopics.find(t => t.id === id)
}
