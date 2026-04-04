# Purdue Fuel Initiative Website

Website for Purdue Fuel Initiative (PFI), a student club at Purdue University in West Lafayette. Most members are Chemical Engineering undergraduate students.

## Links

- https://www.purduefuelinitiative.org
- https://Purdue-Fuel-Initiative.github.io/pfi-web/

## Local Development

Run a local static file server from the repository root:

```sh
python3 -m http.server 8000 -d src
```

Then open <http://localhost:8000>.

## Contributing

This repository contains a simple static site. The live website is published from the files in `src/`.

### Project Structure

- `src/index.html`: main page content
- `src/styles.css`: site styling
- `src/`: published static assets
- `.github/workflows/deploy.yml`: automatic GitHub Pages deployment workflow

### Deployment

This site is deployed with GitHub Pages using GitHub Actions.

Any change pushed to `master` will automatically update the live site after the deployment workflow finishes.

Because `master` deploys to production, contributors should usually make changes in a branch and open a pull request instead of pushing directly to `master`.

### Custom Domain and DNS

The site uses the custom domain `purduefuelinitiative.org`.

DNS for this domain is managed outside this repository. If DNS records or other domain settings need to be changed, contact Paras Mittal.

## Brand

- Primary dark: `#151316`
- Primary light: `#F7F7F7`
- Accent red: `#CB001B`
