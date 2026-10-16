# Portfolio — Daniel Guerrero Navas

Sitio estático HTML, CSS y JavaScript vanilla. Despliegue: sube la carpeta completa a tu hosting o GitHub Pages.

## Estructura

- `index.html` — contenido y secciones
- `css/styles.css` — diseño responsive (tema claro por defecto, oscuro opcional)
- `js/i18n.js` — textos ES / EN
- `js/main.js` — navegación, idioma, tema, formulario (Formspree), galería APM
- `assets/` — logo, PDFs, capturas (ver `assets/README.md`)

## Desarrollo local

```bash
npx serve .
# o
python -m http.server 8080
```

Abre `http://localhost:8080` (o el puerto que indique el servidor).

Los fragmentos de la sección Backend también están embebidos en `js/code-snippets.js`, así que puedes abrir `index.html` directamente y ver el código.

## Antes de publicar

1. Confirma en la raíz: `CNAME` (`danielnavas.dev`), `CV_Daniel_Guerrero_Navas_11.10.pdf`, `APM TERMINALS.pdf`; `logo.png` y capturas en `assets/`.
2. Comprueba enlaces a GitHub, LinkedIn y demos.
3. Sustituye `og:image` si añades una imagen social en `index.html`.
