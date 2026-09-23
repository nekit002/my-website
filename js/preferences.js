const languageKey = 'learnico-lab10-language';
const themeKey = 'learnico-lab10-theme';
const translations = {
  'Home': 'Главная', 'About': 'О нас', 'Blog': 'Блог', 'Contact': 'Контакты', 'Courses': 'Курсы', 'Admin': 'Администратор',
  'Search': 'Поиск', 'Cart': 'Корзина', 'Account': 'Аккаунт', 'Favorites': 'Избранное', 'Reviews': 'Отзывы',
  'Keep learning': 'Продолжайте учиться', 'Find your next skill': 'Найдите новый навык',
  'Explore practical courses in design, automation and no-code development.': 'Изучайте практические курсы по дизайну, автоматизации и разработке без кода.',
  'Your cart': 'Ваша корзина', 'Your favorites': 'Избранное', 'Your learning account': 'Ваш учебный аккаунт',
  'Course reviews': 'Отзывы о курсах', 'Administration': 'Управление',
  'Register, sign in and view your purchase history.': 'Зарегистрируйтесь, войдите и просматривайте историю покупок.',
  'Tell other learners what you learned.': 'Расскажите другим студентам, чему вы научились.',
  'Manage the course catalog and moderate customer reviews.': 'Управляйте каталогом курсов и проверяйте отзывы.',
  'Your cart is empty': 'Ваша корзина пуста', 'No favorites yet': 'Пока нет избранного',
  'Create an account': 'Создать аккаунт', 'Sign in': 'Войти', 'Sign out': 'Выйти', 'Register': 'Зарегистрироваться',
  'Your purchases': 'Ваши покупки', 'Review a purchased course': 'Оставить отзыв о купленном курсе',
  'Search courses': 'Поиск курсов', 'Sort by': 'Сортировка', 'Level': 'Уровень', 'Minimum rating': 'Минимальный рейтинг',
  'Price from ($)': 'Цена от ($)', 'Price to ($)': 'Цена до ($)', 'Duration from (hours)': 'Длительность от (ч)', 'Duration to (hours)': 'Длительность до (ч)',
  'Original order': 'Исходный порядок', 'Price: low to high': 'Цена: по возрастанию', 'Price: high to low': 'Цена: по убыванию',
  'Title: A to Z': 'Название: А—Я', 'Rating: highest first': 'Сначала высокий рейтинг',
  'Title, description or category': 'Название, описание или категория', 'All levels': 'Все уровни', 'Beginner': 'Начальный', 'Intermediate': 'Средний', 'Advanced': 'Продвинутый',
  'Any rating': 'Любой рейтинг', '4.5 and above': 'От 4,5', 'Try again': 'Повторить', 'Any': 'Любая',
  'Design': 'Дизайн', 'Automation': 'Автоматизация', 'Marketing': 'Маркетинг', 'App building': 'Разработка приложений', 'Reset all': 'Сбросить всё', 'No courses found': 'Курсы не найдены', 'Previous': 'Назад', 'Next': 'Далее', 'Per page': 'На странице',
  'Complete purchase': 'Оформить покупку', 'First name *': 'Имя *', 'Last name *': 'Фамилия *', 'Middle name (optional)': 'Отчество (необязательно)',
  'Date of birth *': 'Дата рождения *', 'Belarus phone *': 'Телефон Беларуси *', 'Email *': 'Эл. почта *',
  'Create password *': 'Создать пароль *', 'Password *': 'Пароль *', 'Choose myself': 'Придумать самостоятельно',
  'Generate automatically': 'Сгенерировать автоматически', 'Generate another password': 'Сгенерировать другой пароль',
  'Show password': 'Показать пароль', 'Hide password': 'Скрыть пароль', 'Repeat password without pasting *': 'Повторите пароль без вставки *',
  'I have saved my generated password *': 'Я сохранил(а) сгенерированный пароль *', 'Nickname *': 'Никнейм *',
  'Generate nickname': 'Сгенерировать никнейм', 'Read the user agreement *': 'Прочитать пользовательское соглашение *',
  'I have read and accept the agreement *': 'Я прочитал(а) и принимаю соглашение *',
  'Share your experience': 'Поделитесь впечатлениями', 'Purchased course *': 'Купленный курс *',
  'Select a course': 'Выберите курс', 'Your review *': 'Ваш отзыв *', 'Send review': 'Отправить отзыв',
  'Your reviews': 'Ваши отзывы', 'Go to your account': 'Перейти в аккаунт',
  'Manage courses': 'Управлять курсами', 'Course': 'Курс', 'Add a new course': 'Добавить курс',
  'Title *': 'Название *', 'Category *': 'Категория *', 'Description *': 'Описание *',
  'Price ($) *': 'Цена ($) *', 'Duration (hours) *': 'Длительность (ч) *', 'Rating *': 'Рейтинг *',
  'Level *': 'Уровень *', 'Select a level': 'Выберите уровень', 'Image path or HTTPS URL *': 'Путь к изображению или HTTPS-ссылка *',
  'Add course': 'Добавить курс', 'Delete selected course': 'Удалить выбранный курс', 'Moderate reviews': 'Проверка отзывов',
  'By course': 'По курсу', 'By user': 'По пользователю', 'All courses': 'Все курсы', 'All users': 'Все пользователи',
  'Refresh reviews': 'Обновить отзывы', 'Required fields are marked *. Use fictitious data for this local laboratory.': 'Обязательные поля отмечены *. Используйте вымышленные данные для этой локальной работы.',
  'Only purchased courses are available. Required fields are marked *.': 'Доступны только купленные курсы. Обязательные поля отмечены *.',
  'Guest — sign in to save courses and buy.': 'Гость — войдите, чтобы сохранять и покупать курсы.',
  'No purchases yet. Explore the course catalog to get started.': 'Покупок пока нет. Загляните в каталог курсов.',
  'Loading purchases…': 'Загрузка покупок…',
  'The most popular courses': 'Самые популярные курсы', 'Get started': 'Начать', 'Enroll Course': 'Записаться',
  'Read more': 'Читать далее', 'Explore Learnico': 'Откройте Learnico', 'See learning in motion': 'Обучение в движении',
  'Browse featured stories or try the interactive media gallery.': 'Смотрите истории и попробуйте интерактивную галерею.',
  'Learn at your pace': 'Учитесь в своём темпе', 'Build practical skills through focused lessons.': 'Получайте практические навыки на тематических занятиях.',
  'Make your ideas real': 'Воплощайте идеи', 'Explore web design and no-code projects.': 'Изучайте веб-дизайн и проекты без кода.',
  'Grow together': 'Растите вместе', 'Share progress with an active learning community.': 'Делитесь успехами с учебным сообществом.',
  'Surprise me': 'Удивить меня', 'Hear sound': 'Включить звук', 'Play': 'Воспроизвести', 'Pause': 'Пауза',
  'A closer look': 'Подробнее', 'Preview a Learnico lesson': 'Предпросмотр урока Learnico',
  'Find us': 'Где мы', 'Learnico in Minsk': 'Learnico в Минске', 'Explore the city around our learning community.': 'Познакомьтесь с городом нашего учебного сообщества.',
  'Create Award Winning Websites In Webflow': 'Создавайте выдающиеся сайты в Webflow',
  'Become an No-Code expert and find a job': 'Станьте экспертом по разработке без кода и найдите работу',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel molestie magna curabitur tincidunt nunc sit amet.': 'Изучайте современные инструменты дизайна и разработки с практическими заданиями.',
  'Explore Courses': 'Смотреть курсы', 'Watch Video': 'Смотреть видео', 'From 3k+ reviews': 'Более 3000 отзывов',
  "Trusted by the world's best companies": 'Нам доверяют ведущие компании мира',
  'About us': 'О нас', 'No-code Education Platform': 'Образовательная платформа разработки без кода',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.': 'Учитесь создавать сайты и цифровые проекты на практике. Выберите подходящий курс и развивайте навыки в своём темпе.',
  'Premium courses from the industry leaders': 'Премиальные курсы от лидеров отрасли',
  'Learn more': 'Узнать больше', 'Easily find the perfect course for you': 'Легко найдите подходящий курс',
  'Trending': 'Популярное',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.': 'Выбирайте интересные программы и получайте новые навыки вместе с нами.',
  'Webflow Basics': 'Основы Webflow', 'Webflow Interactions': 'Интерактивность в Webflow', 'Advanced CMS': 'Продвинутая работа с CMS', 'Figma Foundations': 'Основы Figma', 'Design Systems': 'Дизайн-системы', 'Mobile UX': 'Мобильный UX', 'Zapier Essentials': 'Основы Zapier', 'Make Workflows': 'Сценарии автоматизации в Make',
  'Airtable Projects': 'Проекты в Airtable', 'SEO for Creators': 'SEO для авторов', 'Content Strategy': 'Контент-стратегия', 'Email Campaigns': 'Email-кампании', 'Bubble Foundations': 'Основы Bubble', 'Glide Apps': 'Приложения в Glide', 'No-code MVP': 'No-code MVP', 'Webflow Interactions Masterclass': 'Мастер-класс по интерактивности Webflow',
  'Build your first responsive website without writing code.':
    'Создайте свой первый адаптивный сайт без написания кода.',
  'Create transitions and engaging scroll animations.':
    'Создавайте переходы и эффектные анимации при прокрутке.',
  'Deign collections and dynamic content in Webflow.':
    'Создавайте коллекции и динамический контент в Webflow.',
  'Learn frames, components and collaborative interface design.':
    'Изучите фреймы, компоненты и совместную работу над интерфейсами.',
  'Create reusable components and consistent visual guidelines.':
    'Создавайте повторно используемые компоненты и единые правила оформления.',
  'Design accessible mobile journeys and test prototypes.':
    'Проектируйте доступные мобильные интерфейсы и тестируйте прототипы.',
  'Connect everyday tools and automate repetitive tasks.':
    'Связывайте привычные сервисы и автоматизируйте повторяющиеся задачи.',
  'Build visual automation scenarios with filters and routers.':
    'Создавайте визуальные сценарии автоматизации с фильтрами и маршрутизаторами.',
  'Organize project data and create automated team dashboards.':
    'Организуйте данные проектов и создавайте автоматизированные командные панели.',
  'Improve website structure and help people discover your work.':
    'Улучшайте структуру сайта и помогайте пользователям находить ваши материалы.',
  'Plan useful content around customer needs and clear goals.':
    'Планируйте полезный контент с учётом потребностей аудитории и целей.',
  'Create email sequences and measure campaign performance.':
    'Создавайте цепочки писем и оценивайте эффективность кампаний.',
  'Launch a no-code application with users and a database.':
    'Создайте no-code приложение с пользователями и базой данных.',
  'Turn spreadsheets into practical mobile applications.':
    'Превращайте таблицы в удобные мобильные приложения.',
  'Prototype, validate and launch a product for real users.':
    'Создайте прототип, проверьте идею и запустите продукт для реальных пользователей.', 'Advanced CMS and Integrations': 'Продвинутые CMS и интеграции', 'Join us': 'Присоединяйтесь',
  'The maximum must be greater than or equal to the minimum.':
    'Максимальное значение должно быть не меньше минимального.',
  'Item removed.': 'Элемент удалён.',
  'Quantity updated.': 'Количество изменено.',
  'Purchase saved to your order history. Your cart is now empty. No payment was charged.':
    'Покупка сохранена в истории заказов. Корзина очищена. Реальная оплата не выполнялась.',
  'Wait until the current operation finishes.':
    'Дождитесь завершения текущей операции.',
  'Select a course and confirm its deletion.':
    'Выберите курс и подтвердите его удаление.',
  'Confirm review deletion':
    'Подтвердить удаление отзыва',
  'Email or password is incorrect.':
    'Неверный email или пароль.',
  'Sign in to continue.':
    'Войдите, чтобы продолжить.',
  'Select an existing course.':
    'Выберите существующий курс.',
  'Item not found.':
    'Элемент не найден.',
  'A course is no longer available. Remove it from your cart.':
    'Курс больше недоступен. Удалите его из корзины.',
  'You can review only a course you have purchased.':
    'Отзыв можно оставить только о купленном курсе.',
  'Review not found.':
    'Отзыв не найден.',
  'Course not found.':
    'Курс не найден.',
  'Not found.':
    'Страница не найдена.',
  'The server could not complete the request. Please try again.':
    'Сервер не смог выполнить запрос. Повторите попытку.',
  'Loading Learnico…':
    'Загрузка Learnico…',
  'Loading page':
    'Загрузка страницы',
  'Open menu':
    'Открыть меню',
  'Close menu':
    'Закрыть меню',
  'Close course details':
    'Закрыть информацию о курсе',
  'Language and theme':
    'Язык и тема', 'Join more than 17,000+ students all over the world': 'Присоединяйтесь к более чем 17 000 студентов по всему миру',
  'Browse our courses': 'Просматривайте курсы', 'Purchase quickly and securely': 'Покупайте быстро и безопасно',
  'Start learning right away': 'Начинайте учиться сразу', 'Benefits': 'Преимущества',
  'Grow your knowledge from best teachers in the industry': 'Учитесь у лучших преподавателей отрасли',
  'Over 430+ hours of lessons': 'Более 430 часов уроков', '40+ teachers': 'Более 40 преподавателей',
  'Online community': 'Онлайн-сообщество', '1-on-1 coaching': 'Индивидуальные занятия',
  'Testimonials': 'Отзывы студентов', 'What our students say': 'Что говорят наши студенты',
  'Our latest posts': 'Последние статьи', 'View all': 'Смотреть все', 'Freelance': 'Фриланс',
  '7 freelance mistakes to avoid': '7 ошибок фрилансера, которых стоит избегать',
  'UI/UX Design': 'UI/UX-дизайн', 'Brand design process explained': 'Как устроен процесс дизайна бренда',
  'Business': 'Бизнес', 'The beginner’s guide to recruiting a Webflow developer': 'Как новичку найти разработчика Webflow',
  'Start learning today': 'Начните учиться сегодня', 'Contact us': 'Связаться с нами',
  'Students worldwide': 'Студентов по всему миру', 'Courses to discover': 'Доступных курсов',
  'Learning satisfaction': 'Довольных обучением',
  'Press the image to create and play a short local preview. The result opens in the native HTML5 video player.': 'Нажмите на изображение, чтобы создать и воспроизвести короткий предпросмотр в видеоплеере.',
  'Join our newsletter to stay up to date on features and releases.': 'Подпишитесь на новости, чтобы узнавать о новых возможностях и обновлениях.',
  'Email address': 'Адрес электронной почты', 'Subscribe': 'Подписаться',
  'By subscribing you agree to with our': 'Подписываясь, вы соглашаетесь с нашей',
  'Privacy Policy': 'Политикой конфиденциальности',
  'and provide consent to receive updates from our company.': 'и даёте согласие получать новости компании.',
  'Pages': 'Страницы', 'Teachers': 'Преподаватели', 'CMS Pages': 'Страницы CMS',
  'Blog Post': 'Статья блога', 'Blog Categories': 'Категории блога',
  'Courses Single': 'Страница курса', 'Courses Categories': 'Категории курсов',
  'Product Page': 'Страница продукта', 'Product Categories': 'Категории продуктов',
  'Teachers Single': 'Страница преподавателя', 'Episode Single': 'Страница урока',
  'Account Pages': 'Страницы аккаунта', 'Login': 'Вход', 'Sign Up': 'Регистрация',
  'Forgot Password': 'Забыли пароль', 'Reset Password': 'Сброс пароля',
  'Email Confirmation': 'Подтверждение почты', 'Utility Pages': 'Служебные страницы',
  'Style Guide': 'Гид по стилю', 'Changelog': 'История изменений',
  'Licenses': 'Лицензии', 'Password': 'Пароль',
  'Settings reset.': 'Настройки сброшены.', 'Profile saved.': 'Профиль сохранён.',
  'Update your personal information. Your password is never shown here.': 'Измените личные данные. Пароль здесь не отображается.',
  'Skip to catalog': 'Перейти к каталогу', 'Skip to favorites': 'Перейти к избранному', 'Skip to cart': 'Перейти к корзине',
  'Skip to content': 'Перейти к содержимому', 'Back to home': 'На главную',
  '4.8 and above': 'От 4,8', '5.0 only': 'Только 5,0', 'Categories': 'Категории',
  '(none selected means all)': '(ничего не выбрано — все)', 'Try another search or use Reset all.': 'Измените поиск или сбросьте фильтры.',
  'Enable JavaScript to load the catalog.': 'Включите JavaScript для загрузки каталога.',
  'Enable JavaScript to load your favorites.': 'Включите JavaScript для загрузки избранного.',
  'Enable JavaScript to load your cart.': 'Включите JavaScript для загрузки корзины.',
  'Enable JavaScript to use these forms.': 'Включите JavaScript для работы с формами.',
  'Learnico · Build skills at your own pace.': 'Learnico · Развивайте навыки в своём темпе.',
  'Save the courses you want to explore next.': 'Сохраняйте курсы, которые хотите изучить позже.',
  'Explore courses': 'Смотреть курсы', 'Explore the catalog to add your first course.': 'Откройте каталог и добавьте первый курс.',
  'Review your courses and choose the number of learning seats.': 'Проверьте курсы и выберите количество учебных мест.',
  'Total:': 'Итого:', 'This is a demo checkout. No payment details or real payment are required.': 'Это демонстрационная покупка. Платёжные данные и реальная оплата не требуются.',
  '8–20 characters: uppercase and lowercase Latin letters, a digit and a special character. Common passwords from the 2024 list are blocked.': '8–20 символов: заглавные и строчные латинские буквы, цифра и специальный символ. Распространённые пароли запрещены.',
  'Enter your first and last name. After 5 generations, you can edit the nickname.': 'Введите имя и фамилию. После пяти генераций никнейм можно изменить вручную.',
  'Learnico laboratory agreement': 'Учебное соглашение Learnico',
  'Version 2026-09. This is an educational local website demonstrating forms and server requests, not a real commercial service.': 'Версия 2026-09. Это локальный учебный сайт для демонстрации форм и серверных запросов, а не настоящий коммерческий сервис.',
  'Use fictitious names, a test email and a test Belarus phone number. Do not enter your real personal data or reuse a password from another account.': 'Используйте вымышленные имена, тестовую почту и белорусский номер телефона. Не вводите реальные персональные данные и не используйте пароль от другого аккаунта.',
  'Registration is available to people aged 16 or older. Choose an appropriate nickname and keep your demonstration credentials available while testing the application.': 'Регистрация доступна людям от 16 лет. Выберите подходящий никнейм и сохраните тестовые учётные данные.',
  'Courses, prices, purchases and orders are demonstration data. Completing checkout records a test order and clears the cart. It does not process a payment or provide a real paid course.': 'Курсы, цены, покупки и заказы — демонстрационные данные. Оформление создаёт тестовый заказ и очищает корзину, но не проводит оплату.',
  'Reviews must describe a course purchased by the same account. Write at least 20 characters, stay respectful and do not include personal or confidential information.': 'Отзывы должны относиться к курсу, купленному с этого аккаунта. Напишите не менее 20 символов, соблюдайте уважительный тон и не раскрывайте личные данные.',
  'Administrators manage the demonstration catalog and moderate reviews. They cannot post customer reviews. Course changes do not change the price recorded in an existing order.': 'Администраторы управляют демонстрационным каталогом и проверяют отзывы. Они не могут оставлять отзывы клиентов. Изменение курса не меняет цену уже созданного заказа.',
  'Your demonstration information is stored in the local JSON database. The project owner can inspect or reset this local data. The application is not intended for public deployment.': 'Демонстрационные данные хранятся в локальной JSON-базе. Владелец проекта может просмотреть или сбросить их. Сайт не предназначен для публикации.',
  'End of agreement. You may now confirm that you have read and accept these demonstration conditions.': 'Конец соглашения. Теперь вы можете подтвердить, что прочитали и принимаете эти условия.',
  'Open the agreement and read to the end to enable this checkbox.': 'Откройте соглашение и дочитайте до конца, чтобы активировать флажок.',
  '20–2000 characters, excluding leading and trailing spaces.': '20–2000 символов без начальных и конечных пробелов.',
  'Required fields are marked *. Choose an existing course to edit or delete it.': 'Обязательные поля отмечены *. Выберите курс для изменения или удаления.',
  'I confirm deletion of the selected course *': 'Подтверждаю удаление выбранного курса *',
  'Learnico — No-code Education Platform': 'Learnico — обучение разработке без кода',
  'Course catalog — Learnico': 'Каталог курсов — Learnico',
  'Your favorites — Learnico': 'Избранное — Learnico', 'Your cart — Learnico': 'Корзина — Learnico',
  'Your learning account — Learnico': 'Аккаунт — Learnico',
  'Course reviews — Learnico': 'Отзывы о курсах — Learnico',
  'Administration — Learnico': 'Управление — Learnico',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique duis cursus mi quis viverra ornare.': 'Практические занятия помогают начать обучение и постепенно развивать новые навыки.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.': 'Знания можно применять сразу после урока.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.': 'Студенты делятся впечатлениями об обучении.',
  '“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.”': '«Мне понравились понятные уроки и практические задания. Теперь я увереннее работаю над собственными проектами».',
  'Junior UI Designer, @Company': 'Младший UI-дизайнер, @Company',
  'Design System Manager, @Company': 'Руководитель дизайн-системы, @Company',
  'UX Designer, @Company': 'UX-дизайнер, @Company',
  '© Learnico by Minimal Square. Powered by Webflow.': '© Learnico от Minimal Square. Создано на Webflow.',
  'No pages': 'Нет страниц', 'Loading courses…': 'Загрузка курсов…', 'Save favorite': 'В избранное',
  'Saved': 'Сохранено', 'Add to cart': 'В корзину', 'Could not load courses.': 'Не удалось загрузить курсы.',
  'Check the numeric ranges: the minimum cannot exceed the maximum.': 'Проверьте диапазоны: минимум не может превышать максимум.',
  'Preparing a short local video…': 'Подготовка короткого видео…',
  'Video recording is not supported in this browser.': 'Браузер не поддерживает запись видео.',
  'Use the video controls to replay or pause.': 'Используйте управление плеера для повтора или паузы.',
  'Account created. You are signed in.': 'Аккаунт создан. Вы вошли.', 'Signed in.': 'Вы вошли.',
  'This nickname is already taken.': 'Этот никнейм уже занят.',
  'Enter your first and last name first.': 'Сначала введите имя и фамилию.',
  'Five generations used. You may now edit the nickname yourself.': 'Пять попыток использованы. Теперь никнейм можно изменить вручную.',
  'Type the confirmation yourself; pasting is disabled by the assignment.': 'Введите подтверждение вручную; вставка отключена по условию задания.',
  'You have reached the end. Confirm your acceptance above.': 'Вы дочитали до конца. Подтвердите согласие выше.',
  'Cannot connect to the server. Run npm run server in lab-10, then try again.': 'Не удаётся подключиться к серверу. Запустите npm run server в lab-10 и повторите попытку.',
  'Sign in on the Account page to continue.': 'Войдите на странице аккаунта, чтобы продолжить.',
  'The maximum quantity per course is 99.': 'Максимум 99 мест на один курс.',
  'Administrator access required.': 'Требуется доступ администратора.',
  'Administrators cannot submit reviews.': 'Администраторы не могут оставлять отзывы.',
  'Course unavailable': 'Курс недоступен', 'Remove': 'Удалить', 'Quantity': 'Количество',
  'Quantity must be a whole number from 1 to 99.': 'Количество должно быть целым числом от 1 до 99.',
  'Loading…': 'Загрузка…', 'Could not load items.': 'Не удалось загрузить данные.',
  'You have not posted any reviews yet.': 'Вы ещё не оставляли отзывов.',
  'Your review has been saved.': 'Ваш отзыв сохранён.',
  'Buy a course first to unlock its review form.': 'Сначала купите курс, чтобы оставить отзыв.',
  'Details': 'Подробнее', 'Course updated.': 'Курс изменён.', 'Course added.': 'Курс добавлен.',
  'Course deleted. Existing orders keep their purchase details.': 'Курс удалён. Существующие заказы сохраняют данные покупки.',
  'Loading reviews…': 'Загрузка отзывов…', 'No reviews match these filters.': 'Нет отзывов по этим фильтрам.',
  'Delete review': 'Удалить отзыв', 'Review deleted.': 'Отзыв удалён.',
  'Check the highlighted fields.': 'Проверьте выделенные поля.',
  'This email is already registered.': 'Эта почта уже зарегистрирована.',
  'This phone number is already registered.': 'Этот телефон уже зарегистрирован.',
  'Use letters, spaces, hyphens or apostrophes (up to 60 characters).': 'Используйте буквы, пробелы, дефисы или апострофы (до 60 символов).',
  'Enter a Belarus number, for example +375 29 123-45-67.': 'Введите белорусский номер, например +375 29 123-45-67.',
  'Enter a valid email address.': 'Введите корректный адрес электронной почты.',
  'You must be at least 16 years old; enter a valid birth date.': 'Вам должно быть не менее 16 лет; введите корректную дату рождения.',
  'Use 3–30 letters, digits, underscores or hyphens.': 'Используйте 3–30 букв, цифр, подчёркиваний или дефисов.',
  'Use 8–20 characters, an uppercase and lowercase Latin letter, a digit and a special character; no spaces.': 'Используйте 8–20 символов: заглавную и строчную латинские буквы, цифру и спецсимвол; без пробелов.',
  'This password is in the 2024 TOP-100 list.': 'Этот пароль входит в список 100 самых распространённых паролей 2024 года.',
  'Choose how to create your password.': 'Выберите способ создания пароля.',
  'Passwords must match. Type the confirmation yourself.': 'Пароли должны совпадать. Введите подтверждение вручную.',
  'Read and accept the user agreement.': 'Прочитайте и примите пользовательское соглашение.',
  'Select a purchased course.': 'Выберите купленный курс.',
  'Write between 20 and 2000 characters.': 'Напишите от 20 до 2000 символов.',
  'Light theme': 'Светлая тема', 'Dark theme': 'Тёмная тема', 'Profile': 'Профиль', 'Save changes': 'Сохранить изменения',
  'Reset settings': 'Сбросить настройки', 'Close': 'Закрыть', 'Language': 'Язык', 'Theme': 'Тема'
};

