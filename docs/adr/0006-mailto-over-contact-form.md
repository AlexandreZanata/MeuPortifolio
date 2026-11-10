# 0006. A mailto link instead of a contact form

Status: accepted (2026-11)

## Context

Visitors, mostly recruiters and collaborators, need a way to get in touch.

## Options considered

|                      | `mailto:` link                        | Form with a form service            | Form with an own backend    |
| -------------------- | ------------------------------------- | ----------------------------------- | --------------------------- |
| Infrastructure       | None                                  | Third-party account                 | A server or function to run |
| Spam                 | Handled by the mailbox                | Needs a CAPTCHA or honeypot         | Same, plus rate limiting    |
| Privacy              | No processor involved                 | Messages pass through a third party | Messages stored by the site |
| Cost                 | Free                                  | Free tier, then paid                | Hosting                     |
| Failure mode         | Visitor has no mail client configured | Service outage, quota               | Own outage                  |
| Visitor keeps a copy | Yes                                   | No                                  | No                          |

## Decision

The Contact page lists direct channels: an e-mail address as a `mailto:` link, LinkedIn
and GitHub. There is no form.

A static site has nowhere to post a form to, so a form means adding either a third party
that reads every message or a backend to operate and defend. Neither is justified for the
volume a personal site receives. Recruiters already work from their own mail client and
generally prefer a visible address they can copy.

## Consequences

- The address is published in the page source and will be harvested. Use an address
  meant to be public, with the provider's spam filtering.
- A visitor without a configured mail client can still copy the address, because the link
  text is the address itself.
- The site collects no personal data, which keeps the privacy statement one sentence
  long.
