/**
 * Wikiviews MCP — wraps the Wikimedia Pageviews API (free, no auth)
 * https://wikimedia.org/api/rest_v1/metrics/pageviews
 *
 * Tools:
 * - get_article_views: daily pageviews for a specific Wikipedia article
 * - get_top_articles: top viewed articles for a specific day
 * - get_project_views: aggregate daily pageviews for all of English Wikipedia
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://wikimedia.org/api/rest_v1/metrics/pageviews';

const tools: McpToolExport['tools'] = [
  {
    name: 'get_article_views',
    description:
      'Get daily pageview counts for a specific Wikipedia article over a date range. Dates must be in YYYYMMDD format.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Wikipedia article title, URL-encoded if needed (e.g. "Albert_Einstein")',
        },
        start: {
          type: 'string',
          description: 'Start date in YYYYMMDD format (e.g. "20240101")',
        },
        end: {
          type: 'string',
          description: 'End date in YYYYMMDD format (e.g. "20240131")',
        },
      },
      required: ['title', 'start', 'end'],
    },
  },
  {
    name: 'get_top_articles',
    description:
      'Get the most viewed Wikipedia articles for a specific day. Returns up to 1000 articles ranked by view count.',
    inputSchema: {
      type: 'object',
      properties: {
        year: { type: 'string', description: 'Year as 4-digit string (e.g. "2024")' },
        month: { type: 'string', description: 'Month as zero-padded 2-digit string (e.g. "01")' },
        day: { type: 'string', description: 'Day as zero-padded 2-digit string (e.g. "15")' },
      },
      required: ['year', 'month', 'day'],
    },
  },
  {
    name: 'get_project_views',
    description:
      'Get aggregate daily pageview totals for all of English Wikipedia over a date range. Dates must be in YYYYMMDD format.',
    inputSchema: {
      type: 'object',
      properties: {
        start: {
          type: 'string',
          description: 'Start date in YYYYMMDD format (e.g. "20240101")',
        },
        end: {
          type: 'string',
          description: 'End date in YYYYMMDD format (e.g. "20240131")',
        },
      },
      required: ['start', 'end'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_article_views':
      return getArticleViews(args.title as string, args.start as string, args.end as string);
    case 'get_top_articles':
      return getTopArticles(args.year as string, args.month as string, args.day as string);
    case 'get_project_views':
      return getProjectViews(args.start as string, args.end as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

const HEADERS = {
  'User-Agent': 'pipeworx-mcp/1.0 (https://pipeworx.io)',
};

async function getArticleViews(title: string, start: string, end: string) {
  const encodedTitle = encodeURIComponent(title);
  const url = `${BASE_URL}/per-article/en.wikipedia/all-access/all-agents/${encodedTitle}/daily/${start}/${end}`;

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Wikimedia API error: ${res.status}`);

  const data = (await res.json()) as {
    items: Array<{ article: string; timestamp: string; views: number }>;
  };

  const total = data.items.reduce((sum, item) => sum + item.views, 0);

  return {
    article: title,
    start,
    end,
    total_views: total,
    daily: data.items.map((item) => ({
      date: item.timestamp.slice(0, 8),
      views: item.views,
    })),
  };
}

async function getTopArticles(year: string, month: string, day: string) {
  const url = `${BASE_URL}/top/en.wikipedia/all-access/${year}/${month}/${day}`;

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Wikimedia API error: ${res.status}`);

  const data = (await res.json()) as {
    items: Array<{
      articles: Array<{ article: string; views: number; rank: number }>;
    }>;
  };

  const articles = data.items[0]?.articles ?? [];

  return {
    date: `${year}-${month}-${day}`,
    count: articles.length,
    articles: articles.map((a) => ({
      rank: a.rank,
      article: a.article.replace(/_/g, ' '),
      views: a.views,
    })),
  };
}

async function getProjectViews(start: string, end: string) {
  const url = `${BASE_URL}/aggregate/en.wikipedia/all-access/all-agents/daily/${start}/${end}`;

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Wikimedia API error: ${res.status}`);

  const data = (await res.json()) as {
    items: Array<{ timestamp: string; views: number }>;
  };

  const total = data.items.reduce((sum, item) => sum + item.views, 0);

  return {
    project: 'en.wikipedia',
    start,
    end,
    total_views: total,
    daily: data.items.map((item) => ({
      date: item.timestamp.slice(0, 8),
      views: item.views,
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
