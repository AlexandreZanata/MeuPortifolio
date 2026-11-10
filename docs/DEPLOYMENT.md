# Deployment

`pnpm build` produces `out/`: a folder of static files that any static host can serve.
Nothing runs on the server.

## What the host must do

1. Serve `<path>/index.html` for `<path>/` (every static host does).
2. Serve `404.html` with status 404 for unknown paths.
3. Compress text responses (Brotli or gzip).
4. Send the headers below.
5. Optionally, redirect `/` by language (otherwise the exported root page does it in the
   browser).

`public/_headers` and `public/_redirects` already express points 4 and 5 for hosts that
read those files.

## Options

| Host                               | Fit                                                                      | Notes                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| **Cloudflare Pages** (recommended) | Reads `_headers` and `_redirects`, global CDN, HTTP/3, free for this use | Build command `pnpm build`, output `out`, Node 24                                   |
| Netlify                            | Reads the same two files                                                 | Same settings                                                                       |
| Own server with nginx or Caddy     | Full control; fits if a VPS is already operated                          | Use the configuration below; add TLS                                                |
| GitHub Pages                       | Works for the files                                                      | Cannot set custom response headers, so no CSP and no cache policy; `404.html` works |
| Vercel                             | Works                                                                    | Headers go in `vercel.json` instead of `_headers`                                   |

The choice of host is the site owner's and is not encoded in the repository: there is no
deploy workflow yet. Once the host is chosen, add its deploy step after the `quality` job
in `.github/workflows/ci.yml`, reusing the `site` artifact so that what was tested is
what gets published.

## Headers

| Header                       | Value                                          | Why                                        |
| ---------------------------- | ---------------------------------------------- | ------------------------------------------ |
| `Content-Security-Policy`    | see below                                      | Only same-origin resources can load        |
| `Strict-Transport-Security`  | `max-age=63072000; includeSubDomains; preload` | HTTPS only                                 |
| `X-Content-Type-Options`     | `nosniff`                                      | No MIME sniffing                           |
| `X-Frame-Options`            | `DENY`                                         | No framing (also `frame-ancestors 'none'`) |
| `Referrer-Policy`            | `strict-origin-when-cross-origin`              | Do not leak paths to other sites           |
| `Permissions-Policy`         | `camera=(), microphone=(), geolocation=()`     | The site uses no device features           |
| `Cross-Origin-Opener-Policy` | `same-origin`                                  | Isolate the browsing context               |

```text
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none';
base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests
```

`'unsafe-inline'` for scripts is a known compromise. A static export contains inline
scripts (the data React needs to hydrate, structured data), and without a server there is
no per-response nonce to allow them individually. The policy still blocks every
third-party origin, which is the realistic risk for a site with no user input and no
external scripts. If the site moves to a host with edge functions, switch to nonces.

Caching:

| Path              | `Cache-Control`                                                       |
| ----------------- | --------------------------------------------------------------------- |
| `/_next/static/*` | `public, max-age=31536000, immutable` (file names are content hashes) |
| `/art/*`, `/og/*` | `public, max-age=604800`                                              |
| everything else   | `public, max-age=0, must-revalidate`                                  |

## nginx

```nginx
server {
  listen 443 ssl;
  http2 on;
  server_name alexandrezanata.com.br;
  root /var/www/alexandrezanata/out;

  # TLS certificate directives go here.

  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml text/plain application/xml;
  # With the Brotli module: brotli on; brotli_types <same list>;

  error_page 404 /404.html;

  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
  add_header Cross-Origin-Opener-Policy "same-origin" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests" always;

  # Send Portuguese-speaking visitors to /pt-br/, everyone else to /en/.
  location = / {
    if ($http_accept_language ~* "^pt") { return 302 /pt-br/; }
    return 302 /en/;
  }

  location /_next/static/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
  }

  location / {
    add_header Cache-Control "public, max-age=0, must-revalidate";
    try_files $uri $uri/index.html =404;
  }
}

server {
  listen 80;
  server_name alexandrezanata.com.br www.alexandrezanata.com.br;
  return 301 https://alexandrezanata.com.br$request_uri;
}
```

`add_header` in a `location` block replaces the ones inherited from `server`, so in a
real configuration put the security headers in an `include` file and include it in every
location.

## After deploying

- [ ] `https://alexandrezanata.com.br/` lands on `/en/` or `/pt-br/`.
- [ ] An unknown URL returns status 404 with the bilingual page.
- [ ] `curl -sI` shows the security headers and `content-encoding: br` or `gzip`.
- [ ] `/sitemap.xml` and `/robots.txt` load; submit the sitemap in Search Console.
- [ ] Paste a page URL into a social-card validator: the image and title appear.
- [ ] Run PageSpeed Insights on the home page and a case study, mobile and desktop.
- [ ] `www.` and `http://` redirect to the canonical origin.

## Changing the domain

The origin is defined once, in `src/lib/site.ts`. Canonical URLs, `hreflang`, the sitemap
and social metadata derive from it. `e2e/pages.ts` holds the same value for the tests.
