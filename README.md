# Nemčina – hovorená a business nemčina (SK ↔ DE)

Hlasová aplikácia na učenie nemčiny s AI tutorkou „Lenou“ (Google Gemini Live). Navrhnutá pre mobil a auto: **nič sa nepíše, všetko sa ovláda rozhovorom.**

## Ako funguje
- **Domov = Hovoriť s Lenou.** Vyberieš tému a ťukneš na Rozhovor, Kvíz, Gramatiku alebo Počúvanie. Ďalej už len hovoríš.
- **Hlasové ovládanie aplikácie.** Lena vie, kde v aplikácii si (`get_screen`), a sama prepína obrazovky („otvor financie“, „ukáž moje chyby“ → `navigate`). Na pokyn „vyskúšaj ma“ ťa skúša z kartičiek a hodnotí ich (`get_quiz_cards`, `grade_card`). Povie ti progres (`get_progress`) a ukladá chyby, frázy aj fakty o tebe (`log_mistake`, `save_phrase`, `remember`).
- **Mikrofón na každej obrazovke.** Lena začne rozhovor o tom, čo práve vidíš (téma, text, gramatika, scéna). Počas rozhovoru ukazuje stav lišta dole.
- **Po rozhovore** príde automatické vyhodnotenie, ktoré sa na domovskej obrazovke prečíta nahlas. Chyby a frázy sa uložia do opakovania.
- **Počúvanie fráz bez AI:** slovensky → nemecky → pauza na zopakovanie.
- Počas rozhovoru a počúvania obrazovka nezhasne (Wake Lock).

## Pamäť a progres
- **Kartičky (SM-2 spaced repetition)** pre každú frázu, slovíčko a chybu. Vracajú sa tesne predtým, ako by si ich zabudol.
- **Moje chyby** z rozhovorov aj cvičení, triedené podľa gramatických tém. Najslabšia téma sa ponúka ako prvá.
- **Dlhodobá pamäť Leny:** fakty o tebe (práca, plány, záujmy) a zhrnutia posledných rozhovorov. Pri každom rozhovore dostane aj tvoj progres a najčastejšie chyby, takže nadviaže na minulé rozhovory. Fakty vidíš a môžeš ich mazať v **Progres → Čo si Lena pamätá**.
- Všetko sa ukladá v prehliadači a po prihlásení aj v Supabase (synchronizácia mobil ↔ počítač).

## Obsah
23 tém, v každej 20 fráz, slovíčka, 2 texty a 3 scény na hranie rolí. AI vie dogenerovať ďalšie frázy, texty a cvičenia.
- **Business:** porady, telefonovanie, e-maily, prezentácie, vyjednávanie, financie a controlling, projekty, networking, kancelária
- **Priemysel a P&L:** výkaz ziskov a strát (GuV), výroba a závod, laky / práškové farby / nátery, nákup a suroviny, kvalita a laboratórium (24 slovíčok na tému)
- **Bežný život:** small talk, názory, reštaurácia, cestovanie, nákupy, zdravie, bývanie, voľný čas, pocity
- **Gramatika:** 14 tém pre hovorenú reč, výklad po slovensky, cvičenia na odkrytie

## Súbory
| Súbor | Účel |
|---|---|
| `index.html`, `styles.css`, `icons.js` | rozhranie, čiarové SVG ikony |
| `app.js` | stav, kartičky, obrazovky, kontext pre AI |
| `talk.js` | hlasový rozhovor (Gemini Live), nástroje Leny, pamäť, vyhodnotenie |
| `drive.js` | domovská hlasová obrazovka, kvíz, gramatika, počúvanie |
| `cloud.js` | prihlásenie a synchronizácia (Supabase, tabuľka `de_docs`) |
| `data-*.js` | obsah |
| `api/ai.js` | Vercel funkcia: Gemini (kľúč je len na serveri) |
| `server.js` | lokálny server na vývoj |

## Lokálne spustenie
```
copy .env.example .env.local     (doplň GEMINI_API_KEY)
npm run dev                      (http://localhost:3000; ak je obsadený: set PORT=3210)
```
Nasadenie a bezpečnosť kľúča: `DEPLOY.md`.
