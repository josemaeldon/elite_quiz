const menu_data = [
  {
    id: 1,
    mega_menu: false,
    has_dropdown: false,
    title: 'home',
    link: '/',
    active: 'active'
  },
  {
    id: 2,
    mega_menu: false,
    has_dropdown: false,
    title: 'quiz_play',
    link: '/quiz-play',
    active: ''
  },
  {
    id: 3,
    mega_menu: false,
    has_dropdown: false,
    title: 'instruction',
    link: '/instruction',
    active: ''
  },
  {
    id: 4,
    mega_menu: false,
    has_dropdown: true,
    title: 'more',
    link: '/',
    active: '',
    sub_menus: [
      { link: '/contact-us', title: 'contact_us' },
      { link: '/about-us', title: 'about_us' },
      { link: '/terms-conditions', title: 't_c' },
      { link: '/privacy-policy', title: 'privacy_policy'}
    ]
  }
]
export default menu_data
