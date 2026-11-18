# ЛР-6. Робота зі складними формами та валідація

Стартовий проєкт лабораторної роботи № 6 курсу «Розробка вебзастосунків на
React»: форма бронювання столика з ЛР-5. Інструкція:
https://denysmatsevych.github.io/web-development-2026/react/labs/lab-6/

Форма працює так, як ви залишили її наприкінці ЛР-5, і перевіряє лише
обов'язкові поля (`required`). Ви опишете правила форми схемою Zod, передасте
значення полів React Hook Form, покажете повідомлення про помилки під полями
й надсилатимете бронювання на сервер через Action React 19.

## Що вже є

- форма з ЛР-5 (`src/components/BookingForm.jsx`) і контрольований
  `GuestsStepper`;
- нове поле «Телефон» і порожні абзаци для повідомлень про помилки під полями
  «Ім'я», «Телефон», «Дата» й «Час»;
- `src/api.js`: імітований сервер кав'ярні, який відповідає за секунду;
- `src/bookingSchema.js`: функції `today()` і `nowTime()` і порожня схема,
  яку ви заповните;
- стилі для повідомлень про помилки, стану очікування й форми підписки в
  `src/index.css`;
- бібліотеки `react-hook-form`, `zod` і `@hookform/resolvers` у
  `package.json`: `npm install` у корені встановить їх разом з іншими.

## Команди

`npm install` виконуйте в корені репозиторію `react-labs`, решту — у теці
`lab-6/`:

- `npm run dev`: dev-сервер на http://localhost:5173
- `npm run lint`: ESLint
- `npm run format:check`: перевірка форматування Prettier
- `npm run build`: production-збірка в `dist/`

## Порівняння з React Hook Form і Zod

### Бібліотеки та версії

| Версія      | Форма                | Схема     | Останній реліз                          |
| ----------- | -------------------- | --------- | --------------------------------------- |
| `lab-6`     | react-hook-form 7.92 | zod 4.6   | RHF — листопад 2026, Zod — жовтень 2026 |
| `lab-6-alt` | formik 2.4.9         | yup 1.7.1 | Formik — 10.11.2025, Yup — 21.09.2025   |

### Що замінило API React Hook Form

| React Hook Form | Formik + Yup                                                     |
| --------------- | ---------------------------------------------------------------- |
| register        | formik.getFieldProps('name')                                     |
| Controller      | value={formik.values.guests} і formik.setFieldValue('guests', …) |
| useWatch        | formik.values.comment                                            |
| handleSubmit    | formik.handleSubmit і опція onSubmit у useFormik                 |
| zodResolver     | validationSchema: bookingSchema                                  |
| reset           | formik.resetForm()                                               |

### Розмір збірки

- lab-6: 353.65 kB | gzip 109.70 kB
- lab-6-alt: 358.84 kB | gzip 111.76 kB

### Рендери під час введення в полі «Ім'я»

- React Hook Form: поки ви вводите ім'я, нічого не рендериться. Поле
  неконтрольоване, значення живе в DOM.
- Formik: BookingForm і GuestsStepper рендеряться з кожною літерою. Поля
  контрольовані, значення живе в стані Formik.

### Висновок

Для наступного проєкту я б обрала React Hook Form і Zod. Коли переписувалаформу на Formik і Yup, багато речей довелося робити вручну: ставити курсор у перше неправильне поле, приховувати повідомлення для полів, які ще не заповнювали, і додавати `required`, бо Formik перетворює порожні рядки на `undefined`. Також у DevTools, Formik форма рендериться після кожної введеної літери, а з React Hook Form лише тоді, коли зникає помилка. Ще також Formik і Yup не оновлювалися понад рік, тоді як React Hook Form і Zod отримують нові версії майже щомісяця.
