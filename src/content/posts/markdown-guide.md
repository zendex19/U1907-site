---
id: markdown-guide
title: Writing Posts — Markdown Guide
category: meta
date: April 19, 2026
tags: Markdown, Reference, Meta
---

## Overview

This site renders posts from plain Markdown files placed in `src/content/posts/`. The parser is custom and supports a focused subset of Markdown plus a few extras: filenames on code blocks, image captions, tables, and callouts.

This post is a complete reference for what you can and can't write.

## Frontmatter

Every post starts with a YAML-like frontmatter block. Five fields are recognized:

```text
# filename: my-post.md
---
id: my-post
title: My Post Title
category: notes
date: April 19, 2026
tags: Tag One, Tag Two, Tag Three
---
```

- `id` — must be unique; becomes the URL slug at `/blog/<id>`.
- `title` — shown in the sidebar, listings, and as the article H1.
- `category` — used for grouping.
- `date` — any human-readable date string (used for sorting, newest first).
- `tags` — comma-separated; rendered as badges and used by the tags page.

## Headings

Only H1, H2, and H3 are parsed. The title from frontmatter already renders as H1 on the page, so in body content stick to `##` and `###`.

```text
## Section heading
### Subsection heading
```

## Paragraphs and inline code

Consecutive non-empty lines are joined into a single paragraph. Wrap inline code in backticks — `like this` — and it gets a subtle background.

## Lists

Unordered lists use `-` or `*`:

- First item
- Second item
- Third item

Ordered lists use `1.`, `2.`, etc.:

1. Step one
2. Step two
3. Step three

Lists must be flat — nested lists aren't parsed.

## Code blocks

Fenced with triple backticks. The language goes right after the opening fence and drives syntax highlighting.

```python
def greet(name: str) -> str:
    return f"hello, {name}"
```

### Filename label

Add a comment on the very first line of the block in the form `# filename: <name>` (or `// filename: <name>` for C-style languages) and it renders as a label in the code block header.

```text
```python
# filename: greet.py
def greet(name): ...
```
```

## Blockquotes

Lines starting with `> ` become a single blockquote.

> Quotes are joined together until the first non-quote line.

## Horizontal rules

Three or more dashes or asterisks on their own line:

---

## Images

Standard Markdown image syntax. An optional caption can follow the URL in quotes.

```text
![alt text](https://example.com/image.png)
![alt text](https://example.com/image.png "Optional caption shown below")
```

Images render with rounded corners and open in a zoomed preview when clicked.

## Tables

GitHub-style pipe tables. The separator row is required.

```text
| Column A | Column B | Column C |
| -------- | -------- | -------- |
| one      | two      | three    |
| four     | five     | six      |
```

| Column A | Column B | Column C |
| -------- | -------- | -------- |
| one      | two      | three    |
| four     | five     | six      |

Use `\|` to escape a literal pipe inside a cell.

## Callouts

Four variants are available, all using `:::` fences. The label after the variant is optional — it overrides the default title.

```text
:::note Optional title
Body text goes here. Inline `code` works too.
:::
```

:::note
A neutral aside. Use for context or background information.
:::

:::tip
A helpful suggestion. Slightly more emphasis than a note.
:::

:::warning Heads up
Something to watch out for. The only callout that keeps a colored rail.
:::

:::question
A rhetorical or open question worth thinking about.
:::

## Links

Standard inline links: `[label](https://example.com)`. They render with an underline and a subtle hover background.

## What's not supported

To keep the parser simple and the design consistent, these are intentionally left out:

- Nested lists
- Task lists (`- [ ]`)
- Inline HTML
- Footnotes
- Setext-style headings (`===` / `---` under text)
- Reference-style links

If you need something here, the parser lives in `src/lib/markdown.ts` and is straightforward to extend.

## Workflow

1. Drop a new `.md` file into `src/content/posts/`.
2. Fill in the frontmatter.
3. Write the body using the syntax above.
4. The post appears automatically — no registration step, no rebuild config.

That's the whole system.
