// Основной модуль сайта
const BloodyButterfly = {
    // Конфигурация
    config: {
        apiUrl: 'https://api.bloodybutterfly.ru',
        version: 'ClientMod V34',
        year: 2026,
        defaultPromocode: 'BLOODY2026-VIP'
    },

    // Состояние приложения
    state: {
        user: null,
        isAuthenticated: false,
        notifications: [],
        activeTab: 'home',
        dailyBonusClaimed: false,
        promocodeActivated: false,
        vipStatus: null,
        userBalance: 0,
        serverStats: {
            online: 1278,
            giftsToday: 356
        }
    },

    // Инициализация
    init() {
        console.log(`🎄 BloodyButterfly Server ${this.config.version} - Новый Год ${this.config.year} 🎄`);
        
        this.setupEventListeners();
        this.setupSantaAnimation();
        this.setupBackgroundEffects();
        this.checkAuthStatus();
        this.updateServerStats();
        this.setupAnimations();
        this.setupNotifications();
        this.setupBonusSystem();
        this.setupPasswordValidation();
        
        // Запуск анимаций
        this.startAnimations();
        
        console.log('✅ Сайт инициализирован успешно!');
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Модальное окно авторизации
        document.getElementById('authTab').addEventListener('click', () => this.showAuthModal());
        document.querySelector('.close-auth').addEventListener('click', () => this.hideAuthModal());
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchAuthTab(e));
        });

        // Формы
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());

        // Бонусы
        document.getElementById('claimBonus').addEventListener('click', () => this.claimDailyBonus());

        // Промокоды
        document.querySelector('.activate-btn').addEventListener('click', () => this.activatePromocode());
        document.querySelector('.copy-btn').addEventListener('click', () => this.copyPromocode());

        // Дед Мороз
        document.getElementById('santa').addEventListener('click', () => this.showPromocodeModal());

        // Закрытие модальных окон
        document.querySelector('.close-modal').addEventListener('click', () => this.hidePromocodeModal());

        // Обработка нажатий вне модальных окон
        window.addEventListener('click', (e) => this.handleOutsideClick(e));

        // Обновление статистики
        setInterval(() => this.updateServerStats(), 30000);
    },

    // Анимация Деда Мороза
    setupSantaAnimation() {
        const santa = document.getElementById('santa');
        let direction = 1;
        let yPos = 20;

        function animateSanta() {
            yPos += direction * 0.5;
            
            if (yPos > 30 || yPos < 10) {
                direction *= -1;
            }
            
            santa.style.top = `${yPos}%`;
            requestAnimationFrame(animateSanta);
        }

        // Добавление эффекта следов
        function createSantaTrail() {
            const trail = document.createElement('div');
            trail.className = 'santa-trail';
            trail.style.left = `${Math.random() * 100}%`;
            trail.style.top = `${yPos + 5}%`;
            document.querySelector('.background-container').appendChild(trail);

            // Удаление следа через время
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
            }, 3000);
        }

        // Запуск анимаций
        animateSanta();
        setInterval(createSantaTrail, 2000);
    },

    // Фоновые эффекты
    setupBackgroundEffects() {
        // Снежинки
        function createSnowflake() {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = '❄';
            
            // Случайная позиция и размер
            const size = Math.random() * 20 + 10;
            const left = Math.random() * 100;
            const opacity = Math.random() * 0.7 + 0.3;
            const duration = Math.random() * 10 + 10;
            
            snowflake.style.cssText = `
                position: absolute;
                top: -50px;
                left: ${left}%;
                font-size: ${size}px;
                opacity: ${opacity};
                color: white;
                pointer-events: none;
                z-index: 1;
                animation: snowflakeFall ${duration}s linear infinite;
            `;
            
            document.querySelector('.snowflakes').appendChild(snowflake);
            
            // Удаление снежинки после падения
            setTimeout(() => {
                if (snowflake.parentNode) {
                    snowflake.parentNode.removeChild(snowflake);
                }
            }, duration * 1000);
        }

        // Создание снежинок
        setInterval(createSnowflake, 300);

        // Добавление CSS анимации для снежинок
        const style = document.createElement('style');
        style.textContent = `
            @keyframes snowflakeFall {
                0% {
                    transform: translateY(-100px) rotate(0deg);
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);

        // Эффект мерцания огней
        const lights = document.querySelectorAll('.christmas-lights i');
        lights.forEach((light, index) => {
            setInterval(() => {
                light.style.opacity = Math.random() * 0.5 + 0.5;
                light.style.transform = `scale(${Math.random() * 0.3 + 0.85})`;
            }, 1000 + index * 200);
        });

        // Эффект параллакса для фона
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-layer');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    },

    // Проверка статуса авторизации
    checkAuthStatus() {
        const savedUser = localStorage.getItem('bloodyButterflyUser');
        if (savedUser) {
            try {
                this.state.user = JSON.parse(savedUser);
                this.state.isAuthenticated = true;
                this.updateUserInterface();
                this.showNotification('Добро пожаловать обратно!', 'success');
            } catch (error) {
                console.error('Ошибка при загрузке пользователя:', error);
                localStorage.removeItem('bloodyButterflyUser');
            }
        }
    },

    // Обновление интерфейса пользователя
    updateUserInterface() {
        const authTab = document.getElementById('authTab');
        const profileTab = document.getElementById('profileTab');
        const profileTabContent = document.getElementById('profileTabContent');
        
        if (this.state.isAuthenticated && this.state.user) {
            authTab.style.display = 'none';
            profileTab.style.display = 'flex';
            
            // Обновление данных профиля
            document.getElementById('profileUsername').textContent = this.state.user.username;
            document.getElementById('userBalance').textContent = this.state.user.balance || 0;
            
            if (this.state.user.vipUntil) {
                document.getElementById('vipUntil').textContent = 
                    new Date(this.state.user.vipUntil).toLocaleDateString();
            }
            
            // Показ вкладки профиля если она активна
            if (this.state.activeTab === 'profile') {
                profileTabContent.classList.add('active');
            }
        } else {
            authTab.style.display = 'flex';
            profileTab.style.display = 'none';
            profileTabContent.classList.remove('active');
        }
    },

    // Обработка навигации
    handleNavigation(event) {
        event.preventDefault();
        const tab = event.currentTarget.dataset.tab;
        
        // Обновление активного элемента навигации
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // Скрытие всех вкладок
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Показ выбранной вкладки
        const tabContent = document.getElementById(`${tab}Tab`);
        if (tabContent) {
            tabContent.classList.add('active');
            this.state.activeTab = tab;
            
            // Особые обработки для вкладок
            if (tab === 'profile' && !this.state.isAuthenticated) {
                this.showNotification('Для доступа к профилю необходимо войти в систему', 'warning');
                this.showAuthModal();
                return;
            }
            
            // Анимация перехода
            tabContent.style.animation = 'none';
            setTimeout(() => {
                tabContent.style.animation = 'tabFade 0.5s ease-out';
            }, 10);
        }
    },

    // Показ модального окна авторизации
    showAuthModal() {
        const modal = document.getElementById('authModal');
        modal.style.display = 'flex';
        modal.classList.add('active');
        
        // Сброс форм
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        
        // Показ формы входа по умолчанию
        this.switchAuthTab({ currentTarget: document.querySelector('.auth-tab[data-auth="login"]') });
    },

    // Скрытие модального окна авторизации
    hideAuthModal() {
        const modal = document.getElementById('authModal');
        modal.style.display = 'none';
        modal.classList.remove('active');
    },

    // Переключение вкладок авторизации
    switchAuthTab(event) {
        const authType = event.currentTarget.dataset.auth;
        
        // Обновление активной вкладки
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // Показ соответствующей формы
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${authType}Form`).classList.add('active');
    },

    // Обработка входа
    async handleLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Валидация
        if (!username || !password) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }
        
        // Проверка подключения к серверу
        const serverConnected = await this.checkServerConnection(username);
        if (!serverConnected) {
            this.showNotification(
                'Ошибка подключения к игровому серверу. Проверьте правильность ника и попробуйте снова.',
                'error'
            );
            return;
        }
        
        // Симуляция запроса к API
        this.showLoading('Проверка данных...');
        
        setTimeout(() => {
            this.hideLoading();
            
            // Успешный вход
            this.state.user = {
                username,
                email: 'user@example.com',
                balance: 1000,
                vipUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                serverNickname: username
            };
            
            this.state.isAuthenticated = true;
            localStorage.setItem('bloodyButterflyUser', JSON.stringify(this.state.user));
            
            this.updateUserInterface();
            this.hideAuthModal();
            this.showNotification('Успешный вход! Добро пожаловать!', 'success');
            
            // Обновление статистики
            this.updateServerStats();
            
        }, 1500);
    },

    // Обработка регистрации
    async handleRegister(event) {
        event.preventDefault();
        
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        // Валидация
        if (!username || !email || !password || !confirmPassword) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }
        
        // Проверка сложности пароля
        if (!this.validatePassword(password)) {
            this.showNotification(
                'Пароль слишком простой. Используйте английские буквы и специальные символы',
                'error'
            );
            return;
        }
        
        // Проверка email
        if (!this.validateEmail(email)) {
            this.showNotification('Введите корректный email адрес', 'error');
            return;
        }
        
        // Проверка подключения к серверу
        const serverConnected = await this.checkServerConnection(username);
        if (!serverConnected) {
            this.showNotification(
                'Ошибка подключения к игровому серверу. Проверьте правильность ника и попробуйте снова.',
                'error'
            );
            return;
        }
        
        this.showLoading('Регистрация...');
        
        setTimeout(() => {
            this.hideLoading();
            
            // Успешная регистрация
            this.state.user = {
                username,
                email,
                balance: 500,
                vipUntil: null,
                serverNickname: username,
                registeredAt: new Date().toISOString()
            };
            
            this.state.isAuthenticated = true;
            localStorage.setItem('bloodyButterflyUser', JSON.stringify(this.state.user));
            
            this.updateUserInterface();
            this.hideAuthModal();
            this.showNotification('Регистрация успешна! Добро пожаловать!', 'success');
            
            // Симуляция отправки email
            this.sendConfirmationEmail(email, username);
            
        }, 2000);
    },

    // Проверка подключения к игровому серверу
    async checkServerConnection(username) {
        // Симуляция проверки подключения
        return new Promise(resolve => {
            setTimeout(() => {
                // В реальном приложении здесь был бы запрос к API сервера
                const validNames = ['player1', 'gamer2', 'pro3', 'testUser', username.toLowerCase()];
                resolve(validNames.includes(username.toLowerCase()));
            }, 500);
        });
    },

    // Валидация пароля
    validatePassword(password) {
        const minLength = 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSpecialChar = /[$!@#%^&*]/.test(password);
        const isTooSimple = /^(123456789|qwerty|password|admin|123456|12345678)$/i.test(password);
        
        return password.length >= minLength && 
               hasLetter && 
               hasSpecialChar && 
               !isTooSimple;
    },

    // Валидация email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Отправка email подтверждения
    sendConfirmationEmail(email, username) {
        console.log(`📧 Отправка подтверждения на ${email} для пользователя ${username}`);
        // В реальном приложении здесь был бы запрос к email сервису
    },

    // Выход из системы
    handleLogout() {
        this.state.user = null;
        this.state.isAuthenticated = false;
        localStorage.removeItem('bloodyButterflyUser');
        
        this.updateUserInterface();
        this.showNotification('Вы вышли из системы', 'info');
        
        // Переключение на главную вкладку
        document.querySelector('.nav-item[data-tab="home"]').click();
    },

    // Обновление статистики сервера
    updateServerStats() {
        // Симуляция обновления статистики
        const onlineChange = Math.floor(Math.random() * 100) - 50;
        const giftsChange = Math.floor(Math.random() * 50);
        
        this.state.serverStats.online = Math.max(100, this.state.serverStats.online + onlineChange);
        this.state.serverStats.giftsToday = Math.max(0, this.state.serverStats.giftsToday + giftsChange);
        
        // Анимация обновления
        this.animateCounter('onlineCount', this.state.serverStats.online);
        this.animateCounter('giftsToday', this.state.serverStats.giftsToday);
    },

    // Анимация счетчика
    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = (targetValue - currentValue) / steps;
        let currentStep = 0;
        
        const timer = setInterval(() => {
            currentStep++;
            const newValue = Math.floor(currentValue + (increment * currentStep));
            element.textContent = newValue.toLocaleString();
            
            if (currentStep >= steps) {
                element.textContent = targetValue.toLocaleString();
                clearInterval(timer);
            }
        }, stepTime);
    },

    // Система бонусов
    setupBonusSystem() {
        // Проверка ежедневного бонуса
        const lastBonusDate = localStorage.getItem('lastBonusDate');
        const today = new Date().toDateString();
        
        if (lastBonusDate === today) {
            this.state.dailyBonusClaimed = true;
            document.getElementById('claimBonus').disabled = true;
            document.getElementById('claimBonus').textContent = 'Бонус уже получен';
        }
    },

    // Получение ежедневного бонуса
    claimDailyBonus() {
        if (this.state.dailyBonusClaimed) {
            this.showNotification('Вы уже получили бонус сегодня', 'warning');
            return;
        }
        
        if (!this.state.isAuthenticated) {
            this.showNotification('Для получения бонуса необходимо войти в систему', 'warning');
            this.showAuthModal();
            return;
        }
        
        this.showLoading('Получение бонуса...');
        
        setTimeout(() => {
            this.hideLoading();
            
            // Определение типа награды
            const rewardType = Math.random();
            let reward = '';
            
            if (rewardType < 0.5) {
                // VIP (50% шанс)
                const vipTypes = [
                    { duration: 10, chance: 0.5 },
                    { duration: 20, chance: 0.25 },
                    { duration: 30, chance: 0.15 }
                ];
                
                const random = Math.random();
                let cumulativeChance = 0;
                let selectedVip = vipTypes[0];
                
                for (const vip of vipTypes) {
                    cumulativeChance += vip.chance;
                    if (random <= cumulativeChance) {
                        selectedVip = vip;
                        break;
                    }
                }
                
                reward = `VIP на ${selectedVip.duration} минут`;
                this.addVipTime(selectedVip.duration);
                
            } else {
                // Промокод на скидку (50% шанс)
                const discountTypes = [
                    { percent: 10, chance: 0.7 },
                    { percent: 20, chance: 0.2 },
                    { percent: 30, chance: 0.05 },
                    { percent: 40, chance: 0.01 }
                ];
                
                const random = Math.random();
                let cumulativeChance = 0;
                let selectedDiscount = discountTypes[0];
                
                for (const discount of discountTypes) {
                    cumulativeChance += discount.chance;
                    if (random <= cumulativeChance) {
                        selectedDiscount = discount;
                        break;
                    }
                }
                
                const promocode = `BLOODY${selectedDiscount.percent}OFF${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
                reward = `Промокод на скидку ${selectedDiscount.percent}%: ${promocode}`;
                this.activatePromocodeForUser(promocode, selectedDiscount.percent);
            }
            
            // Сохранение статуса бонуса
            this.state.dailyBonusClaimed = true;
            localStorage.setItem('lastBonusDate', new Date().toDateString());
            
            document.getElementById('claimBonus').disabled = true;
            document.getElementById('claimBonus').textContent = 'Бонус получен';
            
            // Обновление календаря
            this.updateBonusCalendar();
            
            this.showNotification(`🎁 Вы получили: ${reward}`, 'success');
            
        }, 2000);
    },

    // Добавление VIP времени
    addVipTime(minutes) {
        if (!this.state.user) return;
        
        const currentTime = this.state.user.vipUntil ? 
            new Date(this.state.user.vipUntil).getTime() : 
            Date.now();
        
        const newVipUntil = new Date(currentTime + minutes * 60 * 1000);
        this.state.user.vipUntil = newVipUntil.toISOString();
        
        localStorage.setItem('bloodyButterflyUser', JSON.stringify(this.state.user));
        this.updateUserInterface();
    },

    // Активация промокода для пользователя
    activatePromocodeForUser(promocode, discount) {
        if (!this.state.user) return;
        
        // Сохранение промокода
        const userPromocodes = JSON.parse(localStorage.getItem('userPromocodes') || '[]');
        userPromocodes.push({
            code: promocode,
            discount,
            activatedAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
        
        localStorage.setItem('userPromocodes', JSON.stringify(userPromocodes));
        
        // Обновление интерфейса
        this.updatePromocodeList();
    },

    // Активация промокода
    activatePromocode() {
        const input = document.querySelector('.promocode-input');
        const promocode = input.value.trim().toUpperCase();
        
        if (!promocode) {
            this.showNotification('Введите промокод', 'error');
            return;
        }
        
        if (!this.state.isAuthenticated) {
            this.showNotification('Для активации промокода необходимо войти в систему', 'warning');
            this.showAuthModal();
            return;
        }
        
        this.showLoading('Активация промокода...');
        
        setTimeout(() => {
            this.hideLoading();
            
            // Проверка валидности промокода
            const validPromocodes = [
                { code: 'NEWYEAR2026', discount: 15 },
                { code: 'BLOODYVIP', discount: 20 },
                { code: 'WINTERGIFT', discount: 10 }
            ];
            
            const validPromo = validPromocodes.find(p => p.code === promocode);
            
            if (validPromo) {
                this.activatePromocodeForUser(promocode, validPromo.discount);
                input.value = '';
                this.showNotification(`Промокод активирован! Скидка ${validPromo.discount}%`, 'success');
            } else {
                this.showNotification('Неверный или устаревший промокод', 'error');
            }
            
        }, 1500);
    },

    // Обновление списка промокодов
    updatePromocodeList() {
        const container = document.querySelector('.active-promocodes');
        if (!container) return;
        
        const userPromocodes = JSON.parse(localStorage.getItem('userPromocodes') || '[]');
        
        if (userPromocodes.length === 0) {
            container.innerHTML = '<p>У вас нет активных промокодов</p>';
            return;
        }
        
        let html = '<div class="promocode-list">';
        userPromocodes.forEach(promo => {
            const validUntil = new Date(promo.validUntil).toLocaleDateString();
            html += `
                <div class="promocode-item">
                    <span class="promo-code">${promo.code}</span>
                    <span class="promo-discount">-${promo.discount}%</span>
                    <span class="promo-date">До: ${validUntil}</span>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
    },

    // Обновление календаря бонусов
    updateBonusCalendar() {
        const today = new Date().getDate();
        const calendar = document.querySelector('.bonus-calendar');
        
        if (!calendar) return;
        
        const days = calendar.querySelectorAll('.bonus-day');
        days.forEach((day, index) => {
            const dayNumber = parseInt(day.querySelector('.day-number').textContent);
            
            if (dayNumber < today) {
                day.classList.add('claimed');
                day.classList.remove('today');
            } else if (dayNumber === today) {
                if (this.state.dailyBonusClaimed) {
                    day.classList.add('claimed');
                } else {
                    day.classList.add('today');
                }
            } else {
                day.classList.remove('claimed', 'today');
            }
        });
    },

    // Показ модального окна с промокодом от Деда Мороза
    showPromocodeModal() {
        const modal = document.getElementById('promocodeModal');
        const promocodeText = document.getElementById('promocodeText');
        
        // Генерация уникального промокода
        const promocode = `SANTA-${Date.now().toString(36).toUpperCase()}-VIP`;
        promocodeText.textContent = promocode;
        
        modal.classList.add('active');
        
        // Активация VIP на 1 день
        this.addVipTime(24 * 60); // 24 часа в минутах
        
        // Создание праздничного эффекта
        this.createHolidayEffect();
        
        this.showNotification('🎅 Дед Мороз подарил вам VIP на 1 день!', 'success');
    },

    // Скрытие модального окна с промокодом
    hidePromocodeModal() {
        const modal = document.getElementById('promocodeModal');
        modal.classList.remove('active');
    },

    // Копирование промокода
    copyPromocode() {
        const promocodeText = document.getElementById('promocodeText').textContent;
        
        navigator.clipboard.writeText(promocodeText).then(() => {
            this.showNotification('Промокод скопирован в буфер обмена!', 'success');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            this.showNotification('Ошибка копирования', 'error');
        });
    },

    // Создание праздничного эффекта
    createHolidayEffect() {
        // Создание конфетти
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    position: fixed;
                    width: 15px;
                    height: 15px;
                    background: ${this.getRandomColor()};
                    top: -20px;
                    left: ${Math.random() * 100}%;
                    border-radius: 50%;
                    z-index: 10000;
                    pointer-events: none;
                    animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                
                // Удаление конфетти после анимации
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 5000);
            }, i * 50);
        }
        
        // Добавление CSS анимации для конфетти
        if (!document.getElementById('confetti-animation')) {
            const style = document.createElement('style');
            style.id = 'confetti-animation';
            style.textContent = `
                @keyframes confettiFall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    // Получение случайного цвета
    getRandomColor() {
        const colors = [
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fab1a0'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Настройка валидации пароля
    setupPasswordValidation() {
        const passwordInput = document.getElementById('regPassword');
        
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const requirements = document.querySelectorAll('.password-requirements li');
            
            // Проверка длины
            requirements[0].classList.toggle('valid', password.length >= 8);
            
            // Проверка английских букв
            requirements[1].classList.toggle('valid', /[a-zA-Z]/.test(password));
            
            // Проверка специальных символов
            requirements[2].classList.toggle('valid', /[$!@#%^&*]/.test(password));
            
            // Проверка сложности
            const isTooSimple = /^(123456789|qwerty|password|admin|123456|12345678)$/i.test(password);
            requirements[3].classList.toggle('valid', !isTooSimple);
        });
    },

    // Настройка анимаций
    setupAnimations() {
        // Анимация появления элементов при прокрутке
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Наблюдение за элементами для анимации
        document.querySelectorAll('.stat-card, .package-card, .news-item, .bonus-day').forEach(el => {
            observer.observe(el);
        });
        
        // Анимация загрузки
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    },

    // Настройка системы уведомлений
    setupNotifications() {
        // Создание контейнера для уведомлений
        const container = document.getElementById('notifications');
        if (!container) return;
        
        // Стили для уведомлений
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                background: linear-gradient(135deg, rgba(26, 35, 126, 0.95), rgba(13, 71, 161, 0.95));
                color: white;
                padding: 15px 20px;
                margin-bottom: 10px;
                border-radius: 10px;
                border-left: 5px solid #ffd700;
                animation: notificationSlide 0.5s ease-out;
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 400px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            
            .notification.success {
                border-left-color: #4caf50;
            }
            
            .notification.error {
                border-left-color: #f44336;
            }
            
            .notification.warning {
                border-left-color: #ff9800;
            }
            
            .notification.info {
                border-left-color: #2196f3;
            }
            
            .notification-content {
                flex: 1;
                margin-right: 10px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 20px;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
            @keyframes notificationSlide {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    },

    // Показать уведомление
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">${message}</div>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notification);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationSlide 0.5s ease-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }
        }, 5000);
        
        // Обработчик закрытия
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    },

    // Показать загрузку
    showLoading(message = 'Загрузка...') {
        // Создание элемента загрузки
        const loading = document.createElement('div');
        loading.id = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        
        // Стили для загрузки
        const style = document.createElement('style');
        style.textContent = `
            #loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(5px);
            }
            
            .loading-content {
                text-align: center;
                color: white;
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 5px solid rgba(255, 255, 255, 0.1);
                border-top-color: #ffd700;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            .loading-text {
                font-size: 18px;
                font-weight: 500;
            }
            
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(loading);
    },

    // Скрыть загрузку
    hideLoading() {
        const loading = document.getElementById('loading-overlay');
        if (loading) {
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.3s';
            
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.parentNode.removeChild(loading);
                }
            }, 300);
        }
    },

    // Обработка клика вне модальных окон
    handleOutsideClick(event) {
        // Закрытие модального окна авторизации
        const authModal = document.getElementById('authModal');
        if (authModal && event.target === authModal) {
            this.hideAuthModal();
        }
        
        // Закрытие модального окна с промокодом
        const promocodeModal = document.getElementById('promocodeModal');
        if (promocodeModal && event.target === promocodeModal) {
            this.hidePromocodeModal();
        }
    },

    // Запуск всех анимаций
    startAnimations() {
        // Анимация счетчика лет
        this.animateYearCounter();
        
        // Анимация снега
        this.animateSnow();
        
        // Анимация огней
        this.animateLights();
        
        // Анимация фона
        this.animateBackground();
    },

    // Анимация счетчика лет
    animateYearCounter() {
        const yearElement = document.querySelector('.year-number.next');
        if (!yearElement) return;
        
        let year = 2025;
        const targetYear = 2026;
        
        const interval = setInterval(() => {
            year++;
            yearElement.textContent = year;
            
            if (year >= targetYear) {
                clearInterval(interval);
                
                // Праздничный эффект при смене года
                setTimeout(() => {
                    this.createHolidayEffect();
                    this.showNotification('🎉 С Новым 2026 Годом! 🎉', 'success');
                }, 500);
            }
        }, 100);
    },

    // Анимация снега
    animateSnow() {
        const snowContainer = document.querySelector('.snowflakes');
        if (!snowContainer) return;
        
        function createSnow() {
            const snow = document.createElement('div');
            snow.className = 'snow-particle';
            snow.style.cssText = `
                position: absolute;
                width: ${Math.random() * 5 + 2}px;
                height: ${Math.random() * 5 + 2}px;
                background: white;
                border-radius: 50%;
                top: -10px;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.7 + 0.3};
                filter: blur(${Math.random() * 2}px);
                animation: snowFall ${Math.random() * 10 + 5}s linear infinite;
            `;
            
            snowContainer.appendChild(snow);
            
            // Удаление снежинки
            setTimeout(() => {
                if (snow.parentNode) {
                    snow.parentNode.removeChild(snow);
                }
            }, 15000);
        }
        
        // Создание снежинок
        for (let i = 0; i < 100; i++) {
            setTimeout(createSnow, i * 100);
        }
        
        setInterval(createSnow, 300);
    },

    // Анимация огней
    animateLights() {
        const lights = document.querySelectorAll('.christmas-lights i');
        lights.forEach((light, index) => {
            setInterval(() => {
                light.style.animation = 'none';
                setTimeout(() => {
                    light.style.animation = `lightTwinkle ${Math.random() * 2 + 1}s infinite alternate`;
                }, 10);
            }, 3000 + index * 500);
        });
    },

    // Анимация фона
    animateBackground() {
        const houses = document.querySelectorAll('.house');
        houses.forEach((house, index) => {
            house.style.animation = `houseGlow ${4 + index}s ease-in-out infinite`;
        });
        
        const tree = document.querySelector('.christmas-tree');
        if (tree) {
            tree.style.animation = 'treeTwinkle 3s infinite';
        }
    },

    // Дополнительные методы для улучшения UX
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    setupFormAnimations() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    },

    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxLayers = document.querySelectorAll('[data-parallax]');
            
            parallaxLayers.forEach(layer => {
                const speed = layer.dataset.parallax || 0.5;
                layer.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    },

    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },

    setupTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            
            element.appendChild(tooltip);
            
            element.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        });
    },

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Закрытие модальных окон по ESC
            if (e.key === 'Escape') {
                this.hideAuthModal();
                this.hidePromocodeModal();
            }
            
            // Навигация по табам с помощью клавиш
            if (e.altKey) {
                const tabs = document.querySelectorAll('.nav-item');
                const currentIndex = Array.from(tabs).findIndex(tab => 
                    tab.classList.contains('active')
                );
                
                switch(e.key) {
                    case '1':
                        tabs[0]?.click();
                        break;
                    case '2':
                        tabs[1]?.click();
                        break;
                    case '3':
                        tabs[2]?.click();
                        break;
                    case '4':
                        tabs[3]?.click();
                        break;
                    case '5':
                        tabs[4]?.click();
                        break;
                    case 'ArrowRight':
                        tabs[(currentIndex + 1) % tabs.length]?.click();
                        break;
                    case 'ArrowLeft':
                        tabs[(currentIndex - 1 + tabs.length) % tabs.length]?.click();
                        break;
                }
            }
        });
    },

    setupPerformanceMonitoring() {
        // Мониторинг FPS
        let frameCount = 0;
        let lastTime = performance.now();
        let fps = 60;
        
        function checkFPS() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                // Логирование низкого FPS
                if (fps < 30) {
                    console.warn(`Низкий FPS: ${fps}. Рекомендуется оптимизация.`);
                }
            }
            
            requestAnimationFrame(checkFPS);
        }
        
        checkFPS();
    },

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Произошла ошибка:', event.error);
            this.showNotification('Произошла ошибка. Пожалуйста, обновите страницу.', 'error');
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Необработанное обещание:', event.reason);
            this.showNotification('Произошла ошибка при выполнении операции.', 'error');
        });
    },

    setupAnalytics() {
        // Отслеживание важных событий
        const trackEvent = (category, action, label) => {
            console.log(`Analytics: ${category} - ${action} - ${label}`);
            // В реальном приложении здесь был бы вызов Google Analytics или другого сервиса
        };
        
        // Отслеживание кликов по навигации
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                trackEvent('Navigation', 'Click', item.dataset.tab);
            });
        });
        
        // Отслеживание форм
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => {
                trackEvent('Form', 'Submit', form.id);
            });
        });
        
        // Отслеживание бонусов
        document.getElementById('claimBonus')?.addEventListener('click', () => {
            trackEvent('Bonus', 'Claim', 'Daily');
        });
    },

    setupOfflineSupport() {
        // Проверка онлайн статуса
        window.addEventListener('online', () => {
            this.showNotification('Соединение восстановлено', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('Отсутствует интернет-соединение', 'warning');
        });
    },

    setupPWAFeatures() {
        // Проверка поддержки PWA
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js').catch(error => {
                console.error('Service Worker registration failed:', error);
            });
        }
        
        // Добавление на главный экран
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Показать кнопку установки
            this.showInstallButton();
        });
    },

    showInstallButton() {
        const installButton = document.createElement('button');
        installButton.id = 'install-button';
        installButton.innerHTML = '📱 Установить приложение';
        installButton.className = 'install-btn';
        
        installButton.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                this.showNotification('Приложение установлено!', 'success');
            }
            
            deferredPrompt = null;
            installButton.remove();
        });
        
        // Добавление кнопки в интерфейс
        const header = document.querySelector('.new-year-header');
        if (header) {
            header.appendChild(installButton);
        }
    },

    setupThemeSwitcher() {
        // Проверка предпочтений пользователя
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-theme');
        }
        
        // Создание переключателя темы
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.innerHTML = '🌙';
        themeToggle.className = 'theme-toggle';
        themeToggle.title = 'Переключить тему';
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.innerHTML = isDark ? '☀️' : '🌙';
        });
        
        // Добавление переключателя
        const nav = document.querySelector('.main-nav');
        if (nav) {
            nav.appendChild(themeToggle);
        }
    },

    setupLanguageSwitcher() {
        const languages = {
            'ru': '🇷🇺 Русский',
            'en': '🇬🇧 English',
            'de': '🇩🇪 Deutsch'
        };
        
        const currentLang = localStorage.getItem('language') || 'ru';
        
        // Создание селектора языка
        const langSelect = document.createElement('select');
        langSelect.id = 'language-select';
        langSelect.className = 'language-select';
        
        Object.entries(languages).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            option.selected = code === currentLang;
            langSelect.appendChild(option);
        });
        
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            localStorage.setItem('language', lang);
            this.changeLanguage(lang);
        });
        
        // Добавление селектора
        const nav = document.querySelector('.main-nav');
        if (nav) {
            nav.appendChild(langSelect);
        }
    },

    changeLanguage(lang) {
        // Здесь должна быть логика смены языка
        // Для простоты просто перезагружаем страницу
        location.reload();
    },

    setupAccessibility() {
        // Улучшение доступности для клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Добавление ARIA атрибутов
        document.querySelectorAll('button, a, input').forEach(element => {
            if (!element.getAttribute('aria-label')) {
                const label = element.textContent || element.title || element.placeholder;
                if (label) {
                    element.setAttribute('aria-label', label);
                }
            }
        });
    },

    setupPrintStyles() {
        // Стили для печати
        const printStyle = document.createElement('style');
        printStyle.media = 'print';
        printStyle.textContent = `
            .background-container,
            .main-nav,
            .auth-modal,
            .promocode-modal,
            .notifications-container,
            button,
            .buy-btn,
            .claim-bonus-btn,
            .activate-btn {
                display: none !important;
            }
            
            body {
                background: white !important;
                color: black !important;
            }
            
            .main-container {
                max-width: 100% !important;
                padding: 20px !important;
            }
            
            .content-container {
                box-shadow: none !important;
                border: 1px solid #ccc !important;
            }
        `;
        document.head.appendChild(printStyle);
    },

    // Метод для очистки и сброса
    cleanup() {
        // Очистка всех интервалов и таймеров
        if (this.animationIntervals) {
            this.animationIntervals.forEach(clearInterval);
        }
        
        if (this.animationFrames) {
            this.animationFrames.forEach(cancelAnimationFrame);
        }
        
        // Удаление всех слушателей событий
        this.eventListeners?.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
    },

    // Деструктор
    destroy() {
        this.cleanup();
        console.log('👋 Сайт уничтожен');
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    BloodyButterfly.init();
    
    // Защита от закрытия с несохраненными данными
    window.addEventListener('beforeunload', (e) => {
        if (BloodyButterfly.state.isAuthenticated && !BloodyButterfly.state.user?.saved) {
            e.preventDefault();
            e.returnValue = 'У вас есть несохраненные изменения. Вы уверены, что хотите уйти?';
        }
    });
});

