# Crédito Digital BCS — Microsito de solicitud de crédito de libre destino

Prueba técnica para el rol de Desarrollador Frontend Experto en Banco Caja Social. Es un wizard de solicitud de crédito de libre destino, con un módulo interno de asesor separado, construido en Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui + Zustand + TanStack Query + MSW.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS** + **shadcn/ui** (`components.json`, estilo `base-nova`)
- **Zustand** (store vanilla + Context) para el puntero de navegación del wizard
- **TanStack Query** para todo el estado de servidor
- **MSW** (Mock Service Worker) como backend simulado, corriendo en el navegador
- **React Hook Form + Zod** para formularios y validación
- **Vitest** para pruebas automatizadas

## Cómo correrlo

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

Otros comandos:

```bash
pnpm build    # build de producción
pnpm start    # corre el build
pnpm lint     # eslint
pnpm test     # vitest (modo watch)
pnpm test:run # vitest, una sola corrida
```

No hay backend real que levantar: todo el API lo sirve MSW interceptando `fetch` en el navegador.

## Supuestos y decisiones de arquitectura

**Dos módulos de rutas, un solo proyecto.** El documento de la prueba pedía el flujo del cliente; yo agregué además un portal interno de asesor (`/advisor-portal/*`) porque varias reglas de negocio (edición de `pending_validation`, aprobación/devolución) solo tienen sentido si existe un actor "asesor" real navegando algo, no solo un campo en la base de datos. Esa ruta no está enlazada desde ningún lugar del sitio público, y está protegida por `src/proxy.ts` (esta versión de Next.js renombró `middleware` a `proxy`) que revisa una cookie de sesión simulada.

**Zustand solo guarda el puntero de navegación, nunca datos sensibles.** El store persistido en `localStorage` tiene únicamente `id`, `channel`, `advisorId` y `step`. Documento, ingresos, egresos, valor solicitado — todo eso vive solo en el backend (mock) y se trae con TanStack Query, alimentando el formulario vía la prop `values` de React Hook Form (no `defaultValues`), para que retomar una solicitud siempre rehidrate desde el servidor y no desde lo que quedó guardado en el navegador.

**Un borrador activo por documento.** `POST /applications` no crea uno nuevo si ya existe un borrador para ese número de documento — devuelve el existente y el frontend te manda directo al paso donde ibas. Así, si el cliente cierra la pestaña y vuelve a entrar con su cédula, retoma en vez de duplicar.

**Edición condicionada por estado y por actor.** `draft` lo edita el cliente; `pending_validation` lo edita solo el asesor desde `/advisor-portal`; `finalized` y `abandoned` son terminales para ambos. Esto está reforzado en el backend simulado (los resolvers de MSW devuelven 409 si el actor o el estado no corresponden), no solo escondido en la UI.

**El mock de backend no sobrevive a un recargue de página, y eso es a propósito.** El "backend" es MSW corriendo en memoria del navegador — un `Map`, sin base de datos real detrás. La regla de "un borrador activo por documento" y el mecanismo de retomar con la cédula funcionan correctamente dentro de una misma sesión de navegador, pero no sobreviven a un F5 porque el mock se reinicializa desde cero. No lo "arreglé" simulando persistencia en `localStorage`, porque eso implicaría sacar datos de la solicitud del backend hacia el navegador — justo lo que este diseño evita. Con una base de datos real detrás, este mismo código funciona igual sin esta limitación.

**`simulate-offer` es determinista.** La regla de viabilidad es capacidad de pago (35% del ingreso libre cubre la cuota estimada), no `Math.random()`. Hay un monto reproducible (`999.999.999`) que dispara un error técnico simulado, para poder probar ese camino sin depender del azar.

**Toda mutación lleva `correlationId` y emite un `ApplicationEvent`** (`actor: client | advisor | system`), para trazabilidad — se puede reconstruir el historial completo de una solicitud desde sus eventos.

