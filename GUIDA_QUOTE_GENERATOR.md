# Guida: Creare una Quote Generator App con Next.js e Tailwind CSS

Questa guida ti spiega passo-passo come realizzare una semplice app generatore di citazioni (quote generator) con Next.js, Tailwind CSS e supporto tema chiaro/scuro.

---

## 1. Crea il progetto Next.js

```bash
npx create-next-app@latest quote-generator-app
cd quote-generator-app
```

---

## 2. Installa e configura Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Modifica `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Importa Tailwind in `src/app/globals.css`:

```css
@import "tailwindcss";
/* ...tuo CSS personalizzato... */
```

---

## 3. Supporto tema chiaro/scuro

Aggiungi variabili CSS in `globals.css` (già presente nel tuo progetto):

```css
:root {
  --foreground: #ffffff;
  --background: #000000;
  --card-bg: rgba(0, 0, 0, 0.5);
  --border: rgba(255, 255, 255, 0.1);
  --accent: #0070f3;
}

[data-theme='light'] {
  --foreground: #000000;
  --background: #ffffff;
  --card-bg: rgba(255, 255, 255, 0.5);
  --border: rgba(0, 0, 0, 0.1);
  --accent: #0070f3;
}
```

Crea un componente toggle tema, ad esempio `src/components/ThemeToggle.js`:

```jsx
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 border rounded"
    >
      Switch to {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}
```

---

## 4. Crea la logica del generatore di citazioni

Crea un array di citazioni in `src/data/quotes.js`:

```js
export const quotes = [
  "La miglior maniera di iniziare è smettere di parlare e cominciare a fare.",
  "Non lasciare che ieri occupi troppo di oggi.",
  "Non è importante se cadi, ma se ti rialzi.",
  // ...altre citazioni
];
```

Crea il componente generatore in `src/components/QuoteGenerator.js`:

```jsx
import { useState } from "react";
import { quotes } from "../data/quotes";

export default function QuoteGenerator() {
  const [quote, setQuote] = useState(quotes[0]);

  function getRandomQuote() {
    const random = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[random]);
  }

  return (
    <div className="card text-center">
      <p className="mb-4">{quote}</p>
      <button onClick={getRandomQuote} className="px-4 py-2 bg-blue-500 text-white rounded">
        Nuova citazione
      </button>
    </div>
  );
}
```

---

## 5. Assembla la pagina principale

Modifica `src/app/page.js` (o `pages/index.js`):

```jsx
import QuoteGenerator from "../components/QuoteGenerator";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <ThemeToggle />
      <h1 className="text-3xl font-bold mb-6">Quote Generator</h1>
      <QuoteGenerator />
    </main>
  );
}
```

---

## 6. Avvia e testa l'app

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

---

## 7. Pubblica l'app

Puoi pubblicare su Vercel:

```bash
npx vercel
```

---

## Riepilogo

- Setup Next.js e Tailwind CSS
- Supporto tema chiaro/scuro
- Componente generatore di citazioni
- Pagina principale
- Test e deploy

--- 