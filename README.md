# os-sm-site

This is the self-owned GitHub Pages site for:

- `https://os-sm.84000.art/`

Owner:

- GitHub: `radar-oasis`
- Repository: `radar-oasis/os-sm-site`

## Publishing Model

- GitHub Pages source: `main` branch, `/docs` folder
- Public site files live in `docs/`
- Custom domain is declared in `docs/CNAME`

The domain operator manages DNS. This repository manages website content.

## Local Preview

```bash
python3 -m http.server 8080 --directory docs
open http://127.0.0.1:8080/
```

## Smoke Test

```bash
bash scripts/smoke.sh
bash scripts/smoke.sh https://os-sm.84000.art/
```

## Daily Update Flow

```bash
git switch main
git pull --ff-only
# edit docs/
bash scripts/smoke.sh
git add docs README.md scripts
git commit -m "Update site content"
git push origin main
```

## DNS Target

After GitHub Pages is ready, the DNS record should be:

```text
os-sm.84000.art CNAME radar-oasis.github.io
```

Do not commit server credentials, registrar passwords, SSH keys, API tokens, or
private notes into this repository.
