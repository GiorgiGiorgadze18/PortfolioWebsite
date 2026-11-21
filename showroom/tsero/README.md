# Tsero web demo

This self-contained static demo follows Android 0.2.3 and reuses its artwork, Inter fonts, restaurant menu data, and bundled Tbilisi map geometry. The browser implements the interactions using HTML, CSS, and JavaScript. Native system controls are represented by browser controls.

## Portfolio integration

Copy the whole `web/` directory from this repository into the portfolio site's static/public directory, for example as `public/demos/tsero/`. Keep the files and assets together. The entry point for an existing phone frame is `index.html`. Use `preview.html` for a standalone page with its own phone frame.

```html
<iframe
  src="/demos/tsero/index.html"
  title="Tsero interactive food delivery demo"
  loading="lazy"
  style="display:block;width:100%;height:100%;border:0;border-radius:inherit"
></iframe>
```

Give the parent screen area a definite height or aspect ratio. The reference viewport is 375 × 811 CSS pixels. The app scales to the iframe width and scrolls internally. Serve it over HTTP or HTTPS so the browser can load the map and JavaScript modules.

- Use `?start=home` when you want visitors to skip the welcome and demo sign-in screens.
- Use `?chrome=off` when your frame supplies its own status bar and home indicator.
- Combine them as `index.html?start=home&chrome=off`.

## Run locally

From the repository root, run `python3 -m http.server 8873 --directory web` and open `http://localhost:8873/preview.html`.

Visitors can use **Google demo sign-in** to explore the welcome flow without an account. The app runs entirely in the browser. Sign-in, payment, and courier status are simulated. Cart, order history, address, and the locally chosen profile photo are held for the current page session and cleared on reload. Inter and the OSM map include their license and source files under `assets/`.
