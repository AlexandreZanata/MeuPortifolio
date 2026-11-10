# Architecture decision records

Short records of decisions that shaped the project and would be expensive to reverse.
Each one states the context, the decision, what it costs and what was rejected.

| #                                        | Decision                                               | Status   |
| ---------------------------------------- | ------------------------------------------------------ | -------- |
| [0001](0001-next-static-export.md)       | Next.js App Router, exported as static files           | Accepted |
| [0002](0002-typed-content-over-mdx.md)   | Typed TypeScript content instead of MDX or a CMS       | Accepted |
| [0003](0003-i18n-routing.md)             | Locale as a URL segment, shared slugs, no i18n library | Accepted |
| [0004](0004-github-snapshot.md)          | GitHub data from a committed snapshot                  | Accepted |
| [0005](0005-light-theme-only.md)         | A single light theme                                   | Accepted |
| [0006](0006-mailto-over-contact-form.md) | A mailto link instead of a contact form                | Accepted |

To add one, copy the structure of an existing record, give it the next number and list it
here. A record is never rewritten when the decision changes: add a new one that supersedes
it and update the status.
