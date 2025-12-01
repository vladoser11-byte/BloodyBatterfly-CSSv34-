// Основной класс приложения
class BloodyButterflyApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createSnow();
        this.startCountdown();
        this.setupModals();
        this.setupNotifications();
        this.setupCookieNotice();
        this.setupPasswordValidation();
        this.setupBonusSystem();
        this.setupSantaInteraction();
        this.setupMobileMenu();
    }

    // Создание снега
    createSnow() {
        const snowContainer = document.querySelector('.snow-container');
        const snowCount = 200;
        
        for (let i = 0; i < snowCount; i++) {
            setTimeout(() => {
                const snow = document.createElement('div');
                snow.classList.add('snow');
                
                const size = Math.random() * 8 + 4;
                snow.style.width = `${size}px`;
                snow.style.height = `${size}px`;
                snow.style.left = `${Math.random() * 100}vw`;
                snow.style.animationDuration = `${Math.random() * 15 + 10}s`;
                snow.style.animationDelay = `${Math.random() * 10}s`;
                
                snowContainer.appendChild(snow);
            }, i * 100);
        }
    }

    // Счетчик до Нового года
    startCountdown() {
        const update = () => {
            const now = new Date();
            const newYear = new Date(2026, 0, 1);
            const diff = newYear - now;
            
            if (diff <= 0) {
                document.getElementById('days').textContent = '0';
                document.getElementById('hours').textContent = '0';
                document.getElementById('minutes').textContent = '0';
                document.getElementById('seconds').textContent = '0';
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            
            // Обновление прогресс-бара
            const totalDays = 365;
            const daysPassed = totalDays - days;
            const progress = (daysPassed / totalDays) * 100;
            document.getElementById('progress').style.width = `${progress}%`;
        };
        
        update();
        setInterval(update, 1000);
    }

    // Настройка модальных окон
    setupModals() {
        const modals = {
            'login-modal': '.btn-login',
            'register-modal': '.btn-register'
        };

        // Открытие модальных окон
        Object.entries(modals).forEach(([modalId, triggerSelector]) => {
            const triggers = document.querySelectorAll(triggerSelector);
            const modal = document.getElementById(modalId);
            
            triggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal(modal);
                });
            });
        });

        // Закрытие модальных окон
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Закрытие при клике вне модального окна
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Переключение между окнами входа и регистрации
        document.querySelector('.switch-to-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal(document.getElementById('login-modal'));
            this.openModal(document.getElementById('register-modal'));
        });

        document.querySelector('.switch-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal(document.getElementById('register-modal'));
            this.openModal(document.getElementById('login-modal'));
        });

        // Обработка форм
        this.setupForms();
    }

    // Открытие модального окна
    openModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Закрытие модального окна
    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Настройка форм
    setupForms() {
        // Форма входа
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Форма регистрации
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    // Обработка входа
    async handleLogin() {
        const form = document.getElementById('login-form');
        const button = form.querySelector('button[type="submit"]');
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Валидация
        if (!this.validateLogin(username, password)) {
            return;
        }

        // Симуляция запроса
        this.setButtonLoading(button, true);
        
        try {
            await this.simulateRequest(1500);
            
            if (this.isValidCredentials(username, password)) {
                this.showNotification('Успешный вход!', `Добро пожаловать, ${username}!`, 'success');
                this.closeModal(document.getElementById('login-modal'));
                this.updateUserStatus(username);
            } else {
                this.showNotification('Ошибка входа', 'Неверный логин или пароль', 'error');
            }
        } catch (error) {
            this.showNotification('Ошибка', 'Произошла ошибка при входе', 'error');
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    // Обработка регистрации
    async handleRegister() {
        const form = document.getElementById('register-form');
        const button = form.querySelector('button[type="submit"]');
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        // Валидация
        if (!this.validateRegistration(username, email, password, confirmPassword)) {
            return;
        }

        // Симуляция запроса
        this.setButtonLoading(button, true);
        
        try {
            await this.simulateRequest(2000);
            
            this.showNotification(
                'Регистрация успешна!', 
                `На почту ${email} отправлен код подтверждения`, 
                'success'
            );
            
            this.closeModal(document.getElementById('register-modal'));
            
            // Симуляция отправки email
            this.simulateEmailConfirmation(email, username);
            
        } catch (error) {
            this.showNotification('Ошибка', 'Произошла ошибка при регистрации', 'error');
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    // Валидация входа
    validateLogin(username, password) {
        if (!username.trim()) {
            this.showNotification('Ошибка', 'Введите никнейм', 'error');
            return false;
        }

        if (!password) {
            this.showNotification('Ошибка', 'Введите пароль', 'error');
            return false;
        }

        if (password === '123456789') {
            this.showNotification('Ошибка безопасности', 'Слишком легкий пароль! Используйте более сложный пароль.', 'error');
            return false;
        }

        return true;
    }

    // Валидация регистрации
    validateRegistration(username, email, password, confirmPassword) {
        if (!username.trim()) {
            this.showNotification('Ошибка', 'Введите никнейм', 'error');
            return false;
        }

        if (username.length < 3) {
            this.showNotification('Ошибка', 'Никнейм должен содержать минимум 3 символа', 'error');
            return false;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Ошибка', 'Введите корректный email', 'error');
            return false;
        }

        if (!this.isStrongPassword(password)) {
            this.showNotification('Ошибка безопасности', 'Пароль слишком слабый. Используйте буквы, цифры и символы.', 'error');
            return false;
        }

        if (password !== confirmPassword) {
            this.showNotification('Ошибка', 'Пароли не совпадают', 'error');
            return false;
        }

        if (!document.getElementById('accept-terms').checked) {
            this.showNotification('Ошибка', 'Примите правила сервера и политику конфиденциальности', 'error');
            return false;
        }

        return true;
    }

    // Проверка email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Проверка силы пароля
    isStrongPassword(password) {
        if (password.length < 8) return false;
        if (password === '123456789') return false;
        
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return hasLetter && hasNumber && hasSpecial;
    }

    // Проверка валидности учетных данных (заглушка)
    isValidCredentials(username, password) {
        // В реальном приложении здесь будет запрос к серверу
        return username.length >= 3 && password.length >= 8;
    }

    // Настройка валидации пароля
    setupPasswordValidation() {
        const passwordInput = document.getElementById('reg-password');
        const confirmInput = document.getElementById('reg-confirm-password');
        const strengthBar = document.getElementById('password-strength');
        const strengthText = document.getElementById('password-text');
        const passwordMatch = document.getElementById('password-match');

        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            this.updatePasswordStrength(password, strengthBar, strengthText);
            this.checkPasswordMatch(password, confirmInput.value, passwordMatch);
        });

        confirmInput.addEventListener('input', () => {
            this.checkPasswordMatch(passwordInput.value, confirmInput.value, passwordMatch);
        });
    }

    // Обновление индикатора силы пароля
    updatePasswordStrength(password, strengthBar, strengthText) {
        let strength = 0;
        let text = 'Слабый пароль';
        let color = '#ff3366';

        if (password.length >= 8) strength += 25;
        if (/[a-zA-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 25;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

        if (strength >= 75) {
            text = 'Сильный пароль';
            color = '#00ff00';
        } else if (strength >= 50) {
            text = 'Средний пароль';
            color = '#ff9933';
        }

        strengthBar.style.width = `${strength}%`;
        strengthBar.style.background = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }

    // Проверка совпадения паролей
    checkPasswordMatch(password, confirmPassword, matchElement) {
        if (!confirmPassword) {
            matchElement.classList.remove('valid');
            return;
        }

        if (password === confirmPassword) {
            matchElement.classList.add('valid');
            matchElement.querySelector('.match-text').textContent = 'Пароли совпадают';
        } else {
            matchElement.classList.remove('valid');
            matchElement.querySelector('.match-text').textContent = 'Пароли не совпадают';
        }
    }

    // Настройка системы бонусов
    setupBonusSystem() {
        const claimButton = document.getElementById('claim-bonus');
        
        claimButton.addEventListener('click', () => {
            this.claimDailyBonus();
        });

        // Таймер следующего бонуса
        this.startBonusTimer();
    }

    // Получение ежедневного бонуса
    async claimDailyBonus() {
        const button = document.getElementById('claim-bonus');
        const bonusItems = document.querySelectorAll('.bonus-item');
        
        this.setButtonLoading(button, true);

        try {
            await this.simulateRequest(2000);

            // Случайный выбор типа награды (VIP или промокод)
            const rewardType = Math.random() > 0.5 ? 'vip' : 'promo';
            
            if (rewardType === 'vip') {
                this.giveVipReward();
            } else {
                this.givePromoCode();
            }

            // Обновление статуса бонусов
            bonusItems.forEach(item => {
                const status = item.querySelector('.bonus-status');
                status.textContent = 'Получено';
                status.classList.remove('status-available');
                status.classList.add('status-claimed');
            });

            button.innerHTML = '<span class="btn-text">Бонус получен</span>';
            button.disabled = true;

            this.showNotification(
                'Бонус получен!', 
                'Проверьте свою почту для получения деталей', 
                'success'
            );

        } catch (error) {
            this.showNotification('Ошибка', 'Не удалось получить бонус', 'error');
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    // Выдача VIP награды
    giveVipReward() {
        const durations = [
            { minutes: 10, chance: 0.5 },
            { minutes: 20, chance: 0.25 },
            { minutes: 30, chance: 0.15 }
        ];

        let random = Math.random();
        let duration = 10; // По умолчанию 10 минут

        for (const dur of durations) {
            if (random <= dur.chance) {
                duration = dur.minutes;
                break;
            }
            random -= dur.chance;
        }

        document.getElementById('vip-duration').textContent = `VIP на ${duration} минут`;
        this.openModal(document.getElementById('vip-modal'));

        // Симуляция активации VIP на сервере
        this.activateVipOnServer(duration);
    }

    // Выдача промокода
    givePromoCode() {
        const discounts = [
            { percent: 10, chance: 0.7 },
            { percent: 20, chance: 0.2 },
            { percent: 30, chance: 0.05 },
            { percent: 40, chance: 0.01 }
        ];

        let random = Math.random();
        let discount = 10; // По умолчанию 10%

        for (const disc of discounts) {
            if (random <= disc.chance) {
                discount = disc.percent;
                break;
            }
            random -= disc.chance;
        }

        const promoCode = `BLOODY${discount}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        document.getElementById('promo-code').textContent = promoCode;
        document.getElementById('promo-type').textContent = `${discount}% на все товары`;
        
        this.openModal(document.getElementById('promo-modal'));

        // Симуляция сохранения промокода
        this.savePromoCode(promoCode, discount);
    }

    // Таймер следующего бонуса
    startBonusTimer() {
        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const diff = tomorrow - now;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            document.getElementById('bonus-timer').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Взаимодействие с Дедом Морозом
    setupSantaInteraction() {
        const santa = document.getElementById('santa');
        
        santa.addEventListener('click', () => {
            this.giveSantaReward();
        });
    }

    // Награда от Деда Мороза
    giveSantaReward() {
        const promoCode = `SANTA${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const discount = Math.floor(Math.random() * 3) * 10 + 10; // 10%, 20% или 30%
        
        document.getElementById('promo-code').textContent = promoCode;
        document.getElementById('promo-type').textContent = `${discount}% на все товары`;
        
        this.openModal(document.getElementById('promo-modal'));
        this.showNotification('Подарок от Деда Мороза!', 'Вы получили эксклюзивный промокод', 'success');
        
        // Симуляция сохранения промокода
        this.savePromoCode(promoCode, discount);
    }

    // Настройка мобильного меню
    setupMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }

    // Настройка уведомлений
    setupNotifications() {
        this.notificationContainer = document.getElementById('notification-container');
    }

    // Показать уведомление
    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;

        this.notificationContainer.appendChild(notification);

        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationSlide 0.3s ease-in reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Настройка уведомления о куки
    setupCookieNotice() {
        const notice = document.getElementById('cookie-notice');
        const acceptBtn = document.getElementById('accept-cookies');

        // Проверяем, принял ли пользователь куки
        if (!this.getCookie('cookies_accepted')) {
            notice.style.display = 'block';
        }

        acceptBtn.addEventListener('click', () => {
            this.setCookie('cookies_accepted', 'true', 365);
            notice.style.display = 'none';
        });
    }

    // Работа с куки
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Утилиты
    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    simulateRequest(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    simulateEmailConfirmation(email, username) {
        // В реальном приложении здесь будет отправка email
        console.log(`Отправка кода подтверждения на ${email} для пользователя ${username}`);
        
        // Симуляция получения email через 3 секунды
        setTimeout(() => {
            this.showNotification(
                'Письмо отправлено!', 
                `Код подтверждения отправлен на ${email}`, 
                'success'
            );
        }, 3000);
    }

    activateVipOnServer(duration) {
        // В реальном приложении здесь будет запрос к API сервера
        console.log(`Активация VIP на ${duration} минут на сервере`);
    }

    savePromoCode(code, discount) {
        // В реальном приложении здесь будет сохранение в базе данных
        console.log(`Сохранение промокода ${code} со скидкой ${discount}%`);
        
        // Сохранение в localStorage для демонстрации
        const promoCodes = JSON.parse(localStorage.getItem('bloody_promocodes') || '[]');
        promoCodes.push({ code, discount, used: false });
        localStorage.setItem('bloody_promocodes', JSON.stringify(promoCodes));
    }

    updateUserStatus(username) {
        // Обновление интерфейса после входа
        const loginBtn = document.querySelector('.btn-login');
        const registerBtn = document.querySelector('.btn-register');
        
        loginBtn.textContent = username;
        loginBtn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
        registerBtn.style.display = 'none';
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Копирование промокода
        document.getElementById('copy-promo')?.addEventListener('click', () => {
            const code = document.getElementById('promo-code').textContent;
            this.copyToClipboard(code);
            this.showNotification('Скопировано!', 'Промокод скопирован в буфер обмена', 'success');
        });

        // Навигация
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('data-target');
                this.handleNavigation(target);
            });
        });

        // Пакеты доната
        document.querySelectorAll('.btn-package').forEach(button => {
            button.addEventListener('click', (e) => {
                const packageCard = e.target.closest('.package-card');
                const packageName = packageCard.querySelector('h3').textContent;
                const packagePrice = packageCard.querySelector('.package-price').textContent;
                
                this.showNotification(
                    'Выбор пакета', 
                    `Вы выбрали пакет "${packageName}" за ${packagePrice}`, 
                    'info'
                );
            });
        });

        // Действия
        document.querySelectorAll('.btn-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.textContent.trim();
                this.handleAction(action);
            });
        });

        // Забыли пароль
        document.querySelector('.forgot-password')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
    }

    // Обработка навигации
    handleNavigation(target) {
        // Обновление активной ссылки
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');

        // Прокрутка к секции
        const section = document.getElementById(target);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            this.showNotification('Раздел в разработке', 'Данный раздел находится в разработке', 'info');
        }
    }

    // Обработка действий
    handleAction(action) {
        switch (action) {
            case 'Скачать лаунчер':
                this.downloadLauncher();
                break;
            case 'Техподдержка':
                this.openSupport();
                break;
            case 'Наш Discord':
                this.openDiscord();
                break;
            case 'Статистика':
                this.openStatistics();
                break;
            default:
                this.showNotification('Действие', `Выполняется: ${action}`, 'info');
        }
    }

    // Загрузка лаунчера
    downloadLauncher() {
        this.showNotification('Загрузка', 'Начинается загрузка лаунчера...', 'info');
        // В реальном приложении здесь будет ссылка на скачивание
        setTimeout(() => {
            this.showNotification('Успех', 'Лаунчер успешно скачан!', 'success');
        }, 2000);
    }

    // Открытие поддержки
    openSupport() {
        this.showNotification('Поддержка', 'Открывается чат поддержки...', 'info');
        // В реальном приложении здесь будет открытие чата поддержки
    }

    // Открытие Discord
    openDiscord() {
        window.open('https://discord.gg/bloodybutterfly', '_blank');
    }

    // Открытие статистики
    openStatistics() {
        this.showNotification('Статистика', 'Открывается страница статистики...', 'info');
        // В реальном приложении здесь будет открытие статистики
    }

    // Восстановление пароля
    handleForgotPassword() {
        const email = prompt('Введите ваш email для восстановления пароля:');
        if (email && this.isValidEmail(email)) {
            this.showNotification(
                'Восстановление пароля', 
                `Инструкции отправлены на ${email}`, 
                'success'
            );
        } else if (email) {
            this.showNotification('Ошибка', 'Введите корректный email', 'error');
        }
    }

    // Копирование в буфер обмена
    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.bloodyButterflyApp = new BloodyButterflyApp();
});

// Глобальные функции для обратной совместимости
function showNotification(title, message, type = 'info') {
    if (window.bloodyButterflyApp) {
        window.bloodyButterflyApp.showNotification(title, message, type);
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && window.bloodyButterflyApp) {
        window.bloodyButterflyApp.openModal(modal);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && window.bloodyButterflyApp) {
        window.bloodyButterflyApp.closeModal(modal);
    }
}

// Обработка ошибок
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.bloodyButterflyApp) {
        window.bloodyButterflyApp.showNotification(
            'Ошибка приложения', 
            'Произошла непредвиденная ошибка', 
            'error'
        );
    }
});

// Сохранение состояния приложения
window.addEventListener('beforeunload', () => {
    // Сохранение состояния в localStorage
    const state = {
        timestamp: Date.now(),
        // Другие данные состояния
    };
    localStorage.setItem('bloody_app_state', JSON.stringify(state));
});

// Восстановление состояния при загрузке
window.addEventListener('load', () => {
    const savedState = localStorage.getItem('bloody_app_state');
    if (savedState) {
        const state = JSON.parse(savedState);
        console.log('App state restored:', state);
    }
});