## Mocks / backend simulado

`src/mocks/` — MSW con handlers para `applications` (crear, listar, actualizar, simular oferta, aceptar oferta alternativa, finalizar, abandonar, eventos) y `advisor-auth` (login/refresh/logout simulados). La base de datos es `src/mocks/db.ts`, un `Map` en memoria con reglas de negocio propias (un borrador por documento, transiciones de estado válidas).

## Contratos de API (usados por el mock, mismo contrato esperado de un backend real)

| Método | Ruta | Actor | Descripción |
|---|---|---|---|
| `POST` | `/api/applications` | client | Crea solicitud o devuelve el borrador existente para ese documento (`200` si ya existía, `201` si es nueva) |
| `GET` | `/api/applications` | advisor | Lista completa (portal de asesor) |
| `GET` | `/api/applications/:id` | client/advisor | Detalle de una solicitud |
| `PATCH` | `/api/applications/:id` | client (draft) / advisor (pending_validation) | Actualiza datos; `409` si el estado/actor no corresponde |
| `POST` | `/api/applications/:id/simulate-offer` | client | Corre la regla de capacidad de pago, devuelve oferta viable/no viable/error técnico |
| `POST` | `/api/applications/:id/accept-alternative-offer` | client | Acepta la oferta alternativa cuando la simulación inicial no fue viable |
| `POST` | `/api/applications/:id/submit-for-review` | client | Pasa la solicitud a `pending_validation` (canal asistido) |
| `POST` | `/api/applications/:id/finalize` | client (unassisted) / advisor | Cierra la solicitud |
| `POST` | `/api/applications/:id/abandon` | client/advisor | Marca como `abandoned` con motivo |
| `GET` | `/api/applications/:id/events` | client/advisor | Historial de eventos de trazabilidad |
| `POST` | `/api/auth/advisor-login` | advisor | Login simulado del portal interno |

Todas las mutaciones esperan headers `X-Correlation-Id` y `X-Actor`, que el `apiClient` (`src/lib/http-client`) agrega automáticamente.

## Pruebas automatizadas

`pnpm test` corre Vitest sobre `src/mocks/db.test.ts`, `src/proxy.test.ts` y los servicios de `applications`/`advisor-auth` — cubren la máquina de estados (transiciones válidas/inválidas), la regla de un borrador por documento, y la protección del portal de asesor.

## Sobre el uso de IA en este proyecto

Usé Claude Code como asistente durante todo el desarrollo, con una metodología concreta: yo defino la arquitectura y las reglas de negocio (ver `docs/hoja-de-ruta.md` y `docs/project-context.md`, que escribí antes de tocar código), y el agente implementa contra ese contrato — nunca al revés. Cada cambio lo validé corriendo la app en vivo en el navegador (no solo confiando en que compilara), revisando `pnpm lint`/`tsc --noEmit`/`pnpm test`, y en varios casos reproduciendo bugs reportados paso a paso con DevTools antes de aceptar un diagnóstico. Un ejemplo concreto: un bug de "se queda cargando" en el paso de simulación se diagnosticó inspeccionando directamente el caché de TanStack Query y el fiber de React en vivo, no adivinando — y la primera hipótesis (un problema de timeout en el mock) se descartó y revirtió cuando la evidencia no la sostuvo.

---

## Historias técnicas

### 1. Frontend / rendering — Estados de carga consistentes en el wizard

**Como** solicitante de crédito, **quiero** que cada paso del wizard muestre un estado de carga claro mientras se resuelve una petición, y que ese estado siempre transicione a un resultado (éxito, error o el siguiente paso), **para** no quedarme con la duda de si mi solicitud avanzó o no.

