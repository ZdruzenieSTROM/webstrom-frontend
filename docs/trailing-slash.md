Insight do toho, co sa deje v DevTools Network tabe a ako robime z FE requesty. Nejake fakty:
- BE django server ocakava requesty s koncovym lomitkom (trailing slash)
- next.js FE nerozlisuje medzi requestami kvoli tomu, ze navstivim nejaku stranku, a tym, ze nieco volam cez axios manualne
- v browseri chceme vidiet URL bez koncoveho lomitka
- next.js server tym padom vracia 308 Redirect na vsetky requesty s koncovym lomitkom a prepise ich takto na bezlomitkove (default spravanie, nastavitelne)
- kedze sa toto deje aj pre manualne requesty na BE, najprv vidime v Network tabe request, z ktoreho next.js odstrani lomitko, no tento request by django server odmietol, preto mame v [`next.config.js`](../next.config.js) definovany "rewrite", ktory to lomitko pridava 😅
