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


{% set bookId = eleventy.serverless.path.id %}
{{ bookId }}

{% set book = fetchedBook %}
{% include 'components/book.njk' %}

<pre>
{{ fetchedBook | dump }}
</pre>
