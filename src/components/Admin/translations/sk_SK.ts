import slovakMessages from "ra-language-slovak"

export const sk_SK = {
  ...slovakMessages,
  resources: {
    'cms/post': {
      name: 'Príspevky',
      fields: {
        caption: "Názov",
        short_text: "Krátky text",
        details: "Detaily",
        added_at: "Vytvorené",
        visible_after: "Viditeľné po",
        visible_until: "Viditeľné do",
        sites: "Stránky",
        links: "Odkazy",

      }
    },
    'base/flat-page': {
      name: 'Test123'
    },
    'competition/competition': {
      name: 'Súťaže',
      fields: {
        name: "Názov",
        slug: "Slug",
        start_year: "Start Year",
        description: "Popis",
        rules: "Pravidlá",
        competition_type: {
          name: "Názov súťaže"
        },
        sites: "Stránky",
        who_can_participate: "Who Can Participate",
        min_years_until_graduation: "min_years_until_graduation"
      }
    },
      events: '',
      semesters: '',
      series: '',
      problems: '',
      solutions: '',
      schools: '',
    },
  
    controls: {
      create: '',
      edit: '',
      export: '',
      show: '',
      back_to_list: '',
      back_home: '',
      logout: 'Odhlásiť sa',
      test: 'Test'
    },
  
}
