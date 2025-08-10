# Flappy Bird Minigame

A retro-style Flappy Bird game implemented in HTML5 Canvas with JavaScript.

## Features

- Responsive design that works on different screen sizes
- Realistic bird graphics with smooth animations
- Score tracking with local storage for best scores
- Keyboard and mouse/touch controls
- Adjustable difficulty settings
- Dynamic cloud generation for a more immersive background

## How to Play

1. Click the "START GAME" button or press SPACE to begin
2. Press SPACE, click, or tap to make the bird flap and avoid pipes
3. Try to achieve the highest score possible

## Controls

- **SPACEBAR**: Flap wings
- **Mouse Click**: Flap wings
- **Touch Screen**: Tap to flap wings

## Hosting as a Minigame

This game is completely self-contained and can be hosted as a minigame on any web server. Simply upload the following files to your server:

- `index.html`
- `style.css`
- `script.js`

### Embedding in Another Page

To embed this game in another page, you can use an iframe:

```html
<iframe src="path/to/flappy-bird/index.html" width="1000" height="700" frameborder="0"></iframe>
```

## Deployment to Vercel

This project includes a `vercel.json` configuration file for easy deployment to Vercel.

1. Sign up for a Vercel account at [vercel.com](https://vercel.com/)
2. Install the Vercel CLI: `npm install -g vercel`
3. Navigate to the project directory in your terminal
4. Run `vercel` and follow the prompts to deploy

Alternatively, you can deploy directly from GitHub:
1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import your repository as a new project in Vercel
4. Vercel will automatically deploy your site and provide you with a URL

## CI/CD Pipeline Setup

To set up a CI/CD pipeline for this project, you can use GitHub Actions. Create a `.github/workflows/deploy.yml` file in your repository with the following content:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

You'll need to set up the following secrets in your GitHub repository settings:
- `VERCEL_TOKEN`: Your Vercel token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Customization

You can easily customize the game by modifying the following parameters in `script.js`:

- `bird.gravity`: Controls how fast the bird falls
- `bird.jumpPower`: Controls how high the bird jumps
- `pipeSpeed`: Controls how fast the pipes move
- `pipeGap`: Controls the gap between pipes
- `pipeWidth`: Controls the width of the pipes

## Security Considerations

- Best scores are stored in localStorage, which is validated to prevent manipulation
- All assets are local, with no external dependencies except for the Google Fonts CDN (with fallbacks)

## Browser Support

This game works in all modern browsers that support HTML5 Canvas and localStorage.

## License

This project is open source and available under the MIT License.
