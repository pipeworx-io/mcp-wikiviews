# mcp-wikiviews

Wikiviews MCP — wraps the Wikimedia Pageviews API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_article_views` | Get daily pageview counts for a specific Wikipedia article over a date range. Dates must be in YYYYMMDD format. |
| `get_top_articles` | Get the most viewed Wikipedia articles for a specific day. Returns up to 1000 articles ranked by view count. |
| `get_project_views` | Get aggregate daily pageview totals for all of English Wikipedia over a date range. Dates must be in YYYYMMDD format. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "wikiviews": {
      "url": "https://gateway.pipeworx.io/wikiviews/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Wikiviews data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
