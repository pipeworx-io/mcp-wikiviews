# @pipeworx/mcp-wikiviews

MCP server for Wikipedia pageview statistics

## Tools

| Tool | Description |
|------|-------------|
| `get_article_views` | Get daily pageview counts for a specific Wikipedia article |
| `get_top_articles` | Get the most viewed Wikipedia articles for a specific day |
| `get_project_views` | Get aggregate daily pageview totals for English Wikipedia |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "get_article_views",
      "arguments": { "title": "Albert_Einstein", "start": "20240101", "end": "20240131" }
    }
  }'
```

## License

MIT
