# Portfolio · Daniel Guerrero Navas

Sitio personal y profesional en **HTML, CSS y JavaScript vanilla** (sin framework de UI). Presenta proyectos, stack, experiencia y contacto, con soporte **ES / EN**, tema claro/oscuro y despliegue en **GitHub Pages** con dominio propio.

**Sitio en producción:** [danielnavas.dev](https://danielnavas.dev)

---

## Visión del proyecto

Portfolio orientado a reclutadores y clientes: narrativa de **Full Stack + Power Platform**, proyectos con contexto (necesidad → solución → impacto), prueba social (APM Terminals) y señales técnicas (fragmentos de backend comentados). Prioriza **accesibilidad básica**, rendimiento (sitio estático) y mantenimiento simple sin build obligatorio.

| Área | Contenido |
|------|-----------|
| Proyectos | Terminal Control (APM), demos académicas/personales con enlaces externos |
| Stack | Frontend, backend (acordeón de código), frameworks, datos, automatización |
| Experiencia | Trayectoria profesional y formación |
| Contacto | Formulario vía servicio externo; enlaces a redes y CV en PDF |

---

## Estructura del repositorio

```
├── index.html          # Página única (secciones ancladas)
├── CNAME               # Dominio personalizado (GitHub Pages)
├── css/styles.css      # Diseño responsive y variables de tema
├── js/
│   ├── main.js         # Navegación, tema, idioma, formulario, galería, contador
│   ├── i18n.js         # Traducciones ES / EN
│   └── code-snippets.js # Fragmentos embebidos (funciona sin servidor local)
├── assets/
│   ├── gallery/        # Capturas de proyectos
│   └── code/           # Fuentes de los ejemplos Backend
└── scripts/            # Utilidades Node para sincronizar snippets (opcional)
```

Documentación de recursos estáticos: [`assets/README.md`](assets/README.md).

---

## Desarrollo local

Se recomienda un servidor local (Formspree, contador de visitas y rutas relativas se comportan mejor que `file://`):

```bash
npx serve .
```

Abre la URL que indique la terminal (p. ej. `http://localhost:3000`).

Los ejemplos de la sección Backend también están en `js/code-snippets.js`, por lo que el código es visible incluso abriendo `index.html` directamente.

### Sincronizar snippets (opcional)

Tras editar un archivo en `assets/code/`:

```bash
node scripts/embed-snippet.mjs assets/code/02-express-api.js
```

---

## Despliegue (GitHub Pages)

1. Rama **`main`**, carpeta **`/` (root)** en *Settings → Pages*.
2. El archivo **`CNAME`** define el dominio personalizado; el DNS del dominio debe apuntar a GitHub según [documentación de Pages](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).
3. Incluir en el commit los PDFs y assets referenciados desde `index.html` (CV, carta APM, imágenes en `assets/`).

---

## Seguridad y privacidad

- **No subas** contraseñas, tokens privados, `.env`, credenciales de base de datos ni contenido de `config/` de otros proyectos. El repositorio incluye `.gitignore` con `.env` y artefactos locales.
- El **formulario de contacto** usa [Formspree](https://formspree.io): el identificador del formulario va en el front-end (`js/main.js`). Es público por diseño; si alguna vez se abusa del formulario, rota el formulario en el panel de Formspree y actualiza la URL en código.
- Los **fragmentos de código** del portfolio son educativos; no incluyen secretos reales. No publiques en el repo archivos de producción con datos sensibles.
- El **contador de visitas** usa el [escudo SVG de CountAPI](https://countapi.mileshilliard.com) (`/shield`, sin `fetch` JSON) para compatibilidad móvil. Clave pública en `js/main.js`; sesiones aproximadas.

Datos de contacto visibles en la web (email, redes) son intencionados para el portfolio; no los dupliques en el README.

---

## Licencia y uso

Proyecto personal. El diseño y los textos son de Daniel Guerrero Navas. Las capturas de proyectos corporativos o de terceros siguen las políticas de su contexto original; no reutilizar sin permiso.
