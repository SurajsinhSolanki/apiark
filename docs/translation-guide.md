# ApiArk Translation Guide

Help translate ApiArk into your language!

## How Translations Work

ApiArk uses [react-i18next](https://react.i18next.com/) for internationalization. All UI strings are stored in JSON locale files under `apps/desktop/src/locales/`.

## Adding a New Language

1. Copy `apps/desktop/src/locales/en.json` to a new file named with your language code (e.g., `es.json`, `de.json`, `ja.json`, `zh-CN.json`)
2. Translate all string values (keep the keys unchanged)
3. Register the new locale in `apps/desktop/src/lib/i18n.ts`
4. Submit a pull request

## Translation Rules

### Do Translate

- All UI labels, buttons, tooltips
- Error messages and suggestions
- Dialog titles and descriptions
- Empty state messages
- Onboarding text

### Do NOT Translate

- YAML field names (`method`, `url`, `headers`, etc.)
- CLI commands (`apiark run`, `apiark import`)
- `ark` API method names (`ark.test`, `ark.expect`, etc.)
- Technical terms: HTTP, JSON, GraphQL, gRPC, WebSocket, SSE, REST, API, YAML, cURL, OAuth, JWT, PKCE
- Code editor content
- Variable syntax (`{{variableName}}`)
- Keyboard shortcuts (`Ctrl+S`, `Cmd+Enter`)

### Guidelines

- Keep translations concise — UI space is limited
- Preserve placeholder syntax: `{{count}}`, `{{name}}`, etc.
- Maintain the same tone: professional but friendly
- Use the formal register unless your language's conventions differ
- Test your translations in the app to verify layout and truncation

## File Structure

```
apps/desktop/src/locales/
  en.json      # English (source of truth)
  es.json      # Spanish
  de.json      # German
  fr.json      # French
  ...
```

## JSON Format

```json
{
  "sidebar": {
    "collections": "Collections",
    "history": "History",
    "search": "Search requests..."
  }
}
```

Keys are nested by feature area. Keep the structure flat within each section.

## Testing

```bash
cd apps/desktop
pnpm dev
```

Change your system language or add `?lng=es` to test. Verify:
- No text overflow or truncation issues
- Correct pluralization
- Date/number formatting (handled by `Intl` APIs, not translation files)

## Community Translation Platform

We plan to set up Weblate or Crowdin for easier community translation management. Until then, submit translations via pull requests.

## Questions?

Open an issue on GitHub with the `i18n` label.
