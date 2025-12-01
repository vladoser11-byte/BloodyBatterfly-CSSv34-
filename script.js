// Основной модуль сайта
const BloodyButterfly = {
    // Конфигурация
    config: {
        telegramChannel: "https://t.me/bloodybutterfly_official",
        promocodes: [
            { code: "BloodyBatterfly2026NewYers", discount: 20, type: "newyear" },
            { code: "GmaowG-thans)", discount: 15, type: "creator" },
            { code: "KILLMAKERHappyNewYers", discount: 25, type: "creator" },
            { code: "HappyNewYers", discount: 10, type: "newyear" },
            { code: "Meow", discount: 5, type: "special" },
            { code: "Bloody", discount: 30, type: "vip" },
            { code: "[BloodyBatteflytimeTOplay]", discount: 40, type: "special" },
            { code: "youSOgoodPlayer", discount: 15, type: "player" },
            { code: "2025-2026", discount: 10, type: "newyear" },
            { code: "Deeeeeeeep", discount: 35, type: "special" }
        ],
        defaultDiscount: 10, // Скидка для зарегистрированных пользователей
        avatars: [
            "fa-user-astronaut", "fa-robot", "fa-user-ninja", "fa-user-secret",
            "fa-gamepad", "fa-ghost", "fa-dragon", "fa-space-shuttle",
            "fa-jedi", "fa-sith", "fa-helmet-battle", "fa-user-visor",
            "fa-android", "fa-cat", "fa-dog", "fa-crow"
        ]
    },

    // Состояние приложения
    state: {
        user: null,
        isAuthenticated: false,
        emailVerified: false,
        userDiscount: 0,
        selectedAvatar: "fa-user-astronaut",
        usedPromocodes: [],
        activePromocodes: []
    },

    // Инициализация
    init() {
        console.log("🎮 BloodyButterfly Server - ClientMod V34 🎮");
        
        this.setupEventListeners();
        this.setupBackgroundEffects();
        this.checkAuthStatus();
        this.updateServerStats();
        this.setupAnimations();
        this.setupNotifications();
        this.setupBonusSystem();
        this.setupPasswordValidation();
        this.setupPromocodeSystem();
        this.setupAvatarSystem();
        
        this.startAnimations();
        
        console.log("✅ Система инициализирована успешно!");
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
        document.getElementById('activatePromocodeBtn').addEventListener('click', () => this.activateManualPromocode());
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => this.copyPromocode());
        });

        // Промокодный дроп
        document.getElementById('promocodeDrop').addEventListener('click', () => this.showRandomPromocode());

        // Кнопки доната (переход в Telegram)
        document.querySelectorAll('.buy-btn[data-package]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDonateClick(e));
        });

        // Профиль
        document.getElementById('changeAvatarBtn').addEventListener('click', () => this.showAvatarModal());
        document.getElementById('changeNicknameBtn').addEventListener('click', () => this.showNicknameModal());
        document.getElementById('changePasswordBtn').addEventListener('click', () => this.showPasswordModal());
        document.getElementById('verifyEmailBtn').addEventListener('click', () => this.showEmailModal());

        // Модальные окна
        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.dataset.modal;
                this.hideModal(modal);
            });
        });

        // Закрытие модальных окон
        document.querySelector('.close-modal').addEventListener('click', () => this.hidePromocodeModal());
        document.querySelector('.close-avatar').addEventListener('click', () => this.hideAvatarModal());

        // Подтверждение изменений
        document.getElementById('submitNicknameChange')?.addEventListener('click', () => this.changeNickname());
        document.getElementById('submitPasswordChange')?.addEventListener('click', () => this.changePassword());
        document.getElementById('submitVerificationCode')?.addEventListener('click', () => this.verifyEmail());
        document.getElementById('resendVerificationCode')?.addEventListener('click', () => this.resendVerificationCode());

        // Обновление статистики
        setInterval(() => this.updateServerStats(), 30000);

        // Обработка нажатий вне модальных окон
        window.addEventListener('click', (e) => this.handleOutsideClick(e));
    },

    // Система промокодов
    setupPromocodeSystem() {
        // Загрузка использованных промокодов
        const savedPromocodes = localStorage.getItem('bloodyButterflyUsedPromocodes');
        if (savedPromocodes) {
            this.state.usedPromocodes = JSON.parse(savedPromocodes);
        }

        // Загрузка активных промокодов
        const activePromocodes = localStorage.getItem('bloodyButterflyActivePromocodes');
        if (activePromocodes) {
            this.state.activePromocodes = JSON.parse(activePromocodes);
        }

        // Отображение промокодов
        this.renderPromocodes();
        this.updateUserPromocodes();
    },

    // Отображение промокодов
    renderPromocodes() {
        const container = document.getElementById('promocodeSystem');
        if (!container) return;

        let html = '';
        this.config.promocodes.forEach((promo, index) => {
            const isUsed = this.state.usedPromocodes.includes(promo.code);
            const isActive = this.state.activePromocodes.some(p => p.code === promo.code);
            
            html += `
                <div class="promocode-card ${isUsed ? 'used' : ''} ${isActive ? 'active' : ''}" data-code="${promo.code}">
                    <div class="promocode-header">
                        <div class="promocode-type">${this.getPromoTypeName(promo.type)}</div>
                        <div class="promocode-discount">-${promo.discount}%</div>
                    </div>
                    <div class="promocode-code">${promo.code}</div>
                    <div class="promocode-details">
                        <div><i class="fas fa-calendar"></i> Активен до: 31.12.2024</div>
                        <div><i class="fas fa-tag"></i> Тип: ${this.getPromoTypeName(promo.type)}</div>
                    </div>
                    <button class="copy-promocode-btn ${isUsed ? 'copied' : ''}" data-code="${promo.code}">
                        <i class="fas fa-${isUsed ? 'check' : 'copy'}"></i>
                        ${isUsed ? 'ИСПОЛЬЗОВАН' : 'СКОПИРОВАТЬ'}
                    </button>
                    ${isActive ? '<div class="promocode-timer">АКТИВЕН</div>' : ''}
                </div>
            `;
        });

        container.innerHTML = html;

        // Добавление обработчиков для кнопок копирования
        container.querySelectorAll('.copy-promocode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.closest('.promocode-card').dataset.code;
                this.copyPromocodeToClipboard(code);
            });
        });

        // Добавление обработчиков для активации кликом
        container.querySelectorAll('.promocode-card:not(.used)').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('copy-promocode-btn')) {
                    const code = card.dataset.code;
                    this.activatePromocode(code);
                }
            });
        });
    },

    // Получение имени типа промокода
    getPromoTypeName(type) {
        const types = {
            'newyear': 'НОВОГОДНИЙ',
            'creator': 'ОТ СОЗДАТЕЛЯ',
            'special': 'СПЕЦИАЛЬНЫЙ',
            'vip': 'VIP',
            'player': 'ДЛЯ ИГРОКА'
        };
        return types[type] || 'СТАНДАРТНЫЙ';
    },

    // Копирование промокода в буфер обмена
    copyPromocodeToClipboard(code) {
        navigator.clipboard.writeText(code).then(() => {
            this.showNotification(`Промокод "${code}" скопирован!`, 'success');
            
            // Отметка как использованного
            if (!this.state.usedPromocodes.includes(code)) {
                this.state.usedPromocodes.push(code);
                localStorage.setItem('bloodyButterflyUsedPromocodes', JSON.stringify(this.state.usedPromocodes));
                this.renderPromocodes();
            }
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            this.showNotification('Ошибка копирования', 'error');
        });
    },

    // Активация промокода
    activatePromocode(code) {
        if (!this.state.isAuthenticated) {
            this.showNotification('Для активации промокода необходимо войти в систему', 'warning');
            this.showAuthModal();
            return;
        }

        const promo = this.config.promocodes.find(p => p.code === code);
        if (!promo) {
            this.showNotification('Неверный промокод', 'error');
            return;
        }

        if (this.state.usedPromocodes.includes(code)) {
            this.showNotification('Этот промокод уже использован', 'warning');
            return;
        }

        // Проверка на активацию такого же типа промокода
        const hasSameType = this.state.activePromocodes.some(p => {
            const promoType = this.config.promocodes.find(cp => cp.code === p.code)?.type;
            return promoType === promo.type;
        });

        if (hasSameType) {
            this.showNotification('Промокод этого типа уже активен', 'warning');
            return;
        }

        // Активация промокода
        this.state.activePromocodes.push({
            code: promo.code,
            discount: promo.discount,
            activatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 дней
        });

        localStorage.setItem('bloodyButterflyActivePromocodes', JSON.stringify(this.state.activePromocodes));

        // Обновление скидки пользователя
        this.updateUserDiscount();
        
        // Отметка как использованного
        this.state.usedPromocodes.push(code);
        localStorage.setItem('bloodyButterflyUsedPromocodes', JSON.stringify(this.state.usedPromocodes));

        this.showNotification(`Промокод активирован! Скидка ${promo.discount}% применена!`, 'success');
        this.renderPromocodes();
        this.updateUserPromocodes();
    },

    // Активация промокода вручную
    activateManualPromocode() {
        const input = document.getElementById('manualPromocode');
        const code = input.value.trim();
        
        if (!code) {
            this.showNotification('Введите промокод', 'error');
            return;
        }

        this.activatePromocode(code);
        input.value = '';
    },

    // Обновление скидки пользователя
    updateUserDiscount() {
        if (!this.state.isAuthenticated) {
            this.state.userDiscount = 0;
            return;
        }

        // Базовая скидка для зарегистрированных
        let discount = this.config.defaultDiscount;
        
        // Добавление скидки от активных промокодов
        this.state.activePromocodes.forEach(promo => {
            discount += promo.discount;
        });

        // Максимальная скидка 70%
        this.state.userDiscount = Math.min(discount, 70);
        
        // Сохранение в профиль пользователя
        if (this.state.user) {
            this.state.user.discount = this.state.userDiscount;
            localStorage.setItem('bloodyButterflyUser', JSON.stringify(this.state.user));
        }

        // Обновление отображения
        this.updateDiscountDisplay();
    },

    // Обновление отображения скидки
    updateDiscountDisplay() {
        // В профиле
        const discountElement = document.getElementById('userDiscount');
        if (discountElement) {
            discountElement.textContent = `${this.state.userDiscount}%`;
        }

        // В бейдже
        const discountBadge = document.getElementById('autoDiscountBadge');
        const discountPercent = document.getElementById('autoDiscountPercent');
        
        if (this.state.isAuthenticated && this.state.userDiscount > 0) {
            discountBadge.classList.add('active');
            discountPercent.textContent = `${this.state.userDiscount}%`;
        } else {
            discountBadge.classList.remove('active');
        }

        // В ценах на донат
        this.updateDonatePrices();
    },

    // Обновление цен с учетом скидки
    updateDonatePrices() {
        const prices = [
            { original: 399, discounted: 299, id: 1 },
            { original: 799, discounted: 599, id: 2 },
            { original: 1499, discounted: 1199, id: 3 }
        ];

        prices.forEach(price => {
            // Применение скидки пользователя
            const finalPrice = Math.round(price.discounted * (1 - this.state.userDiscount / 100));
            
            const priceElement = document.getElementById(`discountedPrice${price.id}`);
            const discountTag = document.getElementById(`discountTag${price.id}`);
            
            if (priceElement && discountTag) {
                priceElement.textContent = `${finalPrice} ₽`;
                
                // Расчет общего процента скидки
                const totalDiscount = Math.round((1 - finalPrice / price.original) * 100);
                discountTag.textContent = `-${totalDiscount}%`;
            }
        });
    },

    // Обновление списка промокодов пользователя
    updateUserPromocodes() {
        const container = document.getElementById('userPromocodes');
        if (!container) return;

        if (this.state.activePromocodes.length === 0) {
            container.innerHTML = '<p class="no-promocodes">У вас нет активных промокодов</p>';
            return;
        }

        let html = '<div class="user-promocode-list">';
        this.state.activePromocodes.forEach(promo => {
            const expires = new Date(promo.expiresAt).toLocaleDateString();
            html += `
                <div class="user-promocode-item">
                    <div class="user-promo-code">${promo.code}</div>
                    <div class="user-promo-discount">-${promo.discount}%</div>
                    <div class="user-promo-expires">Истекает: ${expires}</div>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    },

    // Показ случайного промокода (вместо Деда Мороза)
    showRandomPromocode() {
        if (!this.state.isAuthenticated) {
            this.showNotification('Для получения промокода необходимо войти в систему', 'warning');
            this.showAuthModal();
            return;
        }

        // Выбор случайного неиспользованного промокода
        const availablePromocodes = this.config.promocodes.filter(
            promo => !this.state.usedPromocodes.includes(promo.code)
        );

        if (availablePromocodes.length === 0) {
            this.showNotification('Все промокоды уже использованы!', 'info');
            return;
        }

        const randomPromo = availablePromocodes[Math.floor(Math.random() * availablePromocodes.length)];
        
        // Показ модального окна
        const modal = document.getElementById('promocodeModal');
        const promocodeText = document.getElementById('promocodeText');
        
        promocodeText.textContent = randomPromo.code;
        modal.classList.add('active');
        
        // Автоматическая активация через 3 секунды
        setTimeout(() => {
            this.activatePromocode(randomPromo.code);
        }, 3000);

        this.showNotification('🎁 Вы получили промокод! Он активируется автоматически.', 'success');
    },

    // Система аватаров
    setupAvatarSystem() {
        // Загрузка выбранного аватара
        const savedAvatar = localStorage.getItem('bloodyButterflyAvatar');
        if (savedAvatar) {
            this.state.selectedAvatar = savedAvatar;
            this.updateAvatarDisplay();
        }
    },

    // Показ модального окна выбора аватара
    showAvatarModal() {
        const modal = document.getElementById('avatarModal');
        const grid = document.getElementById('avatarGrid');
        
        if (!modal || !grid) return;

        // Заполнение сетки аватаров
        let html = '';
        this.config.avatars.forEach((avatar, index) => {
            const isSelected = avatar === this.state.selectedAvatar;
            html += `
                <div class="avatar-option ${isSelected ? 'selected' : ''}" data-avatar="${avatar}">
                    <i class="fas ${avatar}"></i>
                </div>
            `;
        });
        
        grid.innerHTML = html;

        // Добавление обработчиков выбора
        grid.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', (e) => {
                grid.querySelectorAll('.avatar-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.currentTarget.classList.add('selected');
            });
        });

        // Показ модального окна
        modal.classList.add('active');
    },

    // Скрытие модального окна аватара
    hideAvatarModal() {
        const modal = document.getElementById('avatarModal');
        modal.classList.remove('active');
    },

    // Обновление отображения аватара
    updateAvatarDisplay() {
        const avatarElement = document.getElementById('currentAvatar');
        if (avatarElement) {
            const icon = avatarElement.querySelector('i');
            if (icon) {
                icon.className = `fas ${this.state.selectedAvatar}`;
            }
        }
    },

    // Изменение аватара
    changeAvatar() {
        const selectedOption = document.querySelector('.avatar-option.selected');
        if (!selectedOption) {
            this.showNotification('Выберите аватар', 'warning');
            return;
        }

        const newAvatar = selectedOption.dataset.avatar;
        this.state.selectedAvatar = newAvatar;
        
        // Сохранение
        localStorage.setItem('bloodyButterflyAvatar', newAvatar);
        
        // Обновление отображения
        this.updateAvatarDisplay();
        
        // Закрытие модального окна
        this.hideAvatarModal();
        
        this.showNotification('Аватар успешно изменен!', 'success');
    },

    // Показ модального окна изменения ника
    showNicknameModal() {
        if (!this.state.isAuthenticated) {
            this.showNotification('Необходима авторизация', 'warning');
            return;
        }

        const modal = document.getElementById('nicknameModal');
        modal.classList.add('active');
    },

    // Показ модального окна изменения пароля
    showPasswordModal() {
        if (!this.state.isAuthenticated) {
            this.showNotification('Необходима авторизация', 'warning');
            return;
        }

        const modal = document.getElementById('passwordModal');
        modal.classList.add('active');
    },

    // Показ модального окна подтверждения email
    showEmailModal() {
        const modal = document.getElementById('emailModal');
        modal.classList.add('active');
    },

    // Скрытие модальных окон
    hideModal(modalName) {
        const modal = document.getElementById(`${modalName}Modal`);
        if (modal) {
            modal.classList.remove('active');
        }
    },

    // Изменение ника
    changeNickname() {
        const newNickname = document.getElementById('newNickname').value.trim();
        
        if (!newNickname) {
            this.showNotification('Введите новый ник', 'error');
            return;
        }

        if (newNickname.length < 3) {
            this.showNotification('Ник должен быть не менее 3 символов', 'error');
            return;
        }

        // Симуляция отправки кода подтверждения на email
        this.showLoading('Отправка кода подтверждения...');
        
        setTimeout(() => {
            this.hideLoading();
            this.showNotification('Код подтверждения отправлен на ваш email', 'success');
            this.hideModal('nickname');
            
            // Показ окна ввода кода
            this.showEmailModal();
        }, 1500);
    },

    // Изменение пароля
    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('Пароли не совпадают', 'error');
            return;
        }

        if (!this.validatePassword(newPassword)) {
            this.showNotification('Новый пароль не соответствует требованиям', 'error');
            return;
        }

        // Симуляция отправки кода подтверждения
        this.showLoading('Отправка кода подтверждения...');
        
        setTimeout(() => {
            this.hideLoading();
            this.showNotification('Код подтверждения отправлен на ваш email', 'success');
            this.hideModal('password');
            
            // Показ окна ввода кода
            this.showEmailModal();
        }, 1500);
    },

    // Подтверждение email
    verifyEmail() {
        const code = document.getElementById('verificationCode').value.trim();
        
        if (!code) {
            this.showNotification('Введите код подтверждения', 'error');
            return;
        }

        // Простая проверка кода (в реальном приложении была бы проверка с сервером)
        if (code.length === 6) {
            this.state.emailVerified = true;
            this.showNotification('Email успешно подтвержден!', 'success');
            this.hideModal('email');
            
            // Обновление статуса пользователя
            if (this.state.user) {
                this.state.user.emailVerified = true;
                localStorage.setItem('bloodyButterflyUser', JSON.stringify(this.state.user));
            }
        } else {
            this.showNotification('Неверный код подтверждения', 'error');
        }
    },

    // Повторная отправка кода подтверждения
    resendVerificationCode() {
        this.showLoading('Отправка кода...');
        
        setTimeout(() => {
            this.hideLoading();
            this.showNotification('Код подтверждения отправлен повторно', 'success');
        }, 1000);
    },

    // Обработка клика по кнопке доната (переход в Telegram)
    handleDonateClick(event) {
        event.preventDefault();
        const packageType = event.currentTarget.dataset.package;
        
        // Открытие Telegram канала
        window.open(this.config.telegramChannel, '_blank');
        
        // Логирование выбора пакета
        console.log(`Выбран пакет доната: ${packageType}`);
        this.showNotification('Переход в Telegram для оплаты...', 'info');
    },

    // Проверка статуса авторизации
    checkAuthStatus() {
        const savedUser = localStorage.getItem('bloodyButterflyUser');
        if (savedUser) {
            try {
                this.state.user = JSON.parse(savedUser);
                this.state.isAuthenticated = true;
                this.state.emailVerified = this.state.user.emailVerified || false;
                this.updateUserInterface();
                this.updateUserDiscount();
                this.showNotification('Подключение к системе восстановлено!', 'success');
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
            document.getElementById('userDiscount').textContent = `${this.state.userDiscount}%`;
            
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
        
        this.showLoading('Проверка данных...');
        
        setTimeout(() => {
            this.hideLoading();
            
            // Успешный вход
            this.state.user = {
                username,
                email: 'user@example.com',
                balance: 1000,
                vipUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                serverNickname: username,
                discount: this.config.defaultDiscount,
                emailVerified: false
            };
            
            this.state.isAuthenticated = true;
            localStorage.setItem('bloodyButterflyUser', JSON.stringify(this.state.user));
            
            this.updateUserInterface();
            this.updateUserDiscount();
            this.hideAuthModal();
            this.showNotification('Успешный вход! Добро пожаловать!', 'success');
            
            // Автоматическая скидка для зарегистрированных
            this.showNotification(`Вам автоматически начислена скидка ${this.config.defaultDiscount}%!`, 'success');
            
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
                discount: this.config.defaultDiscount,
                emailVerified: false,
                registeredAt: new Date().toISOString()
            };
            
            this.state.isAuthenticated = true;
            localStorage.setItem('bloodyButterflyUser', JSON.stringify(this.state.user));
            
            this.updateUserInterface();
            this.updateUserDiscount();
            this.hideAuthModal();
            this.showNotification('Регистрация успешна! Добро пожаловать!', 'success');
            
            // Автоматическая скидка для зарегистрированных
            this.showNotification(`Вам автоматически начислена скидка ${this.config.defaultDiscount}%!`, 'success');
            
            // Симуляция отправки email подтверждения
            this.sendConfirmationEmail(email, username);
            
        }, 2000);
    },

    // Выход из системы
    handleLogout() {
        this.state.user = null;
        this.state.isAuthenticated = false;
        this.state.userDiscount = 0;
        localStorage.removeItem('bloodyButterflyUser');
        
        this.updateUserInterface();
        this.updateDiscountDisplay();
        this.showNotification('Вы вышли из системы', 'info');
        
        // Переключение на главную вкладку
        document.querySelector('.nav-item[data-tab="home"]').click();
    },

    // Другие методы остаются такими же как в предыдущем коде...
    // (setupBackgroundEffects, checkServerConnection, validatePassword, validateEmail, 
    // sendConfirmationEmail, updateServerStats, animateCounter, setupBonusSystem,
    // claimDailyBonus, addVipTime, setupPasswordValidation, setupAnimations,
    // setupNotifications, showNotification, showLoading, hideLoading, 
    // handleOutsideClick, startAnimations, animateYearCounter, animateSnow,
    // animateLights, animateBackground, setupSmoothScrolling и т.д.)

    // Настройка анимаций для киберпанк фона
    setupBackgroundEffects() {
        // Кибер сетка
        const cyberGrid = document.querySelector('.cyber-grid');
        if (cyberGrid) {
            setInterval(() => {
                const x = Math.random() * 10 - 5;
                const y = Math.random() * 10 - 5;
                cyberGrid.style.transform = `translate(${x}px, ${y}px)`;
            }, 3000);
        }

        // Потоки данных
        const createDataStream = () => {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.style.cssText = `
                position: absolute;
                top: ${Math.random() * 100}%;
                left: -100px;
                width: ${Math.random() * 100 + 50}px;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--cyber-blue), transparent);
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: dataStreamFlow ${Math.random() * 5 + 3}s linear forwards;
            `;
            
            document.querySelector('.data-streams').appendChild(stream);
            
            setTimeout(() => {
                stream.remove();
            }, 5000);
        };

        // Создание потоков данных
        setInterval(createDataStream, 500);

        // Частицы
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'cyber-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: ${Math.random() > 0.5 ? 'var(--cyber-blue)' : 'var(--cyber-pink)'};
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: particleFloat ${Math.random() * 10 + 5}s linear infinite;
            `;
            
            document.querySelector('.particle-field').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 15000);
        };

        // Создание частиц
        for (let i = 0; i < 50; i++) {
            setTimeout(createParticle, i * 100);
        }
        setInterval(createParticle, 300);

        // Глитч эффект
        setInterval(() => {
            const glitch = document.querySelector('.glitch-overlay');
            if (glitch && Math.random() > 0.7) {
                glitch.style.opacity = '0.1';
                glitch.style.background = Math.random() > 0.5 ? 'var(--cyber-blue)' : 'var(--cyber-pink)';
                
                setTimeout(() => {
                    glitch.style.opacity = '0';
                }, 100);
            }
        }, 1000);

        // Добавление CSS анимаций
        const style = document.createElement('style');
        style.textContent = `
            @keyframes dataStreamFlow {
                0% {
                    transform: translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateX(calc(100vw + 100px));
                    opacity: 0;
                }
            }
            
            @keyframes particleFloat {
                0% {
                    transform: translate(0, 0);
                }
                25% {
                    transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px);
                }
                50% {
                    transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px);
                }
                75% {
                    transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px);
                }
                100% {
                    transform: translate(0, 0);
                }
            }
            
            @keyframes gridMove {
                0% {
                    background-position: 0 0;
                }
                100% {
                    background-position: 50px 50px;
                }
            }
            
            @keyframes gridPulse {
                0% {
                    opacity: 0.3;
                }
                100% {
                    opacity: 0.7;
                }
            }
            
            @keyframes hologramMove {
                0% {
                    transform: translateY(0);
                }
                100% {
                    transform: translateY(-100px);
                }
            }
            
            @keyframes glitchOverlay {
                0%, 100% {
                    opacity: 0;
                }
                50% {
                    opacity: 0.1;
                }
            }
            
            @keyframes buildingGlow {
                0%, 100% {
                    opacity: 0.3;
                }
                50% {
                    opacity: 0.7;
                }
            }
            
            @keyframes windowFlicker {
                0%, 100% {
                    opacity: 0.8;
                }
                50% {
                    opacity: 0.3;
                }
            }
            
            @keyframes hoverMove {
                0% {
                    transform: translateX(-100px);
                }
                100% {
                    transform: translateX(calc(100vw + 100px));
                }
            }
            
            @keyframes carLight {
                0%, 100% {
                    opacity: 0.5;
                }
                50% {
                    opacity: 1;
                }
            }
            
            @keyframes neonFlicker {
                0%, 100% {
                    opacity: 1;
                    filter: drop-shadow(0 0 10px var(--cyber-pink));
                }
                50% {
                    opacity: 0.8;
                    filter: drop-shadow(0 0 5px var(--cyber-pink));
                }
            }
            
            @keyframes hologramAd {
                0%, 100% {
                    transform: translateY(0) rotateX(0);
                }
                50% {
                    transform: translateY(-20px) rotateX(10deg);
                }
            }
            
            @keyframes dropPulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 20px var(--cyber-purple);
                }
                50% {
                    transform: scale(1.1);
                    box-shadow: 0 0 40px var(--cyber-purple), 0 0 60px var(--cyber-purple);
                }
            }
            
            @keyframes dropGlow {
                0%, 100% {
                    opacity: 0.3;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.7;
                    transform: scale(1.2);
                }
            }
            
            @keyframes textFloat {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-5px);
                }
            }
            
            @keyframes discountPulse {
                0%, 100% {
                    background: var(--cyber-red);
                }
                50% {
                    background: var(--cyber-pink);
                }
            }
            
            @keyframes badgeFloat {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                }
                50% {
                    transform: translateY(-10px) rotate(2deg);
                }
            }
            
            @keyframes badgeAppear {
                0% {
                    opacity: 0;
                    transform: scale(0.8) translateY(50px);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
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
        this.showNotification(`Код подтверждения отправлен на ${email}`, 'info');
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

    // Обновление статистики сервера
    updateServerStats() {
        // Симуляция обновления статистики
        const onlineChange = Math.floor(Math.random() * 100) - 50;
        const giftsChange = Math.floor(Math.random() * 50);
        
        this.state.serverStats = this.state.serverStats || { online: 1278, giftsToday: 356 };
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

    // Настройка валидации пароля
    setupPasswordValidation() {
        const passwordInput = document.getElementById('regPassword');
        
        passwordInput?.addEventListener('input', () => {
            const password = passwordInput.value;
            const requirements = document.querySelectorAll('.password-requirements li');
            
            if (requirements.length >= 4) {
                // Проверка длины
                requirements[0].classList.toggle('valid', password.length >= 8);
                
                // Проверка английских букв
                requirements[1].classList.toggle('valid', /[a-zA-Z]/.test(password));
                
                // Проверка специальных символов
                requirements[2].classList.toggle('valid', /[$!@#%^&*]/.test(password));
                
                // Проверка сложности
                const isTooSimple = /^(123456789|qwerty|password|admin|123456|12345678)$/i.test(password);
                requirements[3].classList.toggle('valid', !isTooSimple);
            }
        });
    },

    // Система бонусов
    setupBonusSystem() {
        // Проверка ежедневного бонуса
        const lastBonusDate = localStorage.getItem('lastBonusDate');
        const today = new Date().toDateString();
        
        if (lastBonusDate === today) {
            this.state.dailyBonusClaimed = true;
            const claimBtn = document.getElementById('claimBonus');
            if (claimBtn) {
                claimBtn.disabled = true;
                claimBtn.innerHTML = '<i class="fas fa-check"></i><span>БОНУС ПОЛУЧЕН</span>';
            }
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
                
                const promocode = `BONUS${selectedDiscount.percent}OFF${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
                reward = `Промокод на скидку ${selectedDiscount.percent}%`;
                this.activatePromocode(promocode);
            }
            
            // Сохранение статуса бонуса
            this.state.dailyBonusClaimed = true;
            localStorage.setItem('lastBonusDate', new Date().toDateString());
            
            const claimBtn = document.getElementById('claimBonus');
            if (claimBtn) {
                claimBtn.disabled = true;
                claimBtn.innerHTML = '<i class="fas fa-check"></i><span>БОНУС ПОЛУЧЕН</span>';
            }
            
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
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Сброс форм
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        
        // Показ формы входа по умолчанию
        this.switchAuthTab({ currentTarget: document.querySelector('.auth-tab[data-auth="login"]') });
    },

    // Скрытие модального окна авторизации
    hideAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
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

    // Показ уведомления
    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        container.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Обработчик закрытия
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    },

    // Получение иконки для уведомления
    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    },

    // Показать загрузку
    showLoading(message = 'Загрузка...') {
        let loading = document.getElementById('loading-overlay');
        
        if (!loading) {
            loading = document.createElement('div');
            loading.id = 'loading-overlay';
            loading.innerHTML = `
                <div class="loading-content">
                    <div class="cyber-loader"></div>
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
                    background: rgba(10, 10, 15, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(10px);
                }
                
                .cyber-loader {
                    width: 60px;
                    height: 60px;
                    border: 4px solid transparent;
                    border-top: 4px solid var(--cyber-blue);
                    border-right: 4px solid var(--cyber-pink);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                
                .loading-text {
                    font-family: 'Orbitron', sans-serif;
                    color: var(--cyber-blue);
                    font-size: 1.2rem;
                    text-shadow: 0 0 10px currentColor;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
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
        
        // Закрытие модального окна аватара
        const avatarModal = document.getElementById('avatarModal');
        if (avatarModal && event.target === avatarModal) {
            this.hideAvatarModal();
        }
        
        // Закрытие других модальных окон
        ['nickname', 'password', 'email'].forEach(modal => {
            const modalElement = document.getElementById(`${modal}Modal`);
            if (modalElement && event.target === modalElement) {
                this.hideModal(modal);
            }
        });
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

    // Запуск всех анимаций
    startAnimations() {
        // Анимация счетчика лет
        this.animateYearCounter();
        
        // Анимация неоновых вывесок
        this.animateNeonSigns();
        
        // Анимация кибер-эффектов
        this.animateCyberEffects();
    },

    // Анимация счетчика лет
    animateYearCounter() {
        const elements = document.querySelectorAll('.cyber-text');
        elements.forEach(el => {
            setInterval(() => {
                el.style.textShadow = `
                    0 0 10px var(--cyber-blue),
                    0 0 20px var(--cyber-blue),
                    0 0 30px var(--cyber-blue)
                `;
                
                setTimeout(() => {
                    el.style.textShadow = `
                        0 0 10px var(--cyber-pink),
                        0 0 20px var(--cyber-pink),
                        0 0 30px var(--cyber-pink)
                    `;
                }, 1000);
            }, 2000);
        });
    },

    // Анимация неоновых вывесок
    animateNeonSigns() {
        const signs = document.querySelectorAll('.neon-sign');
        signs.forEach(sign => {
            setInterval(() => {
                const colors = ['var(--cyber-blue)', 'var(--cyber-pink)', 'var(--cyber-green)'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                sign.style.color = randomColor;
            }, 3000);
        });
    },

    // Анимация кибер-эффектов
    animateCyberEffects() {
        const effects = document.querySelectorAll('.cyber-effects');
        effects.forEach(effect => {
            setInterval(() => {
                const lines = effect.querySelectorAll('.cyber-line');
                lines.forEach(line => {
                    line.style.width = `${Math.random() * 100}%`;
                    line.style.background = Math.random() > 0.5 ? 
                        'linear-gradient(90deg, transparent, var(--cyber-blue), transparent)' :
                        'linear-gradient(90deg, transparent, var(--cyber-pink), transparent)';
                });
            }, 1000);
        });
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    BloodyButterfly.init();
    
    // Добавление обработчика для кнопки подтверждения аватара
    document.getElementById('confirmAvatarBtn')?.addEventListener('click', () => {
        BloodyButterfly.changeAvatar();
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
            BloodyButterfly.showNotification(`Добавлено ${amount} кредитов!`, 'success');
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
    },
    activateAllPromocodes: () => {
        BloodyButterfly.config.promocodes.forEach(promo => {
            if (!BloodyButterfly.state.usedPromocodes.includes(promo.code)) {
                BloodyButterfly.activatePromocode(promo.code);
            }
        });
    }
};
