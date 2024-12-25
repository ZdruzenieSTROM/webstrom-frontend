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
- [Yarn](https://yarnpkg.com/getting-started/install) - správca JS balíkov

Potrebné balíky pre projekt sa nainštalujú pomocou:

```sh
yarn install
```

alebo len

```sh
yarn
```

Development server sa spustí pomocou príkazu:

```sh
yarn dev
```

Tento príkaz spustí server na `localhost:3000`, ktorý reaguje na zmeny vo frontendovom kóde a automaticky sa reloaduje.

## IDE setup

Používame VSCode, nainštaluj si doň [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) rozšírenie (formátuje kód). V repe máme `.vscode` config, v ktorom zapíname "fix-on-save" - kód sa teda formátuje pri uložení súboru.

Rozšírenie je takisto možné doinštalovať pomocou `Ctrl+P` a spustením:

```sh
ext install dbaeumer.vscode-eslint
```
