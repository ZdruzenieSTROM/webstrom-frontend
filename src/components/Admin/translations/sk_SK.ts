import slovakMessages from 'ra-language-slovak'

export const sk_SK = {
  ra: {
    ...slovakMessages.ra,
  },
  resources: {
    'cms/post': {
      name: 'Príspevky',
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
    'base/flat-page': {
      name: 'flat-pages',
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
      name: 'competition/event',
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
          start: 'registration_link.start',
          end: 'registration_link.end',
          additional_info: 'Ďalšie informácie',
        },
        publication_set: 'Pubikácie',
      },
    },
    'competition/semester': {
      name: 'competition/semester',
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
      name: 'competition/series',
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
      name: 'event-registration',
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
      general: 'Generala',
      preview: 'Náhľad',
      links: 'Odkazy',
      publications: 'Publikácie',
      series: 'Série',
      late_tags: 'Late_tags',
      problems: 'Úlohy',
      history_events: 'History_Events',
    },
    footer: {
      timezone_message: 'Všetky časy sú uvedené v časovom pásme Europe/Bratislava',
    },
  },
}
