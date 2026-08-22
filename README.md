<img width="1500" height="375" alt="Linksign Banner" src=".github/assets/banner.svg" />

<p align="center">The official <strong>documentation website</strong> for <strong>Linksign.</strong></p>
<p align="center">
  <a href="https://linksign.studentsphere.app"><img src="https://img.shields.io/badge/linksign.studentsphere.app-047187?style=flat-square" alt="Website" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="Language Badge" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.2.7-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js Badge" /></a>
</p>

This branch contains the source code for the **Linksign Documentation Site**, built using **[Next.js](https://nextjs.org/)** and **[Fumadocs](https://fumadocs.ourreach.org/)**. 

Linksign is a lightweight, zero-dependency TypeScript wrapper designed to interact programmatically with school portals of the **Compétences & Développement (C&D)** and **IGENSIA Education** groups.

## Local Development

Make sure you have [pnpm](https://pnpm.io/) installed.

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Export the Static Site
Builds the Next.js static site and exports it to the `./out` directory:
```bash
pnpm build
```

### 4. Serve the Build Output Locally
Runs a local server to test the exported files in the `./out` directory:
```bash
pnpm start
```

---

## License
The documentation site is open-source software licensed under the [GNU General Public License v3.0](/LICENSE).
