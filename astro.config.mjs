// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://l42i.music.gatech.edu',
  // Old contest addresses, kept working after the move to /ga3d/<year>.
  redirects: {
    '/3d-contest': '/ga3d',
    '/3d-contest/3dcontest-2425': '/ga3d/24-25',
    '/3d-contest/3dcontest-2526': '/ga3d/25-26',
    '/3d-contest/24-25': '/ga3d/24-25',
    '/3d-contest/25-26': '/ga3d/25-26',
    '/3d-contest/26-27': '/ga3d/26-27',
  },
});
