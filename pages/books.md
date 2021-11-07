---
title: Books
permalink:
  build: /books/
  serverless: /books/:id

eleventyNavigation:
  key: Books
  order: 4
templateEngineOverride: njk
---

Here we go?
## Books

{{ eleventy.serverless.query|dump }}
{{ eleventy.serverless.path|dump }}

Testing 123

{{ 2 + 3 }}