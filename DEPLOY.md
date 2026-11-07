# Návod: Gemini kľúč + Vercel + Supabase

## 1. Gemini API kľúč (5 min)
1. Otvor **https://aistudio.google.com/apikey** a prihlás sa Google účtom.
2. Klikni **Create API key**.
3. Vyber existujúci Google Cloud projekt alebo zvoľ **Create API key in new project**.
4. Kľúč (začína `AIza…`) skopíruj. **Nikam ho nevkladaj do kódu ani do chatu.**
5. Odporúčané – ochrana pred prekvapivým účtom:
   - Bez zapnutej platby (free tier) beží kľúč s dennými limitmi a nič neplatíš.
   - Ak zapneš platbu: console.cloud.google.com → **Billing → Budgets & alerts** → rozpočet napr. 10 € s upozornením na e-mail.
   - console.cloud.google.com → **APIs & Services → Credentials** → tvoj kľúč → **API restrictions → Restrict key → Generative Language API** → Save.

## 2. Lokálny test (voliteľné, 2 min)
1. V priečinku `C:\Projects\Nemcina` skopíruj `.env.example` na `.env.local`.
2. Do `.env.local` doplň riadok `GEMINI_API_KEY=AIza…`.
3. V termináli: `npm run dev` → otvor `http://localhost:3000` (ak je port obsadený: `set PORT=3210` a znova `npm run dev`).
4. Ťukni na mikrofón a povolenie mikrofónu → Lena by sa mala ozvať.
   `.env.local` je v `.gitignore` aj `.vercelignore` – nedostane sa na GitHub ani na Vercel.

## 3. Nasadenie na Vercel

### Možnosť A – cez Vercel CLI (bez GitHubu, najrýchlejšie)
```
cd C:\Projects\Nemcina
npx vercel login          (otvorí prehliadač, prihlás sa)
npx vercel                (prvé nasadenie – otázky nižšie)
```
Odpovede na otázky:
- *Set up and deploy?* → **Y**
- *Which scope?* → tvoj účet
- *Link to existing project?* → **N**
- *Project name?* → `nemcina` (alebo vlastný)
- *In which directory is your code located?* → `./`
- *Modify settings?* → **N** (Framework: Other, bez build príkazu)

Potom nastav premenné (každý príkaz sa spýta na hodnotu, vlož ju a Enter):
```
npx vercel env add GEMINI_API_KEY production
npx vercel env add ALLOWED_EMAILS production      (hodnota: rzitniak@gmail.com)
npx vercel --prod
```
Na konci vypíše adresu, napr. `https://nemcina.vercel.app`.

### Možnosť B – cez GitHub + web
1. Nahraj priečinok do nového (súkromného) GitHub repozitára.
2. vercel.com → **Add New → Project** → **Import** repozitár.
3. Framework Preset: **Other**, Root Directory: `./`, Build Command: prázdne.
4. Rozbaľ **Environment Variables** a pridaj:
   - `GEMINI_API_KEY` = tvoj kľúč
   - `ALLOWED_EMAILS` = `rzitniak@gmail.com`
5. **Deploy**. Každý ďalší push na GitHub nasadí novú verziu automaticky.

Zmena premenných neskôr: Vercel → projekt → **Settings → Environment Variables** → uprav → **Deployments → … → Redeploy**.

## 4. Supabase (jednorazovo, 3 min)
1. Otvor adresu z Vercelu → **Viac → Účet a cloud → Jednorazové nastavenie (SQL)** → **Kopírovať SQL**.
2. supabase.com → projekt, ktorý používa Project management → **SQL Editor → New query** → vlož → **Run**.
3. **Authentication → URL Configuration → Redirect URLs** → **Add URL** → adresa z Vercelu (napr. `https://nemcina.vercel.app`).
4. V aplikácii sa prihlás rovnakým e-mailom a heslom ako v Project management.
5. Odporúčané: **Authentication → Sign In / Providers** → vypni **Allow new users to sign up**.

## 5. Mobil
- iPhone (Safari): otvor adresu → **Zdieľať → Pridať na plochu**.
- Android (Chrome): **⋮ → Pridať na plochu / Inštalovať aplikáciu**.
- Pri prvom rozhovore povoľ mikrofón.

## Riešenie problémov
| Hláška | Príčina / riešenie |
|---|---|
| `GEMINI_API_KEY is not set on the server` | premenná chýba alebo nebol Redeploy |
| `Prihlás sa…` / 401 | nie si prihlásený (Viac → Účet a cloud) |
| `Tento účet nemá prístup k AI` / 403 | e-mail nie je v `ALLOWED_EMAILS` |
| `Gemini Live token: …` | kľúč je neplatný alebo projekt nemá prístup k Live API |
| `Tabuľka v cloude ešte neexistuje` | nespustil si SQL z kroku 4 |
| Lena nepočuje | povoľ mikrofón v prehliadači (iPhone: Nastavenia → Safari → Mikrofón) |

## Bezpečnosť
- Kľúč je iba vo Vercel premennej a do prehliadača sa nikdy nepošle.
- `/api/ai` overí Supabase prihlásenie a e-mail v `ALLOWED_EMAILS`.
- Hlasový rozhovor dostane od servera len krátkodobý jednorazový token, nie kľúč.
