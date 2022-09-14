# Инструкция для запуска задачки

В репозитории содержатся два отдельных файла для запуска. 
Первый - [packages/api/index.ts](./packages/api/index.ts), 
и второй - [packages/storage/index.ts](./packages/storage/index.ts).
По названию можно понять,
каким задачам они соответствуют.

## Подготовка к запуску

Для того, чтобы программа работала, надо убедиться в соедующем:
1) Сервер NATS запущен на `localhost:4222`
2) Сервер Postgres запущен на `localhost:5432`

В принципе, не так проблематично поменять эти параметры.
Данные базы данных объявляются в файле
[packages/storage/repository/data-source](./packages/storage/repository/data-source.ts),
данные сервера NATS - [packages/common/index.ts](./packages/common/index.ts) в функции
`connect2Nats`. Следующие параметры базы данных необходимо настроить в любом случае:
1. Имя БД
2. Имя пользователя
3. Пароль

В настройках модели поле `synchronize` переключено на `true`,
поэтому создавать таблицу нет надобности, ровно как и наполнять её
dummy значениями, это выполняется в конструкторе обёрточного класса.

## Запуск

После запуска сервера БД и NATS можно запустить приложение.
В одном окне консоли запустите микросервис `api` командой
`npm run api`. В другом окне запустите микросервис `storage`
командой `npm run storage`. При отправке GET запроса на `http://localhost:8080/api/test`
сервис опубликует в NATS сообщение `storage.api.request.find`, в теле которого находятся
данные для поиска в БД.
Сервис `storage`, подключившись к NATS при запуске, получит это
сообщение и сделает запрос в базу данных. В окне терминала, где он был запущен,
должнен отобразиться результат запроса.

## Остановка

Можно остановить оба сервиса командами `Ctrl+C`, однако я также
сделал возможным (для удобства при разработке) остановить их,
отправив по-отдельности POST запросы по адресам `http://localhost:8080/api/stop-debug`
и `http://localhost:8090/stop-debug`