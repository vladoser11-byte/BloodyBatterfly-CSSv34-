// Основной модуль приложения
const App = {
    // Инициализация приложения
    init() {
        this.createSnow();
        this.setupEventListeners();
        this.setupNavigation();
        this.setupFAQ();
        this.loadBonusHistory();
        this.startBonusTimer();
        console.log('BloodyBatterfly New Year 2026 initialized!');
    },

    // Создание снега
    createSnow() {
        const snowflakes = document.getElementById('snowflakes');
        const snowCount = 150;
        
        for (let i = 0; i < snowCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            
            // Случайный размер
            const size = Math.random() * 5 + 2;
            snowflake.style.width = `${size}px`;
            snowflake.style.height = `${size}px`;
            
            // Случайная позиция
            snowflake.style.left = `${Math.random() * 100}vw`;
            
            // Случайная прозрачность
            snowflake.style.opacity = Math.random() * 0.6 + 0.3;
            
            // Случайная скорость
            const duration = Math.random() * 10 + 5;
            snowflake.style.animationDuration = `${duration}s`;
            
            // Случайная задержка
            snowflake.style.animationDelay = `${Math.random() * 5}s`;
            
            snowflakes.appendChild(snowflake);
        }
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Модальные окна
        const authModal = document.getElementById('auth-modal');
        const promoModal = document.getElementById('promo-modal');
        const authBtn = document.getElementById('auth-btn');
        const closeAuth = document.getElementById('close-auth');
        const closePromo = document.getElementById('close-promo');
        const santa = document.getElementById('santa');
        const dailyBonus = document.getElementById('daily-bonus');
        const copyPromo = document.getElementById('copy-promo');

        // Открытие модальных окон
        authBtn.addEventListener('click', () => {
            authModal.style.display = 'flex';
        });

        // Клик по Деду Морозу
        santa.addEventListener('click', () => {
            this.generatePromoCode();
            promoModal.style.display = 'flex';
        });

        // Закрытие модальных окон
        closeAuth.addEventListener('click', () => {
            authModal.style.display = 'none';
        });

        closePromo.addEventListener('click', () => {
            promoModal.style.display = 'none';
        });

        // Копирование промокода
        copyPromo.addEventListener('click', () => {
            const promoCode = document.getElementById('promo-code').textContent;
            navigator.clipboard.writeText(promoCode).then(() => {
                this.showNotification('Промокод скопирован в буфер обмена!', 'success');
            });
        });

        // Ежедневный бонус
        dailyBonus.addEventListener('click', () => {
            this.claimDailyBonus();
        });

        // Закрытие модальных окон при клике вне их
        window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
            if (e.target === promoModal) {
                promoModal.style.display = 'none';
            }
        });

        // Аутентификация
        this.setupAuth();
    },

    // Настройка навигации
    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn[data-tab]');
        const tabContents = document.querySelectorAll('.tab-content');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab') + '-tab';
                
                // Убираем активный класс у всех кнопок и вкладок
                navBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(tab => tab.classList.remove('active'));
                
                // Добавляем активный класс текущей кнопке и вкладке
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    },

    // Настройка аутентификации
    setupAuth() {
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');

        // Переключение между входом и регистрацией
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const authType = tab.getAttribute('data-auth');
                
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(form => form.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(`${authType}-form`).classList.add('active');
            });
        });

        // Обработка формы входа
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Обработка формы регистрации
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    },

    // Обработка входа
    handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            this.showNotification('Заполните все поля!', 'error');
            return;
        }

        // Имитация успешного входа
        this.showNotification(`Добро пожаловать, ${username}!`, 'success');
        document.getElementById('auth-modal').style.display = 'none';
        document.getElementById('loginForm').reset();
        
        // Обновляем кнопку входа
        const authBtn = document.getElementById('auth-btn');
        authBtn.innerHTML = '<i class="fas fa-user"></i><span>Профиль</span>';
    },

    // Обработка регистрации
    handleRegister() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        // Проверка пароля
        if (!this.validatePassword(password)) {
            this.showNotification('Пароль слишком простой или не содержит английских букв или символов!', 'error');
            return;
        }

        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            this.showNotification('Пароли не совпадают!', 'error');
            return;
        }

        // Проверка ника
        if (username.length < 3) {
            this.showNotification('Ник должен содержать минимум 3 символа!', 'error');
            return;
        }

        // Проверка email
        if (!this.validateEmail(email)) {
            this.showNotification('Введите корректный email!', 'error');
            return;
        }

        // Имитация успешной регистрации
        this.showNotification('Регистрация успешна! Код подтверждения отправлен на вашу почту.', 'success');
        document.getElementById('auth-modal').style.display = 'none';
        document.getElementById('registerForm').reset();
    },

    // Валидация пароля
    validatePassword(password) {
        // Проверка на слишком простые пароли
        const weakPasswords = ['123456', '123456789', 'password', 'qwerty', '111111', '123123'];
        if (weakPasswords.includes(password)) {
            return false;
        }
        
        // Проверка на наличие английских букв или символов
        const hasLettersOrSymbols = /[a-zA-Z$]/.test(password);
        if (!hasLettersOrSymbols) {
            return false;
        }
        
        return true;
    },

    // Валидация email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Настройка FAQ
    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    },

    // Получение ежедневного бонуса
    claimDailyBonus() {
        const dailyBonus = document.getElementById('daily-bonus');
        const bonusTimer = document.getElementById('bonus-timer');

        // Шансы на бонусы
        const vipChances = [
            { time: 10, chance: 0.5 },
            { time: 20, chance: 0.25 },
            { time: 30, chance: 0.15 }
        ];

        const promoChances = [
            { discount: 10, chance: 0.7 },
            { discount: 20, chance: 0.2 },
            { discount: 30, chance: 0.05 },
            { discount: 40, chance: 0.01 }
        ];

        // Определяем, что выпадает - VIP или промокод
        const isVip = Math.random() > 0.5;
        let reward;

        if (isVip) {
            // Выбираем VIP бонус
            let random = Math.random();
            let selectedVip = vipChances[0];
            
            for (const vip of vipChances) {
                if (random <= vip.chance) {
                    selectedVip = vip;
                    break;
                }
                random -= vip.chance;
            }
            
            reward = {
                type: 'vip',
                value: selectedVip.time,
                text: `VIP на ${selectedVip.time} минут`
            };
        } else {
            // Выбираем промокод
            let random = Math.random();
            let selectedPromo = promoChances[0];
            
            for (const promo of promoChances) {
                if (random <= promo.chance) {
                    selectedPromo = promo;
                    break;
                }
                random -= promo.chance;
            }
            
            reward = {
                type: 'promo',
                value: selectedPromo.discount,
                text: `Промокод на скидку ${selectedPromo.discount}%`
            };
        }

        // Показываем уведомление
        this.showNotification(`Поздравляем! Вы получили: ${reward.text}`, 'success');

        // Добавляем в историю
        this.addToBonusHistory(reward);

        // Блокируем кнопку на 24 часа
        dailyBonus.disabled = true;
        dailyBonus.textContent = 'Бонус получен';

        // Сохраняем время последнего бонуса
        localStorage.setItem('lastBonusTime', Date.now());

        // Запускаем таймер
        this.startBonusTimer();
    },

    // Запуск таймера бонуса
    startBonusTimer() {
        const bonusTimer = document.getElementById('bonus-timer');
        const dailyBonus = document.getElementById('daily-bonus');
        
        const lastBonusTime = localStorage.getItem('lastBonusTime');
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (!lastBonusTime || (now - lastBonusTime) >= twentyFourHours) {
            // Бонус доступен
            dailyBonus.disabled = false;
            dailyBonus.innerHTML = '<i class="fas fa-gift"></i> Получить ежедневный бонус';
            bonusTimer.textContent = 'Бонус доступен!';
            return;
        }
        
        // Бонус еще не доступен
        dailyBonus.disabled = true;
        dailyBonus.textContent = 'Бонус получен';
        
        const timeLeft = twentyFourHours - (now - lastBonusTime);
        this.updateBonusTimer(timeLeft);
        
        const timerInterval = setInterval(() => {
            const currentTime = Date.now();
            const remainingTime = twentyFourHours - (currentTime - lastBonusTime);
            
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                dailyBonus.disabled = false;
                dailyBonus.innerHTML = '<i class="fas fa-gift"></i> Получить ежедневный бонус';
                bonusTimer.textContent = 'Бонус доступен!';
                return;
            }
            
            this.updateBonusTimer(remainingTime);
        }, 1000);
    },

    // Обновление таймера бонуса
    updateBonusTimer(timeLeft) {
        const bonusTimer = document.getElementById('bonus-timer');
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        bonusTimer.textContent = `Бонус будет доступен через: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    // Добавление в историю бонусов
    addToBonusHistory(reward) {
        const historyList = document.getElementById('bonus-history');
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const now = new Date();
        const timeString = now.toLocaleDateString('ru-RU') + ' ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        
        historyItem.innerHTML = `
            <div>
                <strong>${reward.text}</strong>
                <div class="form-note">${timeString}</div>
            </div>
            <div class="chance">Получено</div>
        `;
        
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // Сохраняем в localStorage
        this.saveBonusHistory();
    },

    // Загрузка истории бонусов
    loadBonusHistory() {
        const history = JSON.parse(localStorage.getItem('bonusHistory') || '[]');
        const historyList = document.getElementById('bonus-history');
        
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div>
                    <strong>${item.text}</strong>
                    <div class="form-note">${item.time}</div>
                </div>
                <div class="chance">Получено</div>
            `;
            historyList.appendChild(historyItem);
        });
    },

    // Сохранение истории бонусов
    saveBonusHistory() {
        const historyItems = document.querySelectorAll('.history-item');
        const history = [];
        
        historyItems.forEach(item => {
            const text = item.querySelector('strong').textContent;
            const time = item.querySelector('.form-note').textContent;
            history.push({ text, time });
        });
        
        localStorage.setItem('bonusHistory', JSON.stringify(history));
    },

    // Генерация промокода
    generatePromoCode() {
        const promoCode = document.getElementById('promo-code');
        const codes = [
            'BB2026-VIP-1DAY',
            'XMAS2026-VIP',
            'NEWYEAR-VIP-24H',
            'BLOODY-VIP-2026'
        ];
        
        const randomCode = codes[Math.floor(Math.random() * codes.length)];
        promoCode.textContent = randomCode;
    },

    // Показ уведомления
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = 'notification';
        notification.classList.add(type, 'show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
};

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Дополнительные утилиты
const Utils = {
    // Форматирование даты
    formatDate(date) {
        return new Date(date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Генератор случайных чисел в диапазоне
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Проверка поддержки localStorage
    supportsLocalStorage() {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    }
};

// Экспорт для использования в других модулях (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, Utils };
}