// Глобальные функции для консоли отладки
window.debugBloodyButterfly = {
    showState: () => console.log(BloodyButterfly.state),
    resetAll: () => {
        localStorage.clear();
        location.reload();
    },
    addCoins: (amount = 1000) => {
        if (BloodyButterfly.state.user) {
            BloodyButterfly.state.user.balance += amount;
            localStorage.setItem('bloodyButterflyUser', JSON.stringify(BloodyButterfly.state.user));
            BloodyButterfly.updateUserInterface();
            BloodyButterfly.showNotification(`Добавлено ${amount} монет!`, 'success');
        }
    },
    giveVIP: (days = 30) => {
        if (BloodyButterfly.state.user) {
            const vipUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
            BloodyButterfly.state.user.vipUntil = vipUntil.toISOString();
            localStorage.setItem('bloodyButterflyUser', JSON.stringify(BloodyButterfly.state.user));
            BloodyButterfly.updateUserInterface();
            BloodyButterfly.showNotification(`VIP на ${days} дней активирован!`, 'success');
        }
    }
};

// Экспорт для модульной системы
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BloodyButterfly;
}

// Service Worker для PWA
if ('serviceWorker' in navigator) {
    const swCode = `
        self.addEventListener('install', (event) => {
            event.waitUntil(
                caches.open('bloody-butterfly-v1').then((cache) => {
                    return cache.addAll([
                        '/',
                        '/index.html',
                        '/style.css',
                        '/script.js',
                        '/manifest.json'
                    ]);
                })
            );
        });
        
        self.addEventListener('fetch', (event) => {
            event.respondWith(
                caches.match(event.request).then((response) => {
                    return response || fetch(event.request);
                })
            );
        });
    `;
    
    // Регистрация Service Worker
    navigator.serviceWorker.register(
        URL.createObjectURL(new Blob([swCode], { type: 'application/javascript' }))
    );
}

