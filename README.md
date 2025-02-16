# Surge PR Preview

[![CI status][github-action-image]][github-action-url]

[github-action-image]: https://github.com/afc163/surge-preview/workflows/build-test/badge.svg
[github-action-url]: https://github.com/afc163/surge-preview/actions?query=workflow%3Abuild-test

A GitHub action that preview website in [surge.sh](https://surge.sh/) for your pull requests.

<img width="800" alt="image" src="https://user-images.githubusercontent.com/507615/90243810-2230b480-de62-11ea-9a2c-9e869a2067dd.png">

<img width="800" alt="image" src="https://user-images.githubusercontent.com/507615/91127543-0be3ed80-e6d9-11ea-897f-977c346bbc77.png">

### Pros

Compare to Netlify/Vercel?

- It is **free**.
- It supports multiple preview jobs.

### Usage

Add a workflow (`.github/workflows/preview.yml`):

```yaml
name: 🔂 Surge PR Preview

on: [pull_request]

jobs:
  preview:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write # allow surge-preview to create/update PR comments
    steps:
      - uses: actions/checkout@v2
      - uses: afc163/surge-preview@v1
        id: preview_step
        with:
          surge_token: ${{ secrets.SURGE_TOKEN }}
          dist: public
          build: |
            npm install
            npm run build
      - name: Get the preview_url
        run: echo "url => ${{ steps.preview_step.outputs.preview_url }}"
```

The preview website url will be `https://{{repository.owner}}-{{repository.name}}-{{job.name}}-pr-{{pr.number}}.surge.sh`.

#### Multiple Jobs

```yaml
name: 🔂 Surge PR Preview

on: [pull_request]

permissions:
  pull-requests: write # allow surge-preview to create/update PR comments

jobs:
  preview-job-1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: afc163/surge-preview@v1
        with:
          surge_token: ${{ secrets.SURGE_TOKEN }}
          dist: public
          build: |
            npm install
            npm run build
  preview-job-2:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: afc163/surge-preview@v1
        with:
          surge_token: ${{ secrets.SURGE_TOKEN }}
          dist: public
          suffix: "-xyz"
          build: |
            npm install
            npm run build
```

The preview website urls will be:

- `https://{{repository.owner}}-{{repository.name}}-preview-job-1-pr-{{pr.number}}.surge.sh`
- `https://{{repository.owner}}-{{repository.name}}-preview-job-2-pr-{{pr.number}}-xyz.surge.sh`

### Teardown

When a pull request is closed and teardown is set to 'true', then the surge instance will be destroyed.

```yaml
name: 🔂 Surge PR Preview

on:
  pull_request:
    # when using teardown: 'true', add default event types + closed event type
    types: [opened, synchronize, reopened, closed]
  push:

jobs:
  preview:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write # allow surge-preview to create/update PR comments
    steps:
      - uses: actions/checkout@v2
      - uses: afc163/surge-preview@v1
        with:
          surge_token: ${{ secrets.SURGE_TOKEN }}
          dist: public
          teardown: 'true'
          build: |
            npm install
            npm run build
```

### Inputs

- `surge_token`: [Getting your Surge token](https://surge.sh/help/integrating-with-circleci).
- `github_token`: Defaults: [`github.token`](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow). It is used to create Pull Request comment, so it requires the `pull-requests` permission set to `write` permission. Possible value: `secrets.GITHUB_TOKEN`.
- `build`: build scripts to run before deploy.
- `dist`: dist folder deployed to [surge.sh](https://surge.sh/).
- `failOnError`: Set `failed` if a deployment throws error, defaults to `false`.
- `teardown`: Determines if the preview instance will be torn down on PR close, defaults to `false`.
- `suffix`: Suffix to be added to the preview URL, defaults to empty string. Can be use to avoid site preview enumeration.

### Outputs

- `preview_url`: The url for the related PR preview

### Who are using it?

- https://github.com/ant-design/ant-design-pro
- https://github.com/ant-design/pro-components
- https://github.com/antvis/antvis.github.io
- https://github.com/antvis/gatsby-theme-antv
- https://github.com/antvis/g2
- https://github.com/antvis/g2plot
- https://github.com/antvis/g6
- https://github.com/antvis/x6
- https://github.com/umijs/dumi
- https://github.com/alibaba/hooks
- https://github.com/youzan/vant
- https://github.com/didi/cube-ui
- https://github.com/didi/mand-mobile
- https://github.com/jdf2e/nutui
- https://github.com/ant-design-colorful/ant-design-colorful
- https://github.com/iambumblehead/react-dropdown-now

### Thanks to

- https://github.com/jwalton/gh-find-current-pr
- https://github.com/marocchino/sticky-pull-request-comment
