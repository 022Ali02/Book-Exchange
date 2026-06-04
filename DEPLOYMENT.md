# Деплой на Render.com

## Подготовка проекта ✅

Все файлы конфигурации созданы:
- ✅ `render.yaml` - автоматическая конфигурация
- ✅ `backend/src/config/database.js` - поддержка DATABASE_URL
- ✅ `src/config/api.ts` - конфигурация API для frontend

## Шаги для развертывания

### 1. Подготовка репозитория

```bash
# Добавьте все изменения
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Создание аккаунта на Render

1. Перейдите на [render.com](https://render.com)
2. Нажмите **Sign Up**
3. Выберите **Sign up with GitHub**
4. Авторизуйте Render доступ к вашим репозиториям

### 3. Создание Blueprint (автоматический деплой)

1. На dashboard нажмите **New** → **Blueprint**
2. Выберите ваш репозиторий `Book Exchange Platform Design`
3. Render автоматически найдет `render.yaml` и создаст:
   - **bookswap-backend** - Backend API (Node.js)
   - **bookswap-frontend** - Frontend (Static site)
   - **bookswap-db** - PostgreSQL база данных

4. Нажмите **Apply**

### 4. Настройка переменных окружения (автоматически)

Render автоматически настроит:
- `DATABASE_URL` - строка подключения к PostgreSQL
- `JWT_SECRET` - автоматически сгенерированный секрет
- `VITE_API_URL` - ссылка на backend

### 5. Получение публичной ссылки

После завершения деплоя (5-10 минут):

**Frontend:** `https://bookswap-frontend.onrender.com`  
**Backend API:** `https://bookswap-backend.onrender.com`

## Важно знать о бесплатном плане

⚠️ **Ограничения Free tier:**
- Сервис "засыпает" после 15 минут неактивности
- Первый запрос после сна займет ~30-50 секунд
- 750 часов работы в месяц (достаточно для одного сервиса 24/7)
- PostgreSQL база: 1GB, автоматическое удаление через 90 дней

💡 **Решение проблемы "засыпания":**
- Используйте сервис типа [cron-job.org](https://cron-job.org) для ping каждые 10 минут
- Или апгрейд на Starter план ($7/месяц) для постоянной работы

## Альтернативные платформы (если нужно)

1. **Railway.app** - $5 бесплатно/месяц, потом по факту
2. **Fly.io** - 3 маленьких VM бесплатно
3. **Vercel (frontend) + Railway (backend)** - комбо подход

## Мониторинг

После деплоя вы можете:
- Смотреть логи в реальном времени
- Настроить автоматические деплои при push в main
- Добавить custom domain (бесплатно)

## Проблемы?

Если что-то не работает:
1. Проверьте логи в Render Dashboard
2. Убедитесь что все environment variables установлены
3. Проверьте статус базы данных
