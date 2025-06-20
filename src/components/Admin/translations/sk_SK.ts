import slovakMessages from 'ra-language-slovak'

export const sk_SK = {
  ra: {
    ...slovakMessages.ra,
    page: {
      ...slovakMessages.ra.page,
      list: '%{name}',
    },
    action: {
      ...slovakMessages.ra.action,
      publication: {
        create: 'Pridať novú publikáciu',
      },
    },
    sort: {
      ASC: 'Vzostupne',
      DESC: 'Zostupne',
    },
    configurable: {
      customize: 'Upraviť',
    },
  },
  resources: {
    'cms/post': {
      name: 'Novinky',
      fields: {
        caption: 'Názov',
        short_text: 'Krátky text',
        details: 'Detaily',
        added_at: 'Vytvorené',
        visible_after: 'Viditeľné po',
        visible_until: 'Viditeľné do',
        sites: 'Stránky',
        links: 'Odkazy',
      },
    },
    'cms/flat-page': {
      name: 'Ploché stránky',
      fields: {
        id: 'ID',
        url: 'URL',
        title: 'Názov',
        content: 'Obsah',
        sites: 'Stránky',
      },
    },
    'competition/competition': {
      name: 'Súťaže',
      fields: {
        name: 'Názov',
        slug: 'Slug',
        start_year: 'Start Year',
        description: 'Popis',
        rules: 'Pravidlá',
        competition_type: {
          name: 'Názov súťaže',
        },
        sites: 'Stránky',
        who_can_participate: 'Who Can Participate',
        min_years_until_graduation: 'min_years_until_graduation',
      },
    },
    'competition/event': {
      name: 'Udalosti',
      fields: {
        competition: 'Súťaž',
        year: 'Ročník',
        season_code: 'season_code',
        school_year: 'Školský rok',
        start: 'Začiatok',
        end: 'Koniec',
        location: 'location',
        additional_name: 'additional_name',
        registration_link: {
          id: 'ID',
          url: 'Odkaz na registráciu',
          start: 'Začiatok registrácie',
          end: 'Koniec registrácie',
          additional_info: 'Ďalšie informácie',
        },
        publication_set: 'Publikácie',
      },
    },
    'competition/semester': {
      name: 'Semestre',
      fields: {
        competition: 'Súťaž',
        year: 'Ročník',
        season_code: 'season_code',
        school_year: 'Školský rok',
        start: 'Začiatok',
        end: 'Koniec',
        complete: 'complete',
        additional_name: 'AddditionalName',
        registration_link: 'Odkaz na registráciu',
        series_set: 'Série',
        publication_set: 'Publikácie',
        late_tags: 'late_tags',
      },
    },
    'competition/series': {
      name: 'Série',
      fields: {
        semester: 'Semester',
        deadline: 'Deadline',
        order: 'Poradie',
        complete: 'Complete',
        problems: 'Úlohy',
      },
    },
    'competition/problem': {
      name: 'Úlohy',
      fields: {
        series: 'Séria',
        order: 'Poradie',
        text: 'Zadanie',
        image: 'Obrázok',
        num_comments: 'Počet komentárov',
      },
    },
    'competition/solution': {
      name: 'Riešenia',
      fields: {
        problem: 'Úloha',
        semester_registration: 'Riešiteľ',
        late_tag: 'Po termíne',
        is_online: 'Internetové riešenie',
        solution: 'Riešenie',
      },
    },
    'competition/event-registration': {
      name: 'Registrácie do súťaží',
      fields: {
        school: {
          abbreviation: 'Škola',
        },
        grade: {
          tag: 'Ročník',
        },
        event: 'Event',
      },
    },
    'personal/schools': {
      name: 'Školy',
      fields: {
        name: 'Názov školy',
        street: 'Ulica',
        city: 'Mesto',
        zip_code: 'PSČ',
        district: 'Okres',
        abbreviation: 'Skratka školy',
        email: 'Email',
      },
    },
    'personal/profiles': {
      name: 'Uživateľské profily',
      fields: {
        first_name: 'Meno',
        last_name: 'Priezvisko',
        school: {
          verbose_name: 'Škola',
        },
        grade: 'Ročník',
      },
    },
  },

  controls: {
    back_home: 'Späť na hlavnú stránku',
    logout: 'Odhlásiť sa',
  },

  content: {
    labels: {
      general: 'Všeobecné',
      preview: 'Náhľad',
      links: 'Odkazy',
      publications: 'Publikácie',
      series: 'Série',
      late_tags: 'Late_tags',
      problems: 'Úlohy',
      history_events: 'History_Events',
      back_to_list: 'Späť na list',
      competition_type: 'Typ súťaže',
      history_events_count: 'HE count',
      name: 'Meno a priezvisko',
      reg_link: 'Odkaz na registráciu',
      reg_link_add: 'Pridať odkaz na registráciu',
      problem_count: 'Počet úloh',
      is_online: 'Internetové riešenie?',
      next_event: 'Prebiehajúca alebo najbližšia akcia',
      has_vzorak: 'Má vzorák',
      has_solution: 'Má nahraté riešenie',
    },
    footer: {
      timezone_message: 'Všetky časy sú uvedené v časovom pásme Europe/Bratislava',
    },
    seasons: {
      winter: 'Zimný',
      summer: 'Letný',
      other: 'Iný',
    },
  },
}