**Criterios de aceptación:**
- Cada paso que depende de datos del servidor (`useFetchApplicationById`) muestra un skeleton mientras `isPending`, nunca contenido vacío o desalineado.
- El resultado de una mutación (crear, actualizar, simular oferta) se refleja en el mismo request-response cycle: no hay estados donde la petición ya resolvió pero la UI sigue esperando.
- Todo estado de carga tiene, como máximo, dos desenlaces posibles: el contenido resuelto, o un estado de error con acción de reintentar — nunca un tercer estado indefinido.
- Falla de red o del mock (4xx/5xx) siempre se traduce a un mensaje visible con opción de reintentar o volver al inicio, nunca a una pantalla que no cambia.

**Consideraciones de seguridad:** los estados de carga y error nunca filtran detalles internos (stack traces, payloads crudos del backend) al usuario — el `ApiError` se normaliza a un mensaje genérico en español antes de mostrarse.

### 2. Formularios / validaciones — Datos financieros del paso 2

**Como** solicitante, **quiero** que el formulario de ingresos, egresos y valor solicitado valide mis datos antes de dejarme avanzar, y que los montos se vean formateados como pesos mientras escribo, **para** no cometer errores de digitación que afecten mi simulación.

**Criterios de aceptación:**
- `income`, `expenses` y `amountRequested` se muestran formateados con separador de miles en tiempo real (`formatThousands`/`parseThousands`), sin symbol de moneda embebido en el valor (el `$` es solo visual).
- `amountRequested` exige un mínimo de $1.000.000; `income` exige ser mayor a cero; ninguno acepta valores negativos o no numéricos.
- El checkbox de tratamiento de datos personales (Ley 1581 de 2012) es obligatorio para continuar, y muestra un `FieldError` explícito si se intenta avanzar sin marcarlo — no solo un botón deshabilitado sin explicación.
- El campo "Destino del crédito" está fijo en "Libre destino" y deshabilitado, porque el producto no ofrece otra opción — evita que el usuario pierda tiempo en una decisión que no existe.
- Los valores se validan con Zod antes de tocar la red; ningún request sale con datos que ya sabemos inválidos en el cliente.

**Consideraciones de seguridad:** la validación de cliente es una ayuda de UX, no la barrera real — el mock revalida `income`/`expenses`/`amountRequested` en el resolver de `simulate-offer` antes de calcular la oferta, y un backend real debe hacer lo mismo (nunca confiar en que el frontend ya filtró los datos).

### 3. Integración frontend-backend — Retomar una solicitud por documento

**Como** solicitante que abandonó el proceso a mitad de camino, **quiero** que al volver a solicitar con mi mismo número de documento el sistema me lleve exactamente al paso donde quedé, **para** no tener que volver a llenar todo desde cero.

**Criterios de aceptación:**
- `POST /applications` con un documento que ya tiene un borrador activo devuelve `200` con la solicitud existente (no `201` ni un duplicado).
- El frontend usa `lastRoute` de la solicitud devuelta para redirigir al paso correcto, con un query param (`?resumed=1`) que permite mostrarle al usuario que está retomando, no empezando de nuevo.
- Los datos sensibles del borrador (ingresos, egresos, etc.) se recuperan siempre desde el servidor vía `useQuery` y se inyectan al formulario con la prop `values`, nunca desde lo que haya quedado en `localStorage`.
- Si el documento no tiene ningún borrador, el flujo crea uno nuevo (`201`) y sigue el camino normal.
- Toda la operación queda registrada como un `ApplicationEvent` con su `correlationId`, trazable después desde el portal de asesor.

**Consideraciones de seguridad:** el `id` de la solicitud en Zustand/`localStorage` es solo un puntero de navegación — nunca se usa como mecanismo de autorización por sí solo. Cualquier operación que dependa de quién puede hacer qué (editar, aprobar, finalizar) se valida en el backend según `status` + `actor` (header `X-Actor`), no según lo que el cliente diga que es. El número de documento no se expone en la URL en texto plano más allá de lo estrictamente necesario para el flujo de retomar solicitud.
