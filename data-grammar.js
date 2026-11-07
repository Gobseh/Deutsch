window.DE_DATA = window.DE_DATA || { categories: [], grammar: [] };
window.DE_DATA.grammar.push(

  /* 1 ─────────────────────────────────────────── */
  {
    id: 'word-order',
    icon: '🔀',
    title_sk: 'Slovosled: sloveso na 2. mieste a na konci',
    title_de: 'Satzstellung',
    level: 'A2–B1',
    why_sk: 'Slovosled je prvé, čo Nemec počuje. Slovák často dá podmet hneď za úvodné slovo („Morgen ich habe…") alebo nechá sloveso vo vedľajšej vete v strede.',
    explain: `
<p><b>Pravidlo č. 1 – hlavná veta:</b> časované sloveso je vždy na <b>2. mieste</b>. Na 1. mieste môže byť čokoľvek (podmet, čas, miesto, predmet). Ak na začiatku nie je podmet, ide <b>hneď za sloveso</b> (inverzia).</p>
<ul>
<li><b>Ich</b> habe morgen keine Zeit.</li>
<li><b>Morgen</b> habe ich keine Zeit.</li>
<li><b>Den Bericht</b> schicke ich Ihnen heute.</li>
</ul>
<p><b>Pravidlo č. 2 – dve slovesá (rámec):</b> časované sloveso na 2. mieste, druhé sloveso (infinitív, Partizip II, odlúčená predpona) <b>úplne na koniec</b>.</p>
<table>
<thead><tr><th>1.</th><th>2. (sloveso)</th><th>stred</th><th>koniec</th></tr></thead>
<tbody>
<tr><td>Ich</td><td>kann</td><td>heute leider nicht</td><td>kommen.</td></tr>
<tr><td>Gestern</td><td>habe</td><td>ich den Kunden</td><td>angerufen.</td></tr>
<tr><td>Wir</td><td>müssen</td><td>das Meeting</td><td>verschieben.</td></tr>
</tbody>
</table>
<p><b>Pravidlo č. 3 – vedľajšia veta</b> (weil, dass, ob, wenn, als, obwohl, nepriama otázka s wann/wo/wie…): časované sloveso ide <b>na koniec</b>. Pri dvoch slovesách je časované úplne posledné: <i>…, weil ich arbeiten <b>muss</b>.</i></p>
<p><b>Pravidlo č. 4:</b> ak začínate vedľajšou vetou, celá vedľajšia veta je „1. miesto" – hlavná veta potom začína <b>slovesom</b>: <i>Wenn ich Zeit habe, <b>komme</b> ich.</i></p>
<p><b>Tip:</b> v slovenčine je slovosled voľný, v nemčine nie. Pri rozprávaní si stráž hlavne sloveso na 2. mieste – to Nemci počujú najviac.</p>`,
    examples: [
      { de: 'Morgen <b>habe</b> ich keine Zeit.', sk: 'Zajtra nemám čas.' },
      { de: 'Ich <b>kann</b> heute leider nicht <b>kommen</b>.', sk: 'Dnes, žiaľ, nemôžem prísť.' },
      { de: 'Den Bericht <b>haben</b> wir gestern <b>geschickt</b>.', sk: 'Správu sme poslali včera.' },
      { de: 'Ich glaube, dass er recht <b>hat</b>.', sk: 'Myslím, že má pravdu.' },
      { de: 'Wissen Sie, ob wir das bis Freitag schaffen <b>können</b>?', sk: 'Viete, či to stihneme do piatku?' },
      { de: 'Wenn der Kunde zustimmt, <b>starten</b> wir im März.', sk: 'Ak zákazník súhlasí, začneme v marci.' }
    ],
    mistakes: [
      { wrong: 'Morgen ich habe keine Zeit.', right: 'Morgen habe ich keine Zeit.', why: 'Sloveso musí byť na 2. mieste – po „Morgen" ide hneď sloveso, až potom podmet.' },
      { wrong: 'Ich weiß, dass er hat recht.', right: 'Ich weiß, dass er recht hat.', why: 'Po „dass" ide časované sloveso na koniec vety.' },
      { wrong: 'Ich kann nicht kommen heute.', right: 'Ich kann heute nicht kommen.', why: 'Infinitív po modálnom slovese stojí úplne na konci, nič za ním.' }
    ],
    exercises: [
      { q: 'Heute ___ ich im Homeoffice. (arbeiten)', a: ['arbeite'], sk: 'Dnes pracujem z domu.', hint: 'sloveso na 2. mieste, tvar pre „ich"' },
      { q: 'Morgen ___ wir ein Meeting mit dem Kunden. (haben)', a: ['haben'], sk: 'Zajtra máme stretnutie so zákazníkom.', hint: 'po „Morgen" ide hneď sloveso' },
      { q: 'Ich kann heute leider nicht ___ . (kommen)', a: ['kommen'], sk: 'Dnes, žiaľ, nemôžem prísť.', hint: 'po modálnom slovese infinitív na konci' },
      { q: 'Ich habe die E-Mail schon ___ . (schicken)', a: ['geschickt'], sk: 'E-mail som už poslal.', hint: 'Partizip II ide na koniec' },
      { q: 'Ich glaube, dass der Bericht fertig ___ . (sein)', a: ['ist'], sk: 'Myslím, že správa je hotová.', hint: 'po „dass" sloveso na koniec' },
      { q: 'Er kommt später, weil er im Stau ___ . (stehen)', a: ['steht'], sk: 'Príde neskôr, lebo stojí v zápche.', hint: 'po „weil" sloveso na koniec' },
      { q: 'Können Sie mir sagen, wann das Meeting ___ ? (beginnen)', a: ['beginnt'], sk: 'Môžete mi povedať, kedy sa začína stretnutie?', hint: 'nepriama otázka = vedľajšia veta, sloveso na koniec' },
      { q: 'Wenn du Zeit ___ , ruf mich an. (haben)', a: ['hast'], sk: 'Keď budeš mať čas, zavolaj mi.', hint: 'po „wenn" sloveso na koniec, tvar pre „du"' },
      { q: 'Wenn der Kunde zustimmt, ___ wir im März. (starten)', a: ['starten'], sk: 'Ak zákazník súhlasí, začneme v marci.', hint: 'po vedľajšej vete začína hlavná veta slovesom' },
      { q: 'Ich bin sicher, dass er die Zahlen schon geprüft ___ . (haben)', a: ['hat'], sk: 'Som si istý, že čísla už skontroloval.', hint: 'vo vedľajšej vete je časované sloveso úplne posledné' }
    ]
  },

  /* 2 ─────────────────────────────────────────── */
  {
    id: 'articles-gender',
    icon: '🏷️',
    title_sk: 'Rod podstatných mien: der, die, das',
    title_de: 'Genus und Plural',
    level: 'A1–B1',
    why_sk: 'Zlý člen kazí aj pád a koncovku prídavného mena. Slovák často prenáša rod zo slovenčiny („der Problem" lebo „ten problém") – to väčšinou nefunguje.',
    explain: `
<p>Rod sa treba učiť <b>vždy spolu so slovom</b> (die Rechnung, nie len „Rechnung"). Pomôžu však koncovky – platia takmer vždy:</p>
<table>
<thead><tr><th>der</th><th>die</th><th>das</th></tr></thead>
<tbody>
<tr><td>-er (osoby, nástroje): der Mitarbeiter, der Drucker</td><td><b>-ung</b>: die Rechnung, die Besprechung</td><td><b>-chen, -lein</b>: das Mädchen</td></tr>
<tr><td>-ismus: der Tourismus</td><td><b>-heit, -keit</b>: die Freiheit, die Möglichkeit</td><td><b>-ment</b>: das Dokument</td></tr>
<tr><td>-ling: der Lehrling</td><td><b>-schaft</b>: die Gesellschaft</td><td><b>-um</b>: das Zentrum, das Datum</td></tr>
<tr><td>dni, mesiace, ročné obdobia: der Montag, der Mai</td><td><b>-ion, -tät, -ik, -ei</b>: die Situation, die Qualität, die Politik</td><td><b>-nis</b> (väčšinou): das Ergebnis</td></tr>
<tr><td></td><td>väčšina slov na <b>-e</b>: die Woche, die Firma (výnimka)</td><td>slovesá ako podst. mená: das Essen, das Meeting (-ing)</td></tr>
</tbody>
</table>
<p><b>Zložené slová:</b> rod určuje <b>posledné slovo</b>: die Kosten + <b>die Stelle</b> = <b>die</b> Kostenstelle; die Firma + <b>der Wagen</b> = <b>der</b> Firmenwagen.</p>
<p><b>Množné číslo:</b> člen je vždy <b>die</b>. Koncovky si treba učiť, ale typicky:</p>
<ul>
<li>ženský rod: <b>-(e)n</b> – die Rechnung → die Rechnungen</li>
<li>-er/-el/-en: často bez zmeny – der Mitarbeiter → die Mitarbeiter</li>
<li>cudzie slová: <b>-s</b> – das Meeting → die Meetings, das Büro → die Büros</li>
<li>krátke slová: <b>-e</b> / <b>-er</b>, často s prehláskou – der Plan → die Pläne, das Land → die Länder</li>
</ul>
<p><b>Pozor na „falošných priateľov":</b> das Problem, das Thema, das System, das Projekt, die Firma, der Termin.</p>`,
    examples: [
      { de: '<b>Die</b> Besprechung dauert eine Stunde.', sk: 'Porada trvá hodinu.' },
      { de: '<b>Das</b> Dokument finden Sie im Anhang.', sk: 'Dokument nájdete v prílohe.' },
      { de: '<b>Der</b> Vertrag muss noch unterschrieben werden.', sk: 'Zmluva sa ešte musí podpísať.' },
      { de: '<b>Das</b> Ergebnis ist besser als erwartet.', sk: 'Výsledok je lepší, ako sa čakalo.' },
      { de: 'Bitte buchen Sie das auf <b>die</b> Kostenstelle 4100.', sk: 'Prosím, zaúčtujte to na nákladové stredisko 4100.' },
      { de: 'Alle <b>Rechnungen</b> sind bezahlt.', sk: 'Všetky faktúry sú zaplatené.' }
    ],
    mistakes: [
      { wrong: 'Der Problem ist gelöst.', right: 'Das Problem ist gelöst.', why: 'V slovenčine „ten problém", v nemčine je to stredný rod: das Problem (aj das Thema, das System).' },
      { wrong: 'Das Firma hat 200 Mitarbeiter.', right: 'Die Firma hat 200 Mitarbeiter.', why: 'die Firma – ženský rod (ako slovenská „firma").' },
      { wrong: 'Der Kostenstelle ist falsch.', right: 'Die Kostenstelle ist falsch.', why: 'Pri zložených slovách rozhoduje posledné slovo: die Stelle → die Kostenstelle.' }
    ],
    exercises: [
      { q: '___ Rechnung ist noch offen. (der/die/das)', a: ['die'], sk: 'Faktúra je ešte otvorená (nezaplatená).', hint: 'koncovka -ung' },
      { q: '___ Dokument liegt auf dem Tisch. (der/die/das)', a: ['das'], sk: 'Dokument leží na stole.', hint: 'koncovka -ment' },
      { q: '___ Möglichkeit gefällt mir. (der/die/das)', a: ['die'], sk: 'Táto možnosť sa mi páči.', hint: 'koncovka -keit' },
      { q: '___ Ergebnis ist sehr gut. (der/die/das)', a: ['das'], sk: 'Výsledok je veľmi dobrý.', hint: 'koncovka -nis' },
      { q: '___ Meeting beginnt um zehn. (der/die/das)', a: ['das'], sk: 'Stretnutie začína o desiatej.', hint: 'anglické slová na -ing sú väčšinou das' },
      { q: '___ Gesellschaft hat ihren Sitz in Wien. (der/die/das)', a: ['die'], sk: 'Spoločnosť má sídlo vo Viedni.', hint: 'koncovka -schaft' },
      { q: '___ Optimismus im Team ist groß. (der/die/das)', a: ['der'], sk: 'Optimizmus v tíme je veľký.', hint: 'koncovka -ismus' },
      { q: '___ Firmenwagen steht in der Garage. (der/die/das)', a: ['der'], sk: 'Služobné auto stojí v garáži.', hint: 'zložené slovo: rozhoduje posledné slovo (Wagen)' },
      { q: 'Die ___ sind schon bezahlt. (die Rechnung – množné číslo)', a: ['rechnungen'], sk: 'Faktúry sú už zaplatené.', hint: 'ženský rod na -ung → -en' },
      { q: 'Wir haben zwei neue ___ im Team. (der Kollege – množné číslo)', a: ['kollegen'], sk: 'V tíme máme dvoch nových kolegov.', hint: 'slovo na -e → pridaj -n' }
    ]
  },

  /* 3 ─────────────────────────────────────────── */
  {
    id: 'cases-akk-dat',
    icon: '🎯',
    title_sk: 'Akuzatív vs. datív',
    title_de: 'Akkusativ und Dativ',
    level: 'A2–B1',
    why_sk: 'Pády sú v nemčine jednoduchšie ako v slovenčine – menia sa hlavne členy a zámená. Typická chyba: „Ich rufe dir an" (podľa „zavolám ti") alebo „mit den Chef".',
    explain: `
<p><b>Akkusativ</b> = koho? čo? (priamy predmet). <b>Dativ</b> = komu? (väčšinou osoba, ktorá niečo dostane). Otázky: <b>wer</b> (kto) – <b>wen</b> (koho) – <b>wem</b> (komu).</p>
<table>
<thead><tr><th></th><th>muž. r.</th><th>žen. r.</th><th>stred. r.</th><th>množ. č.</th></tr></thead>
<tbody>
<tr><td>Nominativ</td><td>der / ein</td><td>die / eine</td><td>das / ein</td><td>die / –</td></tr>
<tr><td>Akkusativ</td><td><b>den / einen</b></td><td>die / eine</td><td>das / ein</td><td>die / –</td></tr>
<tr><td>Dativ</td><td><b>dem / einem</b></td><td><b>der / einer</b></td><td><b>dem / einem</b></td><td><b>den</b> (+ -n)</td></tr>
</tbody>
</table>
<p><b>Rýchle pravidlo:</b> v akuzatíve sa mení <b>iba mužský rod</b> (der → den). V datíve sa mení všetko: <b>dem – der – dem – den</b>.</p>
<table>
<thead><tr><th>Nom.</th><th>ich</th><th>du</th><th>er</th><th>sie</th><th>es</th><th>wir</th><th>ihr</th><th>Sie</th></tr></thead>
<tbody>
<tr><td>Akk.</td><td>mich</td><td>dich</td><td>ihn</td><td>sie</td><td>es</td><td>uns</td><td>euch</td><td>Sie</td></tr>
<tr><td>Dat.</td><td>mir</td><td>dir</td><td>ihm</td><td>ihr</td><td>ihm</td><td>uns</td><td>euch</td><td>Ihnen</td></tr>
</tbody>
</table>
<p><b>Slovesá s datívom</b> (treba sa ich naučiť): helfen, danken, gefallen, gehören, gratulieren, antworten, passen, schmecken, fehlen, zuhören. Väčšinou sedia so slovenčinou (pomôcť <i>komu</i>).</p>
<p><b>Pozor – inak ako v slovenčine:</b> <b>anrufen + Akk</b> (Ich rufe <b>dich</b> an = zavolám <i>ti</i>), <b>fragen + Akk</b> (Ich frage <b>ihn</b>).</p>
<p><b>Dva predmety:</b> osoba v datíve, vec v akuzatíve: <i>Ich schicke <b>dem Kunden</b> <b>das Angebot</b>.</i></p>`,
    examples: [
      { de: 'Ich sehe <b>den</b> Chef heute Nachmittag.', sk: 'Šéfa uvidím dnes poobede.' },
      { de: 'Können Sie <b>mir</b> bitte helfen?', sk: 'Môžete mi, prosím, pomôcť?' },
      { de: 'Ich schicke <b>dem</b> Kunden <b>das</b> Angebot.', sk: 'Pošlem zákazníkovi ponuku.' },
      { de: 'Ich rufe <b>Sie</b> morgen an.', sk: 'Zajtra vám zavolám.' },
      { de: 'Das neue Büro gefällt <b>uns</b> sehr.', sk: 'Nová kancelária sa nám veľmi páči.' },
      { de: '<b>Wem</b> gehört dieser Laptop?', sk: 'Komu patrí tento notebook?' }
    ],
    mistakes: [
      { wrong: 'Ich rufe dir morgen an.', right: 'Ich rufe dich morgen an.', why: '„anrufen" má akuzatív, aj keď po slovensky povieme „zavolám ti".' },
      { wrong: 'Ich habe ein Termin mit der Chef.', right: 'Ich habe einen Termin mit dem Chef.', why: '„haben" + Akk → einen (muž. rod); „mit" + Dat → dem.' },
      { wrong: 'Ich danke dich für die Hilfe.', right: 'Ich danke dir für die Hilfe.', why: '„danken" je sloveso s datívom – ďakujem komu → dir.' }
    ],
    exercises: [
      { q: 'Ich sehe ___ Chef jeden Tag. (der)', a: ['den'], sk: 'Šéfa vidím každý deň.', hint: 'koho? – akuzatív, mužský rod' },
      { q: 'Kannst du ___ helfen? (ich)', a: ['mir'], sk: 'Môžeš mi pomôcť?', hint: 'helfen + Dativ' },
      { q: 'Wir brauchen ___ neuen Drucker. (ein)', a: ['einen'], sk: 'Potrebujeme novú tlačiareň.', hint: 'akuzatív, der Drucker' },
      { q: 'Ich danke ___ für Ihre Hilfe. (Sie)', a: ['ihnen'], sk: 'Ďakujem vám za vašu pomoc.', hint: 'danken + Dativ, zdvorilá forma' },
      { q: 'Das Büro gefällt ___ sehr. (wir)', a: ['uns'], sk: 'Kancelária sa nám veľmi páči.', hint: 'gefallen + Dativ' },
      { q: 'Ich rufe ___ morgen an. (du)', a: ['dich'], sk: 'Zajtra ti zavolám.', hint: 'anrufen + Akkusativ (nie ako v slovenčine)' },
      { q: 'Ich schicke ___ Kundin das Angebot. (die)', a: ['der'], sk: 'Pošlem zákazníčke ponuku.', hint: 'komu? – datív, ženský rod' },
      { q: 'Gehört der Laptop ___ ? (er)', a: ['ihm'], sk: 'Patrí ten notebook jemu?', hint: 'gehören + Dativ' },
      { q: 'Wir haben ___ Kollegen zum Geburtstag gratuliert. (die – množné číslo)', a: ['den'], sk: 'Kolegom sme zablahoželali k narodeninám.', hint: 'gratulieren + Dativ, množné číslo' },
      { q: '___ gehört dieser Schlüssel? (wer/wen/wem – komu)', a: ['wem'], sk: 'Komu patrí tento kľúč?', hint: 'otázka v datíve' }
    ]
  },

  /* 4 ─────────────────────────────────────────── */
  {
    id: 'prepositions',
    icon: '📍',
    title_sk: 'Predložky a pády',
    title_de: 'Präpositionen',
    level: 'A2–B1',
    why_sk: 'Predložky sú v reči všade (mit, bei, für, im Büro…). Slovák často použije zlý pád alebo zamení „wo?" a „wohin?" – napr. „Ich gehe in der Büro".',
    explain: `
<p><b>Vždy s datívom:</b> <b>aus, bei, mit, nach, seit, von, zu</b> (+ gegenüber). Pomôcka: „aus-bei-mit-nach-seit-von-zu".</p>
<p><b>Vždy s akuzatívom:</b> <b>durch, für, gegen, ohne, um</b>.</p>
<p><b>Wechselpräpositionen</b> (in, an, auf, über, unter, vor, hinter, neben, zwischen):</p>
<table>
<thead><tr><th>Otázka</th><th>Pád</th><th>Príklad</th></tr></thead>
<tbody>
<tr><td><b>Wo?</b> (kde – pokoj)</td><td>Dativ</td><td>Ich bin <b>im</b> Büro. Das Handy liegt <b>auf dem</b> Tisch.</td></tr>
<tr><td><b>Wohin?</b> (kam – pohyb)</td><td>Akkusativ</td><td>Ich gehe <b>ins</b> Büro. Ich lege das Handy <b>auf den</b> Tisch.</td></tr>
</tbody>
</table>
<p>Je to ako v slovenčine: „na stole" (kde) vs. „na stôl" (kam). Dvojice slovies: <b>liegen/legen, stehen/stellen, hängen/hängen, sitzen/setzen</b>.</p>
<p><b>Zlúčeniny</b> (v reči skoro vždy): in dem = <b>im</b>, in das = <b>ins</b>, an dem = <b>am</b>, zu dem = <b>zum</b>, zu der = <b>zur</b>, bei dem = <b>beim</b>, von dem = <b>vom</b>.</p>
<p><b>Čas:</b> <b>am</b> Montag, <b>im</b> März, <b>um</b> 10 Uhr, <b>seit</b> zwei Jahren (už dva roky), <b>vor</b> einer Woche (pred týždňom), <b>in</b> zwei Tagen (o dva dni).</p>
<p><b>Kam ísť:</b> <b>nach</b> + mestá/krajiny (nach Wien), <b>zu</b> + osoby/firmy (zum Arzt, zu Siemens), <b>in</b> + budovy (ins Büro), <b>nach Hause</b> (domov) vs. <b>zu Hause</b> (doma).</p>`,
    examples: [
      { de: 'Ich fahre <b>mit dem</b> Zug nach Wien.', sk: 'Idem vlakom do Viedne.' },
      { de: 'Ich arbeite <b>seit drei Jahren bei</b> einer Bank.', sk: 'Už tri roky pracujem v banke.' },
      { de: 'Das ist <b>für den</b> Kunden.', sk: 'To je pre zákazníka.' },
      { de: 'Wir treffen uns <b>im</b> Konferenzraum.', sk: 'Stretneme sa v zasadačke.' },
      { de: 'Stell den Ordner bitte <b>ins</b> Regal.', sk: 'Daj ten šanón, prosím, do regálu.' },
      { de: 'Nach dem Meeting gehe ich <b>zum</b> Arzt.', sk: 'Po porade idem k lekárovi.' }
    ],
    mistakes: [
      { wrong: 'Ich fahre mit den Bus.', right: 'Ich fahre mit dem Bus.', why: '„mit" je vždy s datívom: der Bus → mit dem Bus.' },
      { wrong: 'Ich gehe in der Büro.', right: 'Ich gehe ins Büro.', why: 'Pohyb (wohin?) = akuzatív: in das → ins. Navyše je to das Büro.' },
      { wrong: 'Das ist für dir.', right: 'Das ist für dich.', why: '„für" je vždy s akuzatívom: dich, nie dir.' }
    ],
    exercises: [
      { q: 'Ich fahre jeden Tag mit ___ Bus. (der)', a: ['dem'], sk: 'Každý deň chodím autobusom.', hint: 'mit + Dativ' },
      { q: 'Ich arbeite seit einem Jahr bei ___ Firma. (diese)', a: ['dieser'], sk: 'V tejto firme pracujem už rok.', hint: 'bei + Dativ, ženský rod' },
      { q: 'Das Geschenk ist für ___ Chef. (unser)', a: ['unseren', 'unsren'], sk: 'Ten darček je pre nášho šéfa.', hint: 'für + Akkusativ, mužský rod' },
      { q: 'Nach ___ Meeting gehen wir essen. (das)', a: ['dem'], sk: 'Po stretnutí ideme na obed.', hint: 'nach + Dativ' },
      { q: 'Wir treffen uns ___ Konferenzraum 2. (in + dem)', a: ['im'], sk: 'Stretneme sa v zasadačke 2.', hint: 'zlúčenina in + dem' },
      { q: 'Ich gehe jetzt ___ Kantine. (zu + der)', a: ['zur'], sk: 'Idem teraz do jedálne.', hint: 'zlúčenina zu + der' },
      { q: 'Ohne ___ Hilfe schaffen wir das nicht. (Ihre)', a: ['ihre'], sk: 'Bez vašej pomoci to nezvládneme.', hint: 'ohne + Akkusativ, die Hilfe' },
      { q: 'Der Bericht liegt auf ___ Schreibtisch. (dein – wo?)', a: ['deinem'], sk: 'Správa leží na tvojom stole.', hint: 'wo? → Dativ, der Schreibtisch' },
      { q: 'Leg den Bericht bitte auf ___ Schreibtisch. (mein – wohin?)', a: ['meinen'], sk: 'Polož tú správu, prosím, na môj stôl.', hint: 'wohin? → Akkusativ, der Schreibtisch' },
      { q: 'Der Drucker steht zwischen ___ Fenster und der Tür. (das – wo?)', a: ['dem'], sk: 'Tlačiareň stojí medzi oknom a dverami.', hint: 'wo? → Dativ, stredný rod' }
    ]
  },

  /* 5 ─────────────────────────────────────────── */
  {
    id: 'adjective-endings',
    icon: '🎨',
    title_sk: 'Koncovky prídavných mien',
    title_de: 'Adjektivdeklination',
    level: 'B1',
    why_sk: 'Koncovky prídavných mien robia chyby aj pokročilým. V reči stačí zvládnuť pár vzorcov – „einen neuen Kollegen", „ein gutes Ergebnis", „mit freundlichen Grüßen".',
    explain: `
<p><b>Hlavná myšlienka:</b> rod a pád musí niekde „byť vidieť". Ak to ukazuje člen, prídavné meno má len <b>-e/-en</b>. Ak člen neukazuje nič, koncovku „preberie" prídavné meno.</p>
<p><b>1. Po der / die / das (dieser, jeder):</b> len <b>-e</b> alebo <b>-en</b>.</p>
<table>
<thead><tr><th></th><th>muž. r.</th><th>žen. r.</th><th>stred. r.</th><th>množ. č.</th></tr></thead>
<tbody>
<tr><td>Nom.</td><td>der neu<b>e</b></td><td>die neu<b>e</b></td><td>das neu<b>e</b></td><td>die neu<b>en</b></td></tr>
<tr><td>Akk.</td><td>den neu<b>en</b></td><td>die neu<b>e</b></td><td>das neu<b>e</b></td><td>die neu<b>en</b></td></tr>
<tr><td>Dat.</td><td>dem neu<b>en</b></td><td>der neu<b>en</b></td><td>dem neu<b>en</b></td><td>den neu<b>en</b></td></tr>
</tbody>
</table>
<p><b>Pravidlo pre reč:</b> <b>-e</b> iba v 5 políčkach (nominatív jednotného čísla + akuzatív žen./stred. rodu), <b>všade inde -en</b>.</p>
<p><b>2. Po ein / kein / mein:</b> rovnako, ale tam, kde „ein" neukazuje rod, ho ukáže prídavné meno:</p>
<ul>
<li>ein neu<b>er</b> Kollege (der) – ein neu<b>es</b> Büro (das) – eine neu<b>e</b> Kollegin</li>
<li>Akk.: einen neu<b>en</b> Kollegen – ein neu<b>es</b> Büro – eine neu<b>e</b> Idee</li>
<li>Dat.: mit einem neu<b>en</b> Kunden, mit einer neu<b>en</b> Kollegin (vždy -en)</li>
</ul>
<p><b>3. Bez člena:</b> prídavné meno má koncovku člena: gut<b>er</b> Kaffee (der), frisch<b>es</b> Brot (das), schwarz<b>en</b> Kaffee (den), mit freundlich<b>en</b> Grüßen (den, množ.).</p>
<p><b>Tip:</b> nauč sa celé frázy naspamäť – Sehr geehrte Damen und Herren, mit freundlichen Grüßen, einen schönen Tag noch, vielen Dank.</p>`,
    examples: [
      { de: 'Das ist der neu<b>e</b> Kollege aus Bratislava.', sk: 'To je nový kolega z Bratislavy.' },
      { de: 'Wir haben einen neu<b>en</b> Kunden gewonnen.', sk: 'Získali sme nového zákazníka.' },
      { de: 'Das ist ein sehr gut<b>es</b> Ergebnis.', sk: 'To je veľmi dobrý výsledok.' },
      { de: 'Ich arbeite gern mit dem neu<b>en</b> Team.', sk: 'S novým tímom pracujem rád.' },
      { de: 'Ich wünsche Ihnen einen schön<b>en</b> Tag!', sk: 'Prajem vám pekný deň!' },
      { de: 'Mit freundlich<b>en</b> Grüßen', sk: 'S pozdravom (záver e-mailu)' }
    ],
    mistakes: [
      { wrong: 'Wir haben einen neuer Kunden.', right: 'Wir haben einen neuen Kunden.', why: 'Po „einen" (akuzatív) má prídavné meno vždy -en.' },
      { wrong: 'Das ist ein gute Ergebnis.', right: 'Das ist ein gutes Ergebnis.', why: '„ein" neukazuje stredný rod, preto ho ukáže prídavné meno: -es.' },
      { wrong: 'Mit freundliche Grüße', right: 'Mit freundlichen Grüßen', why: '„mit" + datív množného čísla: prídavné meno -en a podstatné meno -n.' }
    ],
    exercises: [
      { q: 'Das ist der ___ Kollege. (neu)', a: ['neue'], sk: 'To je nový kolega.', hint: 'po „der", nominatív → -e' },
      { q: 'Kennst du den ___ Mitarbeiter? (neu)', a: ['neuen'], sk: 'Poznáš toho nového zamestnanca?', hint: 'po „den" → -en' },
      { q: 'Das ist eine ___ Idee! (toll)', a: ['tolle'], sk: 'To je skvelý nápad!', hint: 'po „eine" → -e' },
      { q: 'Wir haben ein ___ Büro. (groß)', a: ['großes', 'grosses'], sk: 'Máme veľkú kanceláriu.', hint: '„ein" + das → prídavné meno ukáže rod' },
      { q: 'Er hat einen ___ Vorschlag gemacht. (gut)', a: ['guten'], sk: 'Dal dobrý návrh.', hint: 'po „einen" → -en' },
      { q: 'Die ___ Zahlen sehen gut aus. (aktuell)', a: ['aktuellen'], sk: 'Aktuálne čísla vyzerajú dobre.', hint: 'množné číslo po „die" → -en' },
      { q: 'Wir arbeiten mit einem ___ Partner zusammen. (zuverlässig)', a: ['zuverlässigen', 'zuverlaessigen'], sk: 'Spolupracujeme so spoľahlivým partnerom.', hint: 'datív po „einem" → -en' },
      { q: 'Das ist ein ___ Problem. (ernst)', a: ['ernstes'], sk: 'To je vážny problém.', hint: '„ein" + das Problem' },
      { q: 'Ich trinke morgens immer ___ Kaffee. (schwarz)', a: ['schwarzen'], sk: 'Ráno vždy pijem čiernu kávu.', hint: 'bez člena, akuzatív, der Kaffee → ako „den"' },
      { q: 'Mit ___ Grüßen, Peter Novák (freundlich)', a: ['freundlichen'], sk: 'S pozdravom, Peter Novák', hint: 'bez člena, datív množného čísla' }
    ]
  },

  /* 6 ─────────────────────────────────────────── */
  {
    id: 'perfekt',
    icon: '⏪',
    title_sk: 'Perfekt – minulý čas v hovorenej reči',
    title_de: 'Das Perfekt',
    level: 'A2–B1',
    why_sk: 'V reči sa o minulosti rozpráva takmer len v perfekte. Typické chyby: zlé pomocné sloveso („Ich habe gefahren") a zlý Partizip II („gegeht", „geanrufen").',
    explain: `
<p><b>Tvar:</b> haben/sein (na 2. mieste) + <b>Partizip II</b> (na konci): <i>Ich <b>habe</b> den Bericht <b>geschrieben</b>.</i></p>
<p><b>sein</b> sa používa pri:</p>
<ul>
<li>pohybe z miesta na miesto: gehen, kommen, fahren, fliegen, laufen</li>
<li>zmene stavu: aufstehen, einschlafen, werden, sterben, steigen (ceny)</li>
<li>a pri: <b>sein, bleiben, passieren</b></li>
</ul>
<p>Všetko ostatné (aj zvratné slovesá) = <b>haben</b>.</p>
<p><b>Partizip II:</b></p>
<table>
<thead><tr><th>Typ</th><th>Vzor</th><th>Príklad</th></tr></thead>
<tbody>
<tr><td>pravidelné</td><td>ge- … -t</td><td>machen → gemacht, arbeiten → gearbeitet</td></tr>
<tr><td>nepravidelné</td><td>ge- … -en</td><td>schreiben → geschrieben, nehmen → genommen</td></tr>
<tr><td>odlučiteľné</td><td>-ge- v strede</td><td>anrufen → an<b>ge</b>rufen, einkaufen → ein<b>ge</b>kauft</td></tr>
<tr><td>be-, ver-, er-, ent-…</td><td>bez ge-</td><td>bekommen → bekommen, verstehen → verstanden</td></tr>
<tr><td>-ieren</td><td>bez ge-, -t</td><td>diskutieren → diskutiert, passieren → passiert</td></tr>
</tbody>
</table>
<p><b>Najčastejšie nepravidelné:</b> gehen – <b>ist gegangen</b>, kommen – <b>ist gekommen</b>, fahren – <b>ist gefahren</b>, bleiben – <b>ist geblieben</b>, sein – <b>ist gewesen</b>, haben – gehabt, bringen – gebracht, denken – gedacht, wissen – gewusst, sehen – gesehen, sprechen – gesprochen, treffen – getroffen, finden – gefunden, geben – gegeben, essen – gegessen, beginnen – begonnen, verschieben – verschoben.</p>
<p><b>Tip:</b> pri <b>sein, haben</b> a <b>modálnych slovesách</b> sa aj v reči používa Präteritum: ich <b>war</b>, ich <b>hatte</b>, ich <b>konnte</b>, ich <b>musste</b>.</p>`,
    examples: [
      { de: 'Ich <b>habe</b> gestern bis acht <b>gearbeitet</b>.', sk: 'Včera som pracoval do ôsmej.' },
      { de: 'Wir <b>sind</b> nach Frankfurt <b>geflogen</b>.', sk: 'Leteli sme do Frankfurtu.' },
      { de: 'Hast du den Kunden schon <b>angerufen</b>?', sk: 'Už si zavolal zákazníkovi?' },
      { de: 'Wir haben das Thema lange <b>diskutiert</b>.', sk: 'Tú tému sme dlho diskutovali.' },
      { de: 'Was <b>ist passiert</b>?', sk: 'Čo sa stalo?' },
      { de: 'Ich <b>war</b> letzte Woche krank und <b>konnte</b> nicht kommen.', sk: 'Minulý týždeň som bol chorý a nemohol som prísť.' }
    ],
    mistakes: [
      { wrong: 'Ich habe nach Wien gefahren.', right: 'Ich bin nach Wien gefahren.', why: 'Pohyb z miesta na miesto → pomocné sloveso sein.' },
      { wrong: 'Ich habe ihn geanrufen.', right: 'Ich habe ihn angerufen.', why: 'Pri odlučiteľných slovesách je ge- medzi predponou a slovesom.' },
      { wrong: 'Was hat passiert?', right: 'Was ist passiert?', why: '„passieren" má sein; navyše -ieren slovesá nemajú ge-.' }
    ],
    exercises: [
      { q: 'Ich ___ gestern lange gearbeitet. (haben)', a: ['habe'], sk: 'Včera som dlho pracoval.', hint: 'pomocné sloveso na 2. mieste' },
      { q: 'Wir ___ nach München geflogen. (sein)', a: ['sind'], sk: 'Leteli sme do Mníchova.', hint: 'tvar pre „wir"' },
      { q: 'Hast du die E-Mail schon ___ ? (lesen)', a: ['gelesen'], sk: 'Už si čítal ten e-mail?', hint: 'nepravidelné: ge- … -en' },
      { q: 'Wir haben das Problem ___ . (diskutieren)', a: ['diskutiert'], sk: 'Ten problém sme prediskutovali.', hint: '-ieren → bez ge-' },
      { q: 'Ich habe den Kunden ___ . (anrufen)', a: ['angerufen'], sk: 'Zavolal som zákazníkovi.', hint: 'odlučiteľné: -ge- v strede' },
      { q: 'Das Meeting hat um 10 Uhr ___ . (beginnen)', a: ['begonnen'], sk: 'Porada sa začala o desiatej.', hint: 'be- → bez ge-, nepravidelné' },
      { q: 'Wann ___ du heute aufgestanden? (aufstehen – pomocné sloveso)', a: ['bist'], sk: 'Kedy si dnes vstal?', hint: 'zmena stavu → sein' },
      { q: 'Ich habe den Bericht noch nicht ___ . (schreiben)', a: ['geschrieben'], sk: 'Správu som ešte nenapísal.', hint: 'nepravidelné: ge- … -en' },
      { q: 'Wir haben den Termin auf Freitag ___ . (verschieben)', a: ['verschoben'], sk: 'Termín sme presunuli na piatok.', hint: 'ver- → bez ge-, nepravidelné' },
      { q: 'Die Preise ___ im letzten Quartal stark gestiegen. (steigen – pomocné sloveso)', a: ['sind'], sk: 'Ceny v poslednom štvrťroku výrazne stúpli.', hint: 'zmena stavu → sein, množné číslo' }
    ]
  },

  /* 7 ─────────────────────────────────────────── */
  {
    id: 'separable-verbs',
    icon: '✂️',
    title_sk: 'Odlučiteľné a neodlučiteľné slovesá',
    title_de: 'Trennbare und untrennbare Verben',
    level: 'A2–B1',
    why_sk: 'Slovesá ako anrufen, vorschlagen, stattfinden sú v pracovnej reči všade. Slováci často zabudnú predponu na konci vety alebo ju odtrhnú tam, kde sa netrhá (be-, ver-).',
    explain: `
<p><b>Odlučiteľné predpony</b> (prízvučné): <b>an, auf, aus, ein, mit, vor, zu, ab, nach, zurück, weg, statt, teil, fest</b>. V hlavnej vete idú <b>na koniec</b>:</p>
<ul>
<li>an|rufen: Ich <b>rufe</b> Sie morgen <b>an</b>.</li>
<li>vor|schlagen: Ich <b>schlage vor</b>, dass wir eine Pause machen.</li>
<li>statt|finden: Das Meeting <b>findet</b> online <b>statt</b>.</li>
</ul>
<p><b>Neodlučiteľné predpony</b> (neprízvučné): <b>be-, ver-, er-, ent-, emp-, ge-, miss-, zer-</b>. Nikdy sa neoddeľujú a v Partizipe II nemajú ge-:</p>
<ul>
<li>bekommen → Ich <b>bekomme</b>… / habe <b>bekommen</b></li>
<li>verschieben → Wir <b>verschieben</b> den Termin. / haben <b>verschoben</b></li>
</ul>
<table>
<thead><tr><th>Situácia</th><th>odlučiteľné (anrufen)</th><th>neodlučiteľné (verschieben)</th></tr></thead>
<tbody>
<tr><td>hlavná veta</td><td>Ich rufe ihn an.</td><td>Ich verschiebe den Termin.</td></tr>
<tr><td>s modálnym slovesom</td><td>Ich muss ihn anrufen.</td><td>Ich muss den Termin verschieben.</td></tr>
<tr><td>vedľajšia veta</td><td>…, dass ich ihn anrufe.</td><td>…, dass ich den Termin verschiebe.</td></tr>
<tr><td>Perfekt</td><td>Ich habe ihn an<b>ge</b>rufen.</td><td>Ich habe ihn verschoben.</td></tr>
<tr><td>zu + inf.</td><td>Ich versuche, ihn an<b>zu</b>rufen.</td><td>Ich versuche, ihn <b>zu</b> verschieben.</td></tr>
</tbody>
</table>
<p><b>Tip:</b> slovenské predpony (za-volať, pre-sunúť) sa nikdy neoddeľujú – v nemčine si musíš zvyknúť „počkať" na predponu na konci vety. Pri dlhých vetách si ju povedz v duchu vopred.</p>`,
    examples: [
      { de: 'Ich <b>rufe</b> Sie nach dem Meeting <b>an</b>.', sk: 'Zavolám vám po porade.' },
      { de: 'Ich <b>schlage vor</b>, dass wir morgen weitermachen.', sk: 'Navrhujem, aby sme pokračovali zajtra.' },
      { de: 'Die Schulung <b>findet</b> nächste Woche <b>statt</b>.', sk: 'Školenie sa uskutoční budúci týždeň.' },
      { de: 'Können wir den Termin <b>verschieben</b>?', sk: 'Môžeme presunúť termín?' },
      { de: 'Haben Sie meine E-Mail <b>bekommen</b>?', sk: 'Dostali ste môj e-mail?' },
      { de: 'Wann <b>kommt</b> der Zug in Wien <b>an</b>?', sk: 'Kedy prichádza vlak do Viedne?' }
    ],
    mistakes: [
      { wrong: 'Ich anrufe dich morgen.', right: 'Ich rufe dich morgen an.', why: 'V hlavnej vete ide predpona „an" na koniec.' },
      { wrong: 'Ich habe deine E-Mail gebekommen.', right: 'Ich habe deine E-Mail bekommen.', why: 'Slovesá s be-, ver-, er-… nemajú v Partizipe II ge-.' },
      { wrong: 'Wir schieben den Termin ver.', right: 'Wir verschieben den Termin.', why: '„ver-" je neodlučiteľná predpona – nikdy sa neoddeľuje.' }
    ],
    exercises: [
      { q: 'Ich ___ dich morgen an. (anrufen)', a: ['rufe'], sk: 'Zajtra ti zavolám.', hint: 'kmeň slovesa na 2. mieste, predpona na konci' },
      { q: 'Das Meeting ___ um 14 Uhr statt. (stattfinden)', a: ['findet'], sk: 'Porada sa uskutoční o 14. hodine.', hint: 'kmeň slovesa, tvar pre „es"' },
      { q: 'Ich ___ vor, dass wir eine Pause machen. (vorschlagen)', a: ['schlage'], sk: 'Navrhujem, aby sme si dali prestávku.', hint: 'kmeň slovesa, tvar pre „ich"' },
      { q: 'Wann kommst du aus dem Urlaub ___ ? (zurückkommen)', a: ['zurück'], sk: 'Kedy sa vrátiš z dovolenky?', hint: 'predpona na koniec vety' },
      { q: 'Ich habe deine Nachricht ___ . (bekommen)', a: ['bekommen'], sk: 'Dostal som tvoju správu.', hint: 'be- → bez ge-' },
      { q: 'Wir müssen den Termin leider ___ . (verschieben)', a: ['verschieben'], sk: 'Termín musíme, žiaľ, presunúť.', hint: 'po modálnom slovese celý infinitív' },
      { q: 'Ich weiß nicht, wann der Zug ___ . (ankommen)', a: ['ankommt'], sk: 'Neviem, kedy príde vlak.', hint: 'vo vedľajšej vete sa sloveso spojí' },
      { q: 'Hast du den Kollegen schon ___ ? (anrufen)', a: ['angerufen'], sk: 'Už si zavolal kolegovi?', hint: 'Partizip II: -ge- v strede' },
      { q: 'Die Chefin hat das neue Projekt ___ . (vorstellen)', a: ['vorgestellt'], sk: 'Šéfka predstavila nový projekt.', hint: 'Partizip II: vor + ge + stellt' },
      { q: 'Es ist wichtig, pünktlich ___ . (anfangen, zu + infinitív)', a: ['anzufangen'], sk: 'Je dôležité začať načas.', hint: '„zu" ide medzi predponu a sloveso' }
    ]
  },

  /* 8 ─────────────────────────────────────────── */
  {
    id: 'modal-verbs',
    icon: '🔑',
    title_sk: 'Modálne slovesá',
    title_de: 'Modalverben',
    level: 'A2–B1',
    why_sk: 'Modálne slovesá používaš v každej druhej vete. Najnebezpečnejšia chyba: „Du darfst nicht kommen" namiesto „nemusíš prísť" – znamená to „nesmieš prísť".',
    explain: `
<table>
<thead><tr><th></th><th>können</th><th>müssen</th><th>dürfen</th><th>sollen</th><th>wollen</th><th>möchten</th></tr></thead>
<tbody>
<tr><td>ich</td><td>kann</td><td>muss</td><td>darf</td><td>soll</td><td>will</td><td>möchte</td></tr>
<tr><td>du</td><td>kannst</td><td>musst</td><td>darfst</td><td>sollst</td><td>willst</td><td>möchtest</td></tr>
<tr><td>er/sie</td><td>kann</td><td>muss</td><td>darf</td><td>soll</td><td>will</td><td>möchte</td></tr>
<tr><td>wir/Sie</td><td>können</td><td>müssen</td><td>dürfen</td><td>sollen</td><td>wollen</td><td>möchten</td></tr>
</tbody>
</table>
<p>Pozor: <b>ich</b> a <b>er</b> majú rovnaký tvar bez -t (ich kann, er kann).</p>
<ul>
<li><b>können</b> – vedieť, môcť (schopnosť, možnosť): Ich kann Deutsch.</li>
<li><b>müssen</b> – musieť: Ich muss das heute fertig machen.</li>
<li><b>dürfen</b> – smieť, mať povolené: Darf ich kurz stören?</li>
<li><b>sollen</b> – mať (niekto iný to chce): Der Chef sagt, ich soll… / <b>Soll ich…?</b> = Mám…?</li>
<li><b>wollen</b> – chcieť (dosť priame): Wir wollen expandieren.</li>
<li><b>möchten</b> – chcel by som (zdvorilé): Ich möchte einen Termin.</li>
</ul>
<p><b>Najdôležitejší rozdiel:</b></p>
<table>
<thead><tr><th>Slovensky</th><th>Nemecky</th></tr></thead>
<tbody>
<tr><td>nemusíš (nie je to nutné)</td><td>du <b>musst nicht</b> / du <b>brauchst nicht zu</b>…</td></tr>
<tr><td>nesmieš (je to zakázané)</td><td>du <b>darfst nicht</b></td></tr>
</tbody>
</table>
<p><b>Minulosť:</b> v reči použi Präteritum: ich <b>konnte</b>, <b>musste</b>, <b>durfte</b>, <b>sollte</b>, <b>wollte</b> (bez prehlásky!).</p>`,
    examples: [
      { de: '<b>Kann</b> ich Ihnen helfen?', sk: 'Môžem vám pomôcť?' },
      { de: 'Ich <b>muss</b> heute früher gehen.', sk: 'Dnes musím odísť skôr.' },
      { de: '<b>Darf</b> ich kurz stören?', sk: 'Môžem na chvíľu vyrušiť?' },
      { de: '<b>Soll</b> ich das Protokoll schreiben?', sk: 'Mám napísať zápisnicu?' },
      { de: 'Sie <b>müssen nicht</b> sofort antworten.', sk: 'Nemusíte odpovedať hneď.' },
      { de: 'Diese Daten <b>dürfen</b> wir <b>nicht</b> weitergeben.', sk: 'Tieto údaje nesmieme poskytnúť ďalej.' }
    ],
    mistakes: [
      { wrong: 'Du darfst nicht kommen, das Meeting fällt aus.', right: 'Du musst nicht kommen, das Meeting fällt aus.', why: '„nicht dürfen" = nesmieť. „Nemusíš" je „du musst nicht".' },
      { wrong: 'Er kannt gut Englisch.', right: 'Er kann gut Englisch.', why: 'Modálne slovesá nemajú v 3. osobe -t: er kann, er muss, er will.' },
      { wrong: 'Ich will einen Kaffee.', right: 'Ich möchte einen Kaffee. / Ich hätte gern einen Kaffee.', why: '„wollen" znie v reštaurácii či obchode príliš priamo – zdvorilo je „möchte" alebo „hätte gern".' }
    ],
    exercises: [
      { q: '___ ich Ihnen helfen? (können)', a: ['kann'], sk: 'Môžem vám pomôcť?', hint: 'tvar pre „ich"' },
      { q: 'Ich ___ heute bis 18 Uhr arbeiten. (müssen)', a: ['muss'], sk: 'Dnes musím pracovať do 18:00.', hint: 'tvar pre „ich", bez prehlásky' },
      { q: 'Hier ___ man nicht rauchen. (dürfen)', a: ['darf'], sk: 'Tu sa nesmie fajčiť.', hint: 'tvar pre „man" = ako „er"' },
      { q: '___ du morgen mitkommen? (wollen)', a: ['willst'], sk: 'Chceš ísť zajtra so mnou?', hint: 'tvar pre „du"' },
      { q: 'Ich ___ einen Termin vereinbaren. (möchten)', a: ['möchte', 'moechte'], sk: 'Chcel by som si dohodnúť termín.', hint: 'tvar pre „ich"' },
      { q: 'Der Chef sagt, ich ___ den Bericht bis Freitag schicken. (sollen)', a: ['soll'], sk: 'Šéf hovorí, že mám poslať správu do piatku.', hint: 'niekto iný to chce' },
      { q: '___ ich das Fenster aufmachen? (sollen – Mám…?)', a: ['soll'], sk: 'Mám otvoriť okno?', hint: 'ponuka: Mám…? = Soll ich…?' },
      { q: 'Du ___ nicht kommen, das Meeting ist abgesagt. (nemusíš)', a: ['musst'], sk: 'Nemusíš prísť, porada je zrušená.', hint: 'nemusieť = nicht müssen' },
      { q: 'Das ist vertraulich, du ___ es niemandem sagen. (nesmieš)', a: ['darfst'], sk: 'To je dôverné, nesmieš to nikomu povedať.', hint: 'nesmieť = nicht dürfen' },
      { q: 'Ich ___ gestern leider nicht kommen. (können – Präteritum)', a: ['konnte'], sk: 'Včera som, žiaľ, nemohol prísť.', hint: 'minulý čas modálneho slovesa bez prehlásky' }
    ]
  },

  /* 9 ─────────────────────────────────────────── */
  {
    id: 'konjunktiv-ii',
    icon: '🎩',
    title_sk: 'Konjunktiv II: zdvorilosť a „keby"',
    title_de: 'Konjunktiv II',
    level: 'B1–B2',
    why_sk: 'V businesse je Konjunktiv II kľúčom k zdvorilosti – „Könnten Sie…?" znie oveľa lepšie ako „Können Sie…?". Slováci často povedia „Wenn ich habe Zeit, würde ich…".',
    explain: `
<p>Konjunktiv II je slovenské <b>„by"</b>. Na rozprávanie stačí pár tvarov:</p>
<table>
<thead><tr><th></th><th>sein</th><th>haben</th><th>können</th><th>werden</th><th>sollen</th></tr></thead>
<tbody>
<tr><td>ich / er</td><td>wäre</td><td>hätte</td><td>könnte</td><td>würde</td><td>sollte</td></tr>
<tr><td>du</td><td>wärst</td><td>hättest</td><td>könntest</td><td>würdest</td><td>solltest</td></tr>
<tr><td>wir / Sie</td><td>wären</td><td>hätten</td><td>könnten</td><td>würden</td><td>sollten</td></tr>
</tbody>
</table>
<p>Pri ostatných slovesách: <b>würde + infinitív</b> (Ich würde das anders machen).</p>
<p><b>1. Zdvorilosť (business):</b></p>
<ul>
<li><b>Könnten</b> Sie mir bitte… schicken? / <b>Würden</b> Sie…?</li>
<li>Ich <b>hätte</b> gern einen Termin. / <b>Hätten</b> Sie kurz Zeit?</li>
<li>Es <b>wäre</b> gut, wenn… / Ich <b>würde</b> vorschlagen, dass…</li>
<li>Rada: Sie <b>sollten</b>… / An Ihrer Stelle <b>würde</b> ich…</li>
</ul>
<p><b>2. Hypotézy (keby):</b> <i>Wenn ich mehr Zeit <b>hätte</b>, <b>würde</b> ich einen Kurs <b>machen</b>.</i> Vo vete s „wenn" použi radšej hätte/wäre/könnte, nie „würde haben".</p>
<p><b>3. Minulosť (keby som bol…):</b> hätte/wäre + Partizip II: <i>Wenn ich das <b>gewusst hätte</b>, <b>wäre</b> ich früher <b>gekommen</b>.</i> (haben/sein ako v perfekte).</p>`,
    examples: [
      { de: '<b>Könnten</b> Sie mir die Unterlagen bis morgen schicken?', sk: 'Mohli by ste mi poslať podklady do zajtra?' },
      { de: 'Ich <b>hätte</b> gern ein Glas Wasser.', sk: 'Prosil by som si pohár vody.' },
      { de: '<b>Hätten</b> Sie morgen um zehn Zeit?', sk: 'Mali by ste zajtra o desiatej čas?' },
      { de: 'Es <b>wäre</b> super, wenn wir das heute abschließen könnten.', sk: 'Bolo by super, keby sme to dnes mohli uzavrieť.' },
      { de: 'Wenn ich mehr Budget <b>hätte</b>, <b>würde</b> ich zwei Leute einstellen.', sk: 'Keby som mal väčší rozpočet, prijal by som dvoch ľudí.' },
      { de: 'Wenn ich das <b>gewusst hätte</b>, <b>hätte</b> ich Sie angerufen.', sk: 'Keby som to bol vedel, bol by som vám zavolal.' }
    ],
    mistakes: [
      { wrong: 'Wenn ich Zeit habe, würde ich kommen.', right: 'Wenn ich Zeit hätte, würde ich kommen.', why: 'Pri nereálnej podmienke je Konjunktiv II v oboch častiach: hätte … würde.' },
      { wrong: 'Wenn ich würde mehr Geld haben, …', right: 'Wenn ich mehr Geld hätte, …', why: 'Pri haben/sein použi jednoslovný tvar (hätte, wäre); navyše sloveso ide po „wenn" na koniec.' },
      { wrong: 'Ich würde sein froh, wenn…', right: 'Ich wäre froh, wenn…', why: 'Namiesto „würde sein" sa hovorí „wäre", namiesto „würde haben" „hätte".' }
    ],
    exercises: [
      { q: '___ Sie mir bitte helfen? (können – zdvorilo)', a: ['könnten', 'koennten'], sk: 'Mohli by ste mi, prosím, pomôcť?', hint: 'Konjunktiv II od können, tvar pre „Sie"' },
      { q: 'Ich ___ gern einen Kaffee. (haben – zdvorilo)', a: ['hätte', 'haette'], sk: 'Prosil by som si kávu.', hint: 'Ich … gern = prosil by som si' },
      { q: 'Das ___ super! (sein – bolo by)', a: ['wäre', 'waere'], sk: 'To by bolo super!', hint: 'Konjunktiv II od sein' },
      { q: '___ Sie mir die Präsentation schicken? (werden – zdvorilá otázka)', a: ['würden', 'wuerden'], sk: 'Poslali by ste mi tú prezentáciu?', hint: 'würde-tvar pre „Sie"' },
      { q: 'Wenn ich mehr Zeit ___ , würde ich einen Kurs machen. (haben)', a: ['hätte', 'haette'], sk: 'Keby som mal viac času, urobil by som si kurz.', hint: 'nereálna podmienka, tvar pre „ich"' },
      { q: 'An deiner Stelle ___ ich mit dem Chef sprechen. (werden)', a: ['würde', 'wuerde'], sk: 'Na tvojom mieste by som sa porozprával so šéfom.', hint: 'rada: würde + infinitív' },
      { q: 'Du ___ mehr Pausen machen. (sollen – mal by si)', a: ['solltest'], sk: 'Mal by si si robiť viac prestávok.', hint: 'Konjunktiv II od sollen, tvar pre „du"' },
      { q: 'Es ___ schön, wenn wir das bis Freitag schaffen. (sein)', a: ['wäre', 'waere'], sk: 'Bolo by pekné, keby sme to stihli do piatku.', hint: 'Es … gut/schön, wenn…' },
      { q: 'Wenn der Zug pünktlich gewesen wäre, ___ ich das Meeting nicht verpasst. (haben)', a: ['hätte', 'haette'], sk: 'Keby bol vlak prišiel načas, nebol by som zmeškal poradu.', hint: 'minulosť: hätte + Partizip II (verpassen má haben)' },
      { q: 'Wenn ich das gewusst hätte, ___ ich früher gekommen. (sein)', a: ['wäre', 'waere'], sk: 'Keby som to bol vedel, bol by som prišiel skôr.', hint: 'kommen má v perfekte sein' }
    ]
  },

  /* 10 ─────────────────────────────────────────── */
  {
    id: 'reflexive',
    icon: '🔁',
    title_sk: 'Zvratné slovesá a slovesá s predložkou',
    title_de: 'Reflexive Verben und Verben mit Präposition',
    level: 'B1–B2',
    why_sk: 'Frázy ako „Ich freue mich auf…", „Ich kümmere mich darum" sú v e-mailoch a na poradách stále. Slováci často zabudnú „sich" alebo použijú zlú predložku („warten für").',
    explain: `
<p><b>Zvratné zámeno:</b> ich <b>mich</b>, du <b>dich</b>, er/sie/es <b>sich</b>, wir <b>uns</b>, ihr <b>euch</b>, sie/Sie <b>sich</b>. Ak je vo vete ďalší predmet, je v datíve: Ich kann <b>mir</b> das vorstellen.</p>
<p><b>Pozor:</b> slovenské „sa" ≠ vždy „sich": učiť sa = <b>lernen</b>, pýtať sa = <b>fragen</b>, stať sa = <b>passieren</b>. Naopak: sich beeilen (ponáhľať sa), sich bedanken (poďakovať).</p>
<p><b>Slovesá s pevnou predložkou</b> – učiť sa celé:</p>
<table>
<thead><tr><th>Nemecky</th><th>Slovensky</th></tr></thead>
<tbody>
<tr><td>sich freuen <b>auf</b> + Akk</td><td>tešiť sa na (budúce)</td></tr>
<tr><td>sich freuen <b>über</b> + Akk</td><td>tešiť sa z (už sa stalo)</td></tr>
<tr><td>sich kümmern <b>um</b></td><td>postarať sa o</td></tr>
<tr><td>sich melden <b>bei</b></td><td>ozvať sa (komu)</td></tr>
<tr><td>sich beschweren <b>über</b> / <b>bei</b></td><td>sťažovať sa na / u</td></tr>
<tr><td>sich interessieren <b>für</b></td><td>zaujímať sa o</td></tr>
<tr><td>warten <b>auf</b></td><td>čakať na</td></tr>
<tr><td>teilnehmen <b>an</b> + Dat</td><td>zúčastniť sa na</td></tr>
<tr><td>denken <b>an</b> / sich erinnern <b>an</b></td><td>myslieť na / spomenúť si na</td></tr>
<tr><td>sprechen <b>über</b> / <b>mit</b></td><td>hovoriť o / s</td></tr>
</tbody>
</table>
<p><b>da- / wo-:</b> pri <b>veciach</b> nahradíš predložku + zámeno: auf das → <b>darauf</b>, über was → <b>worüber</b>. Pred samohláskou pridaj -r-: dar-an, wor-auf. Pri <b>osobách</b> zostáva predložka + zámeno: Auf <b>wen</b> wartest du? – Auf <b>ihn</b>.</p>`,
    examples: [
      { de: 'Ich <b>freue mich auf</b> unsere Zusammenarbeit.', sk: 'Teším sa na našu spoluprácu.' },
      { de: 'Wir <b>freuen uns über</b> Ihr Interesse.', sk: 'Tešíme sa z vášho záujmu.' },
      { de: 'Keine Sorge, ich <b>kümmere mich darum</b>.', sk: 'Bez obáv, postarám sa o to.' },
      { de: 'Bitte <b>melden Sie sich bei</b> mir, wenn Sie Fragen haben.', sk: 'Prosím, ozvite sa mi, ak budete mať otázky.' },
      { de: '<b>Worauf</b> warten wir noch? – <b>Auf</b> die Freigabe vom Controlling.', sk: 'Na čo ešte čakáme? – Na schválenie od controllingu.' },
      { de: 'Ich habe am Workshop <b>teilgenommen</b>.', sk: 'Zúčastnil som sa na workshope.' }
    ],
    mistakes: [
      { wrong: 'Ich freue auf das Wochenende.', right: 'Ich freue mich auf das Wochenende.', why: '„sich freuen" je zvratné – „mich" nesmie chýbať (ako „teším sa").' },
      { wrong: 'Ich warte für den Bus.', right: 'Ich warte auf den Bus.', why: 'warten + auf (nie „für" – kalk z angličtiny „wait for").' },
      { wrong: 'Ich lerne mich Deutsch.', right: 'Ich lerne Deutsch.', why: '„učiť sa" je v nemčine bez „sich".' }
    ],
    exercises: [
      { q: 'Ich freue ___ auf das Wochenende. (zvratné zámeno)', a: ['mich'], sk: 'Teším sa na víkend.', hint: 'zvratné zámeno pre „ich"' },
      { q: 'Kannst du ___ bitte um den Kunden kümmern? (zvratné zámeno)', a: ['dich'], sk: 'Môžeš sa, prosím, postarať o zákazníka?', hint: 'zvratné zámeno pre „du"' },
      { q: 'Wir freuen uns ___ Ihre Antwort. (tešiť sa na – budúce)', a: ['auf'], sk: 'Tešíme sa na vašu odpoveď.', hint: 'budúca udalosť' },
      { q: 'Ich warte schon seit einer Stunde ___ den Techniker. (čakať na)', a: ['auf'], sk: 'Už hodinu čakám na technika.', hint: 'warten + ?' },
      { q: 'Interessieren Sie sich ___ die Stelle? (zaujímať sa o)', a: ['für', 'fuer'], sk: 'Zaujímate sa o to miesto?', hint: 'sich interessieren + ?' },
      { q: 'Nehmen Sie morgen ___ der Besprechung teil? (zúčastniť sa na)', a: ['an'], sk: 'Zúčastníte sa zajtra na porade?', hint: 'teilnehmen + ? + Dativ' },
      { q: 'Der Kunde hat sich ___ die Verspätung beschwert. (sťažovať sa na)', a: ['über', 'ueber'], sk: 'Zákazník sa sťažoval na meškanie.', hint: 'sich beschweren + ? (vec)' },
      { q: 'Bitte melden Sie ___ bei mir, wenn Sie Fragen haben. (zvratné zámeno)', a: ['sich'], sk: 'Prosím, ozvite sa mi, ak budete mať otázky.', hint: 'zvratné zámeno pre „Sie"' },
      { q: 'Hast du an den Termin gedacht? – Ja, ich habe ___ gedacht. (da- + an)', a: ['daran'], sk: 'Myslel si na ten termín? – Áno, myslel som na to.', hint: 'pred samohláskou pridaj -r-' },
      { q: '___ sprechen wir im nächsten Meeting? (wo- + über)', a: ['worüber', 'worueber'], sk: 'O čom budeme hovoriť na ďalšej porade?', hint: 'otázka na vec: wo(r)- + predložka' }
    ]
  },

  /* 11 ─────────────────────────────────────────── */
  {
    id: 'passive',
    icon: '⚙️',
    title_sk: 'Pasív',
    title_de: 'Das Passiv',
    level: 'B1–B2',
    why_sk: 'V businesse sa často hovorí o procesoch, nie o osobách: „Die Rechnung wird geprüft", „Das wurde schon erledigt". Slováci pasív často obchádzajú alebo zamieňajú „wird" a „ist".',
    explain: `
<p>Pasív = dôležité je <b>čo sa deje</b>, nie kto to robí. V slovenčine často „sa" alebo „bolo/bol": <i>Faktúra <b>sa kontroluje</b></i> = <i>Die Rechnung <b>wird geprüft</b>.</i></p>
<table>
<thead><tr><th>Čas</th><th>Tvar</th><th>Príklad</th></tr></thead>
<tbody>
<tr><td>prítomný</td><td><b>wird</b> + Partizip II</td><td>Die Rechnung <b>wird</b> heute <b>bezahlt</b>.</td></tr>
<tr><td>minulý (najčastejšie)</td><td><b>wurde</b> + Partizip II</td><td>Der Vertrag <b>wurde</b> gestern <b>unterschrieben</b>.</td></tr>
<tr><td>perfekt</td><td><b>ist</b> + Partizip II + <b>worden</b></td><td>Das Budget <b>ist genehmigt worden</b>.</td></tr>
<tr><td>s modálnym slovesom</td><td>modál + Partizip II + <b>werden</b></td><td>Die Zahlen <b>müssen geprüft werden</b>.</td></tr>
</tbody>
</table>
<p>Tvary werden: ich werde, du wirst, er <b>wird</b>, wir/sie <b>werden</b>; minulý: er <b>wurde</b>, sie <b>wurden</b>.</p>
<p><b>Kto to robí?</b> von + Dativ: <i>Der Bericht wurde <b>vom</b> Controlling erstellt.</i> V praxi sa to často vynecháva.</p>
<p><b>Stav vs. proces:</b></p>
<ul>
<li><b>wird</b> geschlossen = práve sa zatvára (proces)</li>
<li><b>ist</b> geschlossen = je zatvorené (výsledok) – Das Büro ist heute geschlossen.</li>
</ul>
<p><b>Tip:</b> v perfekte pasívu je <b>worden</b> (bez ge-), nie „geworden" – „geworden" znamená „stal sa": Er ist Chef geworden.</p>`,
    examples: [
      { de: 'Die Rechnung <b>wird</b> gerade <b>geprüft</b>.', sk: 'Faktúra sa práve kontroluje.' },
      { de: 'Das <b>wurde</b> schon <b>erledigt</b>.', sk: 'To už bolo vybavené.' },
      { de: 'Die Ware <b>wird</b> morgen <b>geliefert</b>.', sk: 'Tovar bude dodaný zajtra.' },
      { de: 'Der Bericht <b>muss</b> bis Freitag <b>freigegeben werden</b>.', sk: 'Správa musí byť schválená do piatku.' },
      { de: 'Das Budget <b>ist</b> schon <b>genehmigt worden</b>.', sk: 'Rozpočet už bol schválený.' },
      { de: 'Hier <b>wird</b> Englisch und Deutsch <b>gesprochen</b>.', sk: 'Tu sa hovorí po anglicky a po nemecky.' }
    ],
    mistakes: [
      { wrong: 'Die Rechnung ist morgen bezahlt.', right: 'Die Rechnung wird morgen bezahlt.', why: 'Proces (čo sa stane) = werden. „ist bezahlt" je len výsledný stav.' },
      { wrong: 'Das Projekt ist gestern geworden abgeschlossen.', right: 'Das Projekt wurde gestern abgeschlossen.', why: 'V reči použi jednoduchšie „wurde + Partizip II"; v perfekte by to bolo „ist abgeschlossen worden".' },
      { wrong: 'Die Zahlen müssen werden geprüft.', right: 'Die Zahlen müssen geprüft werden.', why: 'Na konci vety je najprv Partizip II, až potom „werden".' }
    ],
    exercises: [
      { q: 'Die Rechnung ___ heute bezahlt. (werden)', a: ['wird'], sk: 'Faktúra sa dnes zaplatí.', hint: 'pasív, prítomný čas, jednotné číslo' },
      { q: 'Die Bestellungen ___ morgen verschickt. (werden)', a: ['werden'], sk: 'Objednávky sa odošlú zajtra.', hint: 'množné číslo' },
      { q: 'Hier ___ Deutsch gesprochen. (werden)', a: ['wird'], sk: 'Tu sa hovorí po nemecky.', hint: 'neosobný pasív – tvar pre „es"' },
      { q: 'Der Vertrag ___ gestern unterschrieben. (werden – minulý čas)', a: ['wurde'], sk: 'Zmluva bola podpísaná včera.', hint: 'Präteritum od werden' },
      { q: 'Das Projekt wurde letztes Jahr ___ . (starten)', a: ['gestartet'], sk: 'Projekt bol spustený minulý rok.', hint: 'Partizip II' },
      { q: 'Die Zahlen müssen noch ___ werden. (prüfen)', a: ['geprüft', 'geprueft'], sk: 'Čísla sa ešte musia skontrolovať.', hint: 'modál + Partizip II + werden' },
      { q: 'Der Bericht wurde ___ der Controlling-Abteilung erstellt. (kým?)', a: ['von'], sk: 'Správu vypracovalo oddelenie controllingu.', hint: 'pôvodca deja: ? + Dativ' },
      { q: 'Die Kosten sollen um zehn Prozent ___ werden. (senken)', a: ['gesenkt'], sk: 'Náklady majú byť znížené o desať percent.', hint: 'Partizip II pred „werden"' },
      { q: 'Wann ___ die Entscheidung getroffen? (werden – minulý čas)', a: ['wurde'], sk: 'Kedy bolo prijaté rozhodnutie?', hint: 'Präteritum od werden' },
      { q: 'Das Budget ist schon genehmigt ___ . (werden – perfekt pasíva)', a: ['worden'], sk: 'Rozpočet už bol schválený.', hint: 'v pasíve bez ge-' }
    ]
  },

  /* 12 ─────────────────────────────────────────── */
  {
    id: 'connectors',
    icon: '🔗',
    title_sk: 'Spojky a slovosled',
    title_de: 'Konnektoren',
    level: 'B1–B2',
    why_sk: 'Spojky robia z jednoduchých viet plynulú reč. Každá skupina mení slovosled inak – a Slováci často zamieňajú „wenn" a „als" (obe = „keď") či „wenn" a „ob".',
    explain: `
<p>Spojky delíme do <b>troch skupín</b> podľa toho, čo urobia so slovesom:</p>
<table>
<thead><tr><th>Skupina</th><th>Spojky</th><th>Slovosled</th></tr></thead>
<tbody>
<tr><td><b>1. bez zmeny</b></td><td>und, aber, oder, <b>denn</b>, sondern</td><td>…, denn ich <b>habe</b> keine Zeit.</td></tr>
<tr><td><b>2. sloveso na koniec</b></td><td><b>weil</b>, dass, ob, wenn, als, <b>obwohl</b>, bevor, nachdem, während, damit, bis</td><td>…, weil ich keine Zeit <b>habe</b>.</td></tr>
<tr><td><b>3. inverzia</b> (sloveso hneď za spojkou)</td><td><b>deshalb</b>, deswegen, trotzdem, dann, danach, außerdem, sonst, also</td><td>…, deshalb <b>habe</b> ich keine Zeit.</td></tr>
</tbody>
</table>
<p><b>denn</b> aj <b>weil</b> = lebo/pretože. V reči je „weil" častejšie.</p>
<p><b>„keď", „ak", „či":</b></p>
<ul>
<li><b>wenn</b> – keď (opakovane, v prítomnosti/budúcnosti) a ak: <i>Wenn ich in Wien bin, …</i></li>
<li><b>als</b> – keď (<b>raz</b> v minulosti): <i>Als ich in Wien war, …</i></li>
<li><b>ob</b> – či (nepriama otázka): <i>Ich weiß nicht, <b>ob</b> er kommt.</i> Nikdy nie „wenn"!</li>
</ul>
<p><b>Ďalšie užitočné:</b> obwohl (hoci), trotzdem (napriek tomu), damit (aby), bevor (predtým ako), nachdem (potom ako), während (počas toho, ako).</p>
<p><b>Tip:</b> keď vedľajšia veta stojí na začiatku, hlavná veta začína slovesom: <i>Weil der Zug Verspätung hatte, <b>bin</b> ich zu spät gekommen.</i></p>`,
    examples: [
      { de: 'Ich komme später, <b>weil</b> ich noch einen Termin <b>habe</b>.', sk: 'Prídem neskôr, lebo mám ešte termín.' },
      { de: 'Ich komme später, <b>denn</b> ich <b>habe</b> noch einen Termin.', sk: 'Prídem neskôr, pretože mám ešte termín.' },
      { de: 'Der Zug hatte Verspätung, <b>deshalb bin</b> ich zu spät gekommen.', sk: 'Vlak meškal, preto som prišiel neskoro.' },
      { de: '<b>Obwohl</b> das Budget knapp <b>war</b>, haben wir das Ziel erreicht.', sk: 'Hoci bol rozpočet tesný, dosiahli sme cieľ.' },
      { de: '<b>Als</b> ich bei Siemens <b>angefangen habe</b>, war alles neu.', sk: 'Keď som začal v Siemense, všetko bolo nové.' },
      { de: 'Können Sie mir sagen, <b>ob</b> die Rechnung schon bezahlt <b>ist</b>?', sk: 'Môžete mi povedať, či je faktúra už zaplatená?' }
    ],
    mistakes: [
      { wrong: 'Ich weiß nicht, wenn er heute kommt.', right: 'Ich weiß nicht, ob er heute kommt.', why: '„či" = ob. „wenn" znamená „keď/ak".' },
      { wrong: 'Wenn ich Kind war, habe ich in Košice gewohnt.', right: 'Als ich Kind war, habe ich in Košice gewohnt.', why: 'Jednorazová situácia/obdobie v minulosti = als.' },
      { wrong: 'Ich bin müde, deshalb ich gehe nach Hause.', right: 'Ich bin müde, deshalb gehe ich nach Hause.', why: 'Po „deshalb" ide hneď sloveso (inverzia).' }
    ],
    exercises: [
      { q: 'Ich komme später, ___ ich noch ein Meeting habe. (lebo – sloveso na konci)', a: ['weil'], sk: 'Prídem neskôr, lebo mám ešte poradu.', hint: 'spojka, po ktorej ide sloveso na koniec' },
      { q: 'Ich komme später, ___ ich habe noch ein Meeting. (lebo – bez zmeny slovosledu)', a: ['denn'], sk: 'Prídem neskôr, pretože mám ešte poradu.', hint: 'spojka zo skupiny und/aber/oder' },
      { q: 'Ich weiß nicht, ___ er heute im Büro ist. (či)', a: ['ob'], sk: 'Neviem, či je dnes v kancelárii.', hint: 'nepriama otázka áno/nie' },
      { q: '___ ich nach Wien fahre, nehme ich immer den Zug. (keď – opakovane)', a: ['wenn'], sk: 'Keď idem do Viedne, vždy idem vlakom.', hint: 'opakovaná situácia' },
      { q: '___ ich Kind war, wohnte ich in Bratislava. (keď – raz v minulosti)', a: ['als'], sk: 'Keď som bol dieťa, býval som v Bratislave.', hint: 'jednorazovo v minulosti' },
      { q: 'Der Zug hatte Verspätung, ___ bin ich zu spät gekommen. (preto)', a: ['deshalb', 'deswegen', 'daher', 'also'], sk: 'Vlak meškal, preto som prišiel neskoro.', hint: 'po spojke ide hneď sloveso' },
      { q: 'Ich bin müde, ___ arbeite ich weiter. (napriek tomu)', a: ['trotzdem'], sk: 'Som unavený, napriek tomu pracujem ďalej.', hint: 'inverzia za spojkou' },
      { q: '___ es regnet, gehen wir zu Fuß. (hoci)', a: ['obwohl'], sk: 'Hoci prší, ideme pešo.', hint: 'sloveso na koniec' },
      { q: 'Ich trinke noch schnell einen Kaffee, ___ wir anfangen. (predtým ako)', a: ['bevor'], sk: 'Ešte si rýchlo vypijem kávu, predtým ako začneme.', hint: 'časová spojka, sloveso na koniec' },
      { q: 'Bitte schicken Sie mir die Unterlagen, ___ ich mich vorbereiten kann. (aby)', a: ['damit'], sk: 'Prosím, pošlite mi podklady, aby som sa mohol pripraviť.', hint: 'účel, sloveso na koniec' }
    ]
  },

  /* 13 ─────────────────────────────────────────── */
  {
    id: 'negation',
    icon: '🚫',
    title_sk: 'Zápor: nicht vs. kein',
    title_de: 'Negation',
    level: 'A2–B1',
    why_sk: 'V slovenčine máme jedno „ne-", v nemčine treba vybrať „nicht" alebo „kein" a dať „nicht" na správne miesto. Typické chyby: „Ich habe nicht Zeit", „Ich verstehe nicht das".',
    explain: `
<p><b>kein</b> = zápor pre podstatné meno <b>s ein</b> alebo <b>bez člena</b>. Skloňuje sa ako „ein":</p>
<ul>
<li>Das ist <b>ein</b> Problem → Das ist <b>kein</b> Problem.</li>
<li>Ich habe Zeit → Ich habe <b>keine</b> Zeit.</li>
<li>Wir haben <b>einen</b> Termin → Wir haben <b>keinen</b> Termin.</li>
</ul>
<p><b>nicht</b> = všetko ostatné: slovesá, prídavné mená, príslovky, podstatné mená s <b>der/die/das</b> alebo <b>mein/dein…</b>, mená.</p>
<p><b>Kam dať „nicht":</b></p>
<table>
<thead><tr><th>Pravidlo</th><th>Príklad</th></tr></thead>
<tbody>
<tr><td>zápor celej vety → čo najďalej <b>na koniec</b> (za predmet)</td><td>Ich verstehe das <b>nicht</b>.</td></tr>
<tr><td>ale <b>pred</b> druhú časť slovesa</td><td>Ich habe ihn <b>nicht</b> angerufen. Ich kann <b>nicht</b> kommen.</td></tr>
<tr><td><b>pred</b> prídavné meno / miesto / predložku</td><td>Das ist <b>nicht</b> gut. Er ist <b>nicht</b> im Büro.</td></tr>
<tr><td>zápor jedného slova → <b>pred</b> neho (+ sondern)</td><td><b>Nicht</b> heute, <b>sondern</b> morgen.</td></tr>
</tbody>
</table>
<p><b>Užitočné:</b> noch nicht (ešte nie), nicht mehr (už nie), kein … mehr (už žiadny), <b>sondern</b> (ale – po zápore), <b>doch</b> (ale áno – odpoveď na zápornú otázku).</p>
<p><b>Dvojitý zápor nie!</b> Slovensky „Nikto nič nevie", nemecky iba jeden zápor: <i>Niemand weiß <b>etwas</b>.</i> / <i>Ich habe <b>nichts</b> gesagt.</i></p>`,
    examples: [
      { de: 'Kein Problem!', sk: 'Žiadny problém!' },
      { de: 'Ich habe heute leider <b>keine</b> Zeit.', sk: 'Dnes, žiaľ, nemám čas.' },
      { de: 'Das habe ich <b>nicht</b> verstanden.', sk: 'To som nepochopil.' },
      { de: 'Herr Weber ist heute <b>nicht</b> im Büro.', sk: 'Pán Weber dnes nie je v kancelárii.' },
      { de: 'Das Meeting ist <b>nicht</b> heute, <b>sondern</b> morgen.', sk: 'Porada nie je dnes, ale zajtra.' },
      { de: 'Hast du keinen Hunger? – <b>Doch</b>!', sk: 'Nie si hladný? – Ale áno!' }
    ],
    mistakes: [
      { wrong: 'Ich habe nicht Zeit.', right: 'Ich habe keine Zeit.', why: 'Podstatné meno bez člena sa zapiera pomocou „kein".' },
      { wrong: 'Ich verstehe nicht das.', right: 'Ich verstehe das nicht.', why: 'Pri zápore celej vety ide „nicht" za predmet, na koniec.' },
      { wrong: 'Niemand weiß nichts.', right: 'Niemand weiß etwas.', why: 'V nemčine je len jeden zápor vo vete.' }
    ],
    exercises: [
      { q: 'Ich habe heute ___ Zeit. (nicht/kein)', a: ['keine'], sk: 'Dnes nemám čas.', hint: 'die Zeit bez člena → kein + koncovka' },
      { q: 'Das ist ___ Problem. (nicht/kein)', a: ['kein'], sk: 'To nie je problém.', hint: 'ein Problem → ?' },
      { q: 'Ich verstehe das ___ . (nicht/kein)', a: ['nicht'], sk: 'Tomu nerozumiem.', hint: 'zápor slovesa' },
      { q: 'Er ist heute ___ im Büro. (nicht/kein)', a: ['nicht'], sk: 'Dnes nie je v kancelárii.', hint: 'pred určením miesta' },
      { q: 'Wir haben ___ Termin mehr frei. (nicht/kein)', a: ['keinen'], sk: 'Už nemáme voľný žiadny termín.', hint: 'der Termin, akuzatív' },
      { q: 'Das ist ___ mein Laptop. (nicht/kein)', a: ['nicht'], sk: 'To nie je môj notebook.', hint: 'pred privlastňovacím zámenom' },
      { q: 'Ich habe den Bericht noch ___ gelesen. (ešte nie)', a: ['nicht'], sk: 'Správu som ešte nečítal.', hint: 'noch …' },
      { q: 'Das ist nicht mein Fehler, ___ deiner. (ale – po zápore)', a: ['sondern'], sk: 'To nie je moja chyba, ale tvoja.', hint: 'oprava po zápore' },
      { q: 'Kommst du nicht mit? – ___ , ich komme mit! (ale áno)', a: ['doch'], sk: 'Nejdeš s nami? – Ale áno, idem!', hint: 'kladná odpoveď na zápornú otázku' },
      { q: 'Niemand weiß ___ . (nikto nič nevie)', a: ['etwas', 'was'], sk: 'Nikto nič nevie.', hint: 'len jeden zápor vo vete' }
    ]
  },

  /* 14 ─────────────────────────────────────────── */
  {
    id: 'relative-clauses',
    icon: '🧩',
    title_sk: 'Vzťažné vety',
    title_de: 'Relativsätze',
    level: 'B1–B2',
    why_sk: 'Vzťažné vety („kolega, ktorý…", „zákazník, ktorému…") potrebuješ na presné vyjadrenie. Slováci často použijú zlý pád alebo nechajú sloveso v strede vety.',
    explain: `
<p>Vzťažné zámeno = slovenské „ktorý/ktorá/ktoré". Je takmer rovnaké ako člen der/die/das:</p>
<table>
<thead><tr><th></th><th>muž. r.</th><th>žen. r.</th><th>stred. r.</th><th>množ. č.</th></tr></thead>
<tbody>
<tr><td>Nom.</td><td>der</td><td>die</td><td>das</td><td>die</td></tr>
<tr><td>Akk.</td><td>den</td><td>die</td><td>das</td><td>die</td></tr>
<tr><td>Dat.</td><td>dem</td><td>der</td><td>dem</td><td><b>denen</b></td></tr>
<tr><td>Gen. (ktorého/ktorej)</td><td><b>dessen</b></td><td><b>deren</b></td><td><b>dessen</b></td><td><b>deren</b></td></tr>
</tbody>
</table>
<p><b>Ako vybrať správne zámeno – 2 kroky:</b></p>
<ul>
<li><b>Rod a číslo</b> podľa podstatného mena pred čiarkou (der Kunde → d-).</li>
<li><b>Pád</b> podľa funkcie <b>vo vzťažnej vete</b> – rovnako ako v slovenčine (ktorý / ktorého / ktorému).</li>
</ul>
<p>Príklad: <i>der Kunde, <b>der</b> anruft</i> (ktorý – Nom.) / <i>den ich anrufe</i> (ktorému volám – anrufen + Akk!) / <i>dem ich helfe</i> (ktorému pomáham – Dat.).</p>
<p><b>Predložka</b> stojí pred zámenom: <i>die Kollegin, <b>mit der</b> ich arbeite</i> (s ktorou).</p>
<p><b>Sloveso ide na koniec</b>, vzťažná veta je oddelená čiarkou.</p>
<p><b>was</b> po alles, etwas, nichts, das: <i>Das ist alles, <b>was</b> ich weiß.</i> <b>wo</b> pri miestach (v reči): <i>die Stadt, <b>wo</b> ich wohne.</i></p>`,
    examples: [
      { de: 'Das ist der Kollege, <b>der</b> mir mit Excel geholfen hat.', sk: 'To je kolega, ktorý mi pomohol s Excelom.' },
      { de: 'Der Bericht, <b>den</b> du geschickt hast, ist super.', sk: 'Správa, ktorú si poslal, je super.' },
      { de: 'Der Kunde, <b>dem</b> wir das Angebot geschickt haben, hat zugesagt.', sk: 'Zákazník, ktorému sme poslali ponuku, súhlasil.' },
      { de: 'Die Firma, <b>bei der</b> ich arbeite, hat 500 Mitarbeiter.', sk: 'Firma, v ktorej pracujem, má 500 zamestnancov.' },
      { de: 'Das sind die Kollegen, <b>mit denen</b> ich das Projekt mache.', sk: 'To sú kolegovia, s ktorými robím ten projekt.' },
      { de: 'Frau Berger, <b>deren</b> Team das Reporting macht, kommt später.', sk: 'Pani Bergerová, ktorej tím robí reporting, príde neskôr.' }
    ],
    mistakes: [
      { wrong: 'Der Bericht, der du geschickt hast, ist gut.', right: 'Der Bericht, den du geschickt hast, ist gut.', why: 'Vo vzťažnej vete je to predmet (ktorú si poslal) → akuzatív: den.' },
      { wrong: 'Die Kollegen, mit die ich arbeite…', right: 'Die Kollegen, mit denen ich arbeite…', why: 'Datív množného čísla vzťažného zámena je „denen".' },
      { wrong: 'Das ist der Kunde, der hat gestern angerufen.', right: 'Das ist der Kunde, der gestern angerufen hat.', why: 'Vzťažná veta je vedľajšia – časované sloveso ide na koniec.' }
    ],
    exercises: [
      { q: 'Das ist der Kollege, ___ mir geholfen hat. (ktorý)', a: ['der'], sk: 'To je kolega, ktorý mi pomohol.', hint: 'der Kollege, nominatív' },
      { q: 'Das ist die Kollegin, ___ ich gestern angerufen habe. (ktorej)', a: ['die'], sk: 'To je kolegyňa, ktorej som včera volal.', hint: 'anrufen + Akkusativ, ženský rod' },
      { q: 'Der Bericht, ___ du geschickt hast, ist sehr gut. (ktorú)', a: ['den'], sk: 'Správa, ktorú si poslal, je veľmi dobrá.', hint: 'der Bericht, akuzatív' },
      { q: 'Der Kunde, ___ wir das Angebot geschickt haben, hat zugesagt. (ktorému)', a: ['dem'], sk: 'Zákazník, ktorému sme poslali ponuku, súhlasil.', hint: 'komu? – datív, mužský rod' },
      { q: 'Die Firma, bei ___ ich arbeite, hat 200 Mitarbeiter. (ktorej)', a: ['der'], sk: 'Firma, v ktorej pracujem, má 200 zamestnancov.', hint: 'bei + Dativ, die Firma' },
      { q: 'Die Kollegen, mit ___ ich zusammenarbeite, sind sehr nett. (ktorými)', a: ['denen'], sk: 'Kolegovia, s ktorými spolupracujem, sú veľmi milí.', hint: 'datív množného čísla' },
      { q: 'Das ist alles, ___ ich weiß. (čo)', a: ['was'], sk: 'To je všetko, čo viem.', hint: 'po „alles"' },
      { q: 'Das Thema, über ___ wir gestern gesprochen haben, ist wichtig. (ktorej)', a: ['das'], sk: 'Téma, o ktorej sme včera hovorili, je dôležitá.', hint: 'über + Akkusativ, das Thema' },
      { q: 'Herr Novák, ___ Firma wir übernommen haben, ist heute hier. (ktorého)', a: ['dessen'], sk: 'Pán Novák, ktorého firmu sme prevzali, je dnes tu.', hint: 'privlastnenie, mužský rod' },
      { q: 'Frau Berger, ___ Team das Projekt leitet, kommt später. (ktorej)', a: ['deren'], sk: 'Pani Bergerová, ktorej tím vedie projekt, príde neskôr.', hint: 'privlastnenie, ženský rod' }
    ]
  }
);
