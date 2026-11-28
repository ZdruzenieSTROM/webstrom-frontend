# webstrom-frontend

- [Spustenie backendu](#spustenie-backendu)
  - [Lokálny BE](#lokálny-be)
- [Spustenie frontendu](#spustenie-frontendu)
- [IDE setup](#ide-setup)

## Spustenie backendu

Defaultne sú API requesty smerované na deploynutý test BE (test.strom.sk). Zmeniť to môžeš v [.env](.env).

### Lokálny BE

Ak potrebuješ urobiť nejaké zmeny aj na BE (a otestovať, že to s FE funguje), musíš si spustiť BE lokálne a nasmerovať naň FE.
Ak ti deployed BE stačí, pokračuj na [Spustenie frontendu](#spustenie-frontendu).

Návod na rozbehanie backendu sa nachádza vo [webstrom-backend](https://github.com/ZdruzenieSTROM/webstrom-backend/blob/master/README.md) repozitári.

Po inštalácii potrebných balíkov a vytvorení databázy spusti backend django server pomocou:

```sh
python manage.py runserver
```

Tento príkaz spustí server na `localhost:8000`, kde sa dá pristupovať k API a k django admin stránke.

Zakomentuj/odkomentuj riadky v [.env](.env), aby requesty smerovali na BE na `localhost:8000`.

## Spustenie frontendu

Naklonuj si projekt z GitHubu a prepni sa do priečinku projektu:

```sh
git clone https://github.com/ZdruzenieSTROM/webstrom-frontend
cd webstrom-frontend
```

Potrebuješ:

- [Node.js](https://nodejs.org/en/) - javascriptový engine
  - check, či ho máš: `node -v`
  - dá sa nainštalovať priamo zo stránky, ale ideálne je použiť [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) (neboj sa inštalačných inštrukcií)
- [Bun](https://bun.com/docs/installation) - správca JS balíkov (aplikácia samotná beží na Node.js)
  - keď už máš Node.js, nainštaluješ ho pomocou `npm install -g bun`
  - check, či ho máš: `bun -v`

Potrebné balíky pre projekt sa nainštalujú pomocou:

```sh
bun install
```

Development server sa spustí pomocou príkazu:

```sh
bun dev
```

Tento príkaz spustí server na `localhost:3000`, ktorý reaguje na zmeny vo frontendovom kóde a automaticky sa reloaduje.

Typy, lint a testy (to isté spúšťa CI) si overíš pomocou:

```sh
bun run typecheck
bun run lint
bun run test
```

Pozor, `bun test` (bez `run`) spustí Bun test runner namiesto nášho vitestu.

## IDE setup

Používame VSCode, nainštaluj si doň rozšírenie [Oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) - lintuje (oxlint) aj formátuje (oxfmt). V repe máme `.vscode` config, v ktorom zapíname formátovanie a "fix-on-save" - kód sa teda formátuje a opravuje pri uložení súboru. VSCode ti rozšírenie ponúkne aj sám podľa `.vscode/extensions.json`.

Rozšírenie je takisto možné doinštalovať pomocou `Ctrl+P` a spustením:

```sh
ext install oxc.oxc-vscode
```

Z príkazového riadku: `bun run lint` (oxlint), `bun run format:check` (oxfmt), opravy cez `bun run lint:fix` a `bun run format`.