// Manifest для PWA
const manifest = {
    "name": "BloodyButterfly Server",
    "short_name": "BloodyButterfly",
    "description": "Официальный сайт сервера BloodyButterfly - Новый Год 2026",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0a0a1a",
    "theme_color": "#d32f2f",
    "icons": [
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
};

// Добавление manifest в документ
const link = document.createElement('link');
link.rel = 'manifest';
link.href = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/json' }));
document.head.appendChild(link);

// Финальная инициализация дополнительных функций
setTimeout(() => {
    BloodyButterfly.setupSmoothScrolling();
    BloodyButterfly.setupFormAnimations();
    BloodyButterfly.setupParallaxEffects();
    BloodyButterfly.setupImageLazyLoading();
    BloodyButterfly.setupTooltips();
    BloodyButterfly.setupKeyboardNavigation();
    BloodyButterfly.setupPerformanceMonitoring();
    BloodyButterfly.setupErrorHandling();
    BloodyButterfly.setupAnalytics();
    BloodyButterfly.setupOfflineSupport();
    BloodyButterfly.setupPWAFeatures();
    BloodyButterfly.setupThemeSwitcher();
    BloodyButterfly.setupLanguageSwitcher();
    BloodyButterfly.setupAccessibility();
    BloodyButterfly.setupPrintStyles();
    
    console.log('✨ Все функции инициализированы!');
}, 1000);

// Глобальный обработчик ошибок для улучшения UX
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Глобальная ошибка:', { msg, url, lineNo, columnNo, error });
    BloodyButterfly.showNotification('Произошла непредвиденная ошибка. Пожалуйста, обновите страницу.', 'error');
    return false;
};

// Полифиллы для старых браузеров
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        }
        return this.indexOf(search, start) !== -1;
    };
}

// Функция для измерения производительности
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} выполнено за ${(end - start).toFixed(2)}ms`);
    return result;
}

// Экспорт объекта для глобального доступа
window.BloodyButterfly = BloodyButterfly;