let language = localStorage.getItem(languageKey) === 'ru' ? 'ru' : 'en';
let theme = localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light';
const originals = new WeakMap();
const translated = new WeakMap();
const originalTitle = document.title;
let scheduled = false;

function translateDynamic(phrase) {
  let match;
  if ((match = phrase.match(/^Signed in as (.+)$/))) return 'Вы вошли как ' + match[1];
  if ((match = phrase.match(/^Page (\d+) of (\d+)$/))) return 'Страница ' + match[1] + ' из ' + match[2];
  if ((match = phrase.match(/^(\d+) courses found · (\d+) shown$/))) return 'Найдено курсов: ' + match[1] + ' · показано: ' + match[2];
  if ((match = phrase.match(/^(\d+) items?$/))) return 'Товаров: ' + match[1];
  if ((match = phrase.match(/^Subtotal: (.+)$/))) return 'Сумма: ' + match[1];
  if ((match = phrase.match(/^Order · (.+)$/))) return 'Заказ · ' + match[1];
  if ((match = phrase.match(/^Generation (\d+) of 5\.$/))) return 'Генерация ' + match[1] + ' из 5.';
  if ((match = phrase.match(/^(\d+) reviews found$/))) return 'Найдено отзывов: ' + match[1];
  if ((match = phrase.match(/^By (.+)$/))) return 'Автор: ' + match[1];
  if ((match = phrase.match(/^(.+) added to cart\.$/))) return (translations[match[1]] || match[1]) + ' добавлен в корзину.';
  if ((match = phrase.match(/^(.+) · (\d+) hours · Rating (.+)$/))) return (translations[match[1]] || match[1]) + ' · ' + match[2] + ' ч · Рейтинг ' + match[3];
  if ((match = phrase.match(/^(.+) saved to favorites\.$/))) {return (translations[match[1]] || match[1]) + ' добавлен в избранное.';}
  if ((match = phrase.match(/^(.+) added to cart\.$/))) {return (translations[match[1]] || match[1]) + ' добавлен в корзину.';}
  if ((match = phrase.match(/^(.+) × (\d+)$/))) {return (translations[match[1]] || match[1]) + ' × ' + match[2];}
  if ((match = phrase.match(/^Quantity for (.+)$/))) {return 'Количество для курса «' +(translations[match[1]] || match[1]) +'»';}if ((match = phrase.match(/^Course #(\d+)$/))) {return 'Курс №' + match[1];}
  if ((match = phrase.match(/^Deleted course #(\d+)$/))) {return 'Удалённый курс №' + match[1];}
  return '';
}

function translateNode(node) {
  const value = node.nodeValue;
  if (!value?.trim() || node.parentElement?.closest('script, style, textarea, [data-no-translate]')) return;
  if (value !== translated.get(node)) originals.set(node, value);
  const original = originals.get(node);
  const phrase = original.trim();
  const normalizedPhrase = phrase.replace(/\s+/g, ' ');
  const target = language === 'ru' ? (translations[normalizedPhrase] || translateDynamic(normalizedPhrase)) : phrase;
  if (!target) return;
  const next = original.replace(phrase, target);
  if (next !== value) node.nodeValue = next;
  translated.set(node, next);
}

function translateAll() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) translateNode(walker.currentNode);
  for (const element of document.querySelectorAll('[placeholder], [aria-label]')) {
    for (const attribute of ['placeholder', 'aria-label']) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const originalKey = 'original' + attribute.replace('-', '');
      if (!element.dataset[originalKey]) element.dataset[originalKey] = value;
      const source = element.dataset[originalKey];
      element.setAttribute(attribute, language === 'ru' ? translations[source] || translateDynamic(source) || source : source);
    }
  }
  document.title = language === 'ru' ? translations[originalTitle] || originalTitle : originalTitle;
  document.documentElement.lang = language;
  document.documentElement.dataset.theme = theme;
  for (const button of document.querySelectorAll('[data-language]')) button.setAttribute('aria-pressed', String(button.dataset.language === language));
  for (const button of document.querySelectorAll('[data-theme-toggle]')) {
    const name = theme === 'dark' ? 'Light theme' : 'Dark theme';
    const label = language === 'ru' ? translations[name] : name;
    if (button.textContent !== label) button.textContent = label;
    button.setAttribute('aria-label', label);
  }
}

export function setLanguage(value) {
  language = value === 'ru' ? 'ru' : 'en';
  localStorage.setItem(languageKey, language);
  translateAll();
}

export function setTheme(value) {
  theme = value === 'dark' ? 'dark' : 'light';
  localStorage.setItem(themeKey, theme);
  translateAll();
}

export function resetSettings() {
  localStorage.removeItem(languageKey);
  localStorage.removeItem(themeKey);
  language = 'en';
  theme = 'light';
  translateAll();
}

export function getLanguage() { return language; }
export function getTheme() { return theme; }

export function initPreferences() {
  translateAll();
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; translateAll(); });
  }).observe(document.body, { subtree: true, childList: true, characterData: true });
  window.addEventListener('storage', event => {
    if (![languageKey, themeKey].includes(event.key)) return;
    language = localStorage.getItem(languageKey) === 'ru' ? 'ru' : 'en';
    theme = localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light';
    translateAll();
  });
}
