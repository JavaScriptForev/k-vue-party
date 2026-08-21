export const COLORS = {
  red:    { name: 'Красный',    hex: '#FF6B6B', emoji: '🔴' },
  orange: { name: 'Оранжевый', hex: '#FFA500', emoji: '🟠' },
  yellow: { name: 'Жёлтый',    hex: '#FFD93D', emoji: '🟡' },
  green:  { name: 'Зелёный',   hex: '#6BCB77', emoji: '🟢' },
  blue:   { name: 'Синий',     hex: '#4D96FF', emoji: '🔵' }
}

export const COLOR_KEYS = ['red', 'orange', 'yellow', 'green', 'blue']

export const LEVELS = [
  {
    id: 1,
    title: 'Станция отправления',
    subtitle: 'Билетная касса',
    buttons: [
      { colorKey: 'red',    label: 'Купить билет\nживотному', emoji: '🐶', text: 'Купить билет\nживотному 🐶' },
      { colorKey: 'orange', label: 'Купить\nбилет',        emoji: '🎫', text: 'Купить билет 🎫' },
      { colorKey: 'yellow', label: 'Вагон-\nсчастье',      emoji: '🌈', text: 'Вагон-счастье 🌈' },
      { colorKey: 'green',  label: 'Плацкарт\nдо радуги',  emoji: '☁️', text: 'Плацкарт до радуги ☁️' },
      { colorKey: 'blue',   label: 'Купе с\nприключениями',emoji: '🗺️', text: 'Купе с приключениями 🗺️' }
    ],
    slotMessages: [
      'Билет животному куплен!',
      'Билет куплен!',
      'Вагон счастья зарезервирован!',
      'Плацкарт до радуги забронирован!',
      'Купе с приключениями занято!'
    ]
  },
  {
    id: 2,
    title: 'Экспресс радости',
    subtitle: 'Касса выходного дня',
    buttons: [
      { colorKey: 'red',    label: 'Экспресс\nдо выходного', emoji: '🏖️', text: 'Экспресс до выходного 🏖️' },
      { colorKey: 'orange', label: 'Билет\ncпитана',         emoji: '🚀', text: 'Билет для капитана 🚀' },
      { colorKey: 'yellow', label: 'Льготный\nбилет на облако', emoji: '⭐', text: 'Льготный билет на облако ⭐' },
      { colorKey: 'green',  label: 'Семейный\nкупе',         emoji: '👨‍👩‍👧‍👦', text: 'Семейный купе 👨‍👩‍👧‍👦' },
      { colorKey: 'blue',   label: 'Билет\nв сказку',        emoji: '🧚', text: 'Билет в сказку 🧚' }
    ],
    slotMessages: [
      'Экспресс до выходного забронирован!',
      'Билет капитана выдан!',
      'Льготный билет на облако активирован!',
      'Семейное купе занято!',
      'Билет в сказку получен!'
    ]
  },
  {
    id: 3,
    title: 'Ракета чудес',
    subtitle: 'Финальная станция',
    buttons: [
      { colorKey: 'red',    label: 'Билет на\nракету',       emoji: '🛸', text: 'Билет на ракету 🛸' },
      { colorKey: 'orange', label: 'Волшебный\nэкспресс',    emoji: '✨', text: 'Волшебный экспресс ✨' },
      { colorKey: 'yellow', label: 'Поезд\nдружбы',          emoji: '🤝', text: 'Поезд дружбы 🤝' },
      { colorKey: 'green',  label: 'Вагон\nулыбок',          emoji: '😄', text: 'Вагон улыбок 😄' },
      { colorKey: 'blue',   label: 'Билет на\nоблако',       emoji: '☁️', text: 'Билет на облако ☁️' }
    ],
    slotMessages: [
      'Билет на ракету активирован!',
      'Волшебный экспресс запущен!',
      'Поезд дружбы отправляется!',
      'Вагон улыбок наполнен!',
      'Билет на облако получен!'
    ]
  }
]
