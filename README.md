This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supuestos y limitaciones conocidas

**El mock de backend no sobrevive a un recargue de página, y eso es a propósito.** El "backend" de este proyecto es MSW corriendo en memoria del navegador — un `Map`, sin base de datos real detrás. Lo único que persiste en `localStorage` es el puntero de navegación del cliente (`id`, `channel`, `step`); nunca datos sensibles de la solicitud (documento, ingresos, egresos, etc.). Es el mismo criterio de seguridad que aplico en todo el flujo: si algo puede identificar o comprometer al solicitante, no sale del backend.

La consecuencia directa: la regla de "un borrador activo por documento" y el mecanismo de retomar la solicitud ingresando la cédula (`POST /applications` devuelve el borrador existente en vez de crear uno duplicado, y el frontend te lleva de vuelta al paso exacto donde quedaste) están implementados y probados, y funcionan correctamente dentro de una misma sesión de navegador. Lo que no van a sobrevivir es a un F5 — porque en ese momento el mock se reinicializa desde cero y pierde todo lo que tenía en memoria.

No "arreglé" esto simulando persistencia en `localStorage`, porque eso implicaría sacar datos de la solicitud del backend hacia el navegador, que es justo lo que este diseño evita. En producción, con una base de datos real detrás, este mismo código funcionaría igual sin esta limitación — la persistencia dejaría de depender de que el mock siga vivo en memoria.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
