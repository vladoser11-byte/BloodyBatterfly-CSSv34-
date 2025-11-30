// Инициализация снега
function initSnow() {
    const container = document.getElementById('snowflakes');
    const snowflakeCount = 50;
    const snowflakes = ['❄', '❅', '❆', '•', '✦'];
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        snowflake.style.left = Math.random() * 100 + 'vw';
        const delay = Math.random() * 15;
        const duration = 8 + Math.random() * 12;
        snowflake.style.animationDelay = delay + 's';
        snowflake.style.animationDuration = duration + 's';
        const size = Math.random() * 20 + 15;
        snowflake.style.fontSize = size + 'px';
        
        container.appendChild(snowflake);
    }
}

// Инициализация частиц
function initParticles() {
    const container = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 20 + 's';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        const colors = ['#ff0066', '#ff0000', '#ffd700', '#00ff00'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(particle);
    }
}

// Таймер ежедневных подарков
function updateDailyTimer() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const timerElement = document.getElementById('dailyTimer');
    if (timerElement) {
        timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Навигация по страницам
function initNavigation() {
    document.querySelectorAll('.nav-link, .footer-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Показать страницу
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Копирование IP адреса
function copyIP() {
    const ip = 'connect bloody-butterfly.com:27015';
    navigator.clipboard.writeText(ip).then(() => {
        showMessage('✅ IP скопирован в буфер обмена!', 'success');
    }).catch(() => {
        showMessage('Ошибка копирования', 'error');
    });
}

// Перенаправление в Telegram
function redirectToTelegram(type) {
    const telegramUrl = 'https://t.me/bloody_butterfly_cs2';
    const links = {
        'basic': telegramUrl, 'advanced': telegramUrl, 'premium': telegramUrl,
        'join': telegramUrl, 'chat': telegramUrl, 'news': telegramUrl,
        'support': telegramUrl, 'rules': telegramUrl, 'faq': telegramUrl,
        'bugs': telegramUrl, 'suggestions': telegramUrl, 'appeal': telegramUrl,
        'main': telegramUrl, 'admin': telegramUrl
    };
    
    window.open(links[type] || telegramUrl, '_blank');
}

// Система бонусов с email подтверждением
class BonusSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('bonus_users') || '{}');
        this.sessions = JSON.parse(localStorage.getItem('bonus_sessions') || '{}');
        this.emailCodes = JSON.parse(localStorage.getItem('email_codes') || '{}');
        this.currentUser = null;
        this.currentSession = null;
        this.pendingRegistration = null;
        this.init();
    }

    init() {
        this.checkBonusAuth();
        setInterval(() => this.updateBonusTimers(), 1000);
        this.initCodeInputs();
    }

    // Валидация пароля
    validatePassword(password) {
        const weakPasswords = [
            '123456', '123456789', 'password', '12345678', '111111',
            '1234567', '123123', '000000', '1234567890', 'qwerty',
            'abc123', 'password1', '12345', '1234', '123'
        ];
        
        if (password.length < 6) {
            return { valid: false, message: 'Пароль должен быть не менее 6 символов' };
        }
        
        if (weakPasswords.includes(password.toLowerCase())) {
            return { valid: false, message: 'Слишком простой пароль. Используйте английские буквы и символы' };
        }
        
        if (/^\d+$/.test(password)) {
            return { valid: false, message: 'Пароль не может состоять только из цифр' };
        }
        
        if (!/[a-zA-Z]/.test(password)) {
            return { valid: false, message: 'Добавьте английские буквы в пароль' };
        }
        
        return { valid: true, message: 'Пароль надежный' };
    }

    // Генерация кода подтверждения
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Отправка кода на email (эмуляция)
    sendVerificationCode(email, code) {
        console.log(`📧 Код подтверждения отправлен на ${email}: ${code}`);
        // В реальном приложении здесь был бы запрос к email сервису
        
        // Сохраняем код
        this.emailCodes[email] = {
            code: code,
            expires: Date.now() + 10 * 60 * 1000, // 10 минут
            attempts: 0
        };
        localStorage.setItem('email_codes', JSON.stringify(this.emailCodes));
        
        showMessage(`Код подтверждения отправлен на ${email}`, 'success');
        return true;
    }

    // Проверка кода подтверждения
    verifyEmailCode(email, code) {
        const emailData = this.emailCodes[email];
        if (!emailData) {
            return { success: false, error: 'Код не найден. Запросите новый код.' };
        }
        
        if (Date.now() > emailData.expires) {
            delete this.emailCodes[email];
            localStorage.setItem('email_codes', JSON.stringify(this.emailCodes));
            return { success: false, error: 'Код истек. Запросите новый код.' };
        }
        
        if (emailData.attempts >= 5) {
            delete this.emailCodes[email];
            localStorage.setItem('email_codes', JSON.stringify(this.emailCodes));
            return { success: false, error: 'Слишком много попыток. Запросите новый код.' };
        }
        
        emailData.attempts++;
        localStorage.setItem('email_codes', JSON.stringify(this.emailCodes));
        
        if (emailData.code !== code) {
            return { success: false, error: `Неверный код. Осталось попыток: ${5 - emailData.attempts}` };
        }
        
        // Код верный
        delete this.emailCodes[email];
        localStorage.setItem('email_codes', JSON.stringify(this.emailCodes));
        return { success: true };
    }

    // Регистрация
    register(nickname, email, password, confirmPassword) {
        if (nickname.length < 3) {
            return { success: false, error: 'Никнейм должен быть не менее 3 символов' };
        }
        
        if (!this.isValidEmail(email)) {
            return { success: false, error: 'Введите корректный email адрес' };
        }
        
        if (password !== confirmPassword) {
            return { success: false, error: 'Пароли не совпадают' };
        }
        
        const passwordValidation = this.validatePassword(password);
        if (!passwordValidation.valid) {
            return { success: false, error: passwordValidation.message };
        }
        
        if (this.users[nickname]) {
            return { success: false, error: 'Пользователь с таким ником уже существует' };
        }
        
        // Проверяем email
        for (const user of Object.values(this.users)) {
            if (user.data.email === email) {
                return { success: false, error: 'Пользователь с таким email уже существует' };
            }
        }

        // Сохраняем данные для подтверждения
        this.pendingRegistration = {
            nickname: nickname,
            email: email,
            password: btoa(password),
            timestamp: Date.now()
        };

        // Генерируем и отправляем код
        const code = this.generateVerificationCode();
        this.sendVerificationCode(email, code);

        return { success: true };
    }

    // Завершение регистрации после подтверждения email
    completeRegistration() {
        if (!this.pendingRegistration) {
            return { success: false, error: 'Нет данных для регистрации' };
        }

        const { nickname, email, password } = this.pendingRegistration;

        this.users[nickname] = {
            password: password,
            data: {
                nickname: nickname,
                email: email,
                emailVerified: true,
                registrationDate: Date.now(),
                bonuses: {
                    lastClaim: null,
                    activeBonuses: [],
                    personalDiscount: 0,
                    isVip: false,
                    vipExpires: null
                },
                notifications: {
                    bonusReady: true,
                    news: true,
                    promotions: true
                }
            }
        };

        this.saveData();
        this.pendingRegistration = null;

        // Отправляем приветственное письмо (эмуляция)
        this.sendWelcomeEmail(email, nickname);

        return { success: true, userData: this.users[nickname].data };
    }

    // Отправка приветственного письма
    sendWelcomeEmail(email, nickname) {
        console.log(`📧 Приветственное письмо отправлено на ${email} для пользователя ${nickname}`);
        // В реальном приложении здесь был бы запрос к email сервису
    }

    // Отправка уведомления о готовности бонуса
    sendBonusReadyNotification(userData) {
        if (userData.notifications.bonusReady) {
            console.log(`📧 Уведомление о готовности бонуса отправлено на ${userData.email} для ${userData.nickname}`);
            // В реальном приложении здесь был бы запрос к email сервису
        }
    }

    // Валидация email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Вход
    login(nickname, password) {
        const user = this.users[nickname];
        if (!user) {
            return { success: false, error: 'Пользователь не найден' };
        }
        if (user.password !== btoa(password)) {
            return { success: false, error: 'Неверный пароль' };
        }

        const sessionId = 'bonus_session_' + Date.now();
        this.sessions[sessionId] = {
            nickname: nickname,
            expires: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };

        this.saveData();
        return { success: true, sessionId: sessionId, userData: user.data };
    }

    // Проверка авторизации
    checkBonusAuth() {
        const sessionId = localStorage.getItem('currentBonusSession');
        if (sessionId) {
            const session = this.sessions[sessionId];
            if (session && session.expires > Date.now()) {
                this.currentSession = sessionId;
                this.currentUser = this.users[session.nickname]?.data;
                this.showBonusInterface();
            }
        }
    }

    // Показать интерфейс бонусов
    showBonusInterface() {
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('bonusInterface').classList.remove('hidden');
        document.getElementById('userNickDisplay').textContent = this.currentUser.nickname;
        this.updateUserStats();
        this.updateBonusTimer();
        this.updateActiveBonuses();
        this.updateShopPrices();
    }

    // Выход
    logout() {
        this.currentUser = null;
        this.currentSession = null;
        localStorage.removeItem('currentBonusSession');
        document.getElementById('authSection').classList.remove('hidden');
        document.getElementById('bonusInterface').classList.add('hidden');
        showMessage('Вы вышли из системы', 'info');
    }

    // Генерация случайного бонуса с шансами
    generateRandomBonus() {
        const random = Math.random() * 100;
        
        if (random < 50) {
            const vipRandom = Math.random() * 100;
            if (vipRandom < 50) {
                return { type: 'vip', duration: 10, name: 'VIP 10 минут' };
            } else if (vipRandom < 75) {
                return { type: 'vip', duration: 20, name: 'VIP 20 минут' };
            } else {
                return { type: 'vip', duration: 30, name: 'VIP 30 минут' };
            }
        } else {
            const discountRandom = Math.random() * 100;
            if (discountRandom < 70) {
                return { type: 'discount', value: 10, name: 'Промокод 10%' };
            } else if (discountRandom < 90) {
                return { type: 'discount', value: 20, name: 'Промокод 20%' };
            } else if (discountRandom < 95) {
                return { type: 'discount', value: 30, name: 'Промокод 30%' };
            } else {
                return { type: 'discount', value: 40, name: 'Промокод 40%' };
            }
        }
    }

    // Получить ежедневный бонус
    claimDailyBonus() {
        if (!this.currentUser) return;

        const now = Date.now();
        const lastClaim = this.currentUser.bonuses.lastClaim;
        const cooldown = 24 * 60 * 60 * 1000;

        if (lastClaim && (now - lastClaim) < cooldown) {
            showMessage('Бонус уже был получен сегодня!', 'warning');
            return;
        }

        const bonus = this.generateRandomBonus();
        let reward;

        if (bonus.type === 'vip') {
            reward = {
                type: 'vip',
                name: `VIP статус ${bonus.duration} минут`,
                duration: bonus.duration,
                expiresAt: now + (bonus.duration * 60 * 1000),
                obtainedAt: now
            };
            
            this.currentUser.bonuses.isVip = true;
            this.currentUser.bonuses.vipExpires = reward.expiresAt;
        } else {
            const code = `BB${bonus.value}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            reward = {
                type: 'discount',
                name: `Скидка ${bonus.value}%`,
                discount: bonus.value,
                expiresAt: now + (60 * 60 * 1000),
                obtainedAt: now,
                code: code
            };
            
            this.currentUser.bonuses.personalDiscount = Math.max(
                this.currentUser.bonuses.personalDiscount,
                bonus.value
            );
        }

        this.currentUser.bonuses.lastClaim = now;
        this.currentUser.bonuses.activeBonuses.push(reward);

        this.cleanExpiredBonuses();
        this.updateUserData();
        this.showRewardAnimation(reward);
        this.updateUserStats();
        this.updateActiveBonuses();
        this.updateShopPrices();
        this.updateBonusTimer();

        // Отправляем уведомление о получении бонуса
        this.sendBonusNotification(this.currentUser, reward);
    }

    // Отправка уведомления о получении бонуса
    sendBonusNotification(userData, reward) {
        if (userData.notifications.bonusReady) {
            console.log(`📧 Уведомление о получении бонуса отправлено на ${userData.email}`);
            // В реальном приложении здесь был бы запрос к email сервису
        }
    }

    // Очистка просроченных бонусов
    cleanExpiredBonuses() {
        const now = Date.now();
        this.currentUser.bonuses.activeBonuses = this.currentUser.bonuses.activeBonuses.filter(bonus => {
            if (!bonus.expiresAt) return true;
            if (bonus.expiresAt > now) return true;
            
            if (bonus.type === 'vip' && bonus.expiresAt <= now) {
                this.currentUser.bonuses.isVip = false;
                this.currentUser.bonuses.vipExpires = null;
            }
            
            if (bonus.type === 'discount' && bonus.expiresAt <= now) {
                this.currentUser.bonuses.personalDiscount = 0;
            }
            
            return false;
        });
    }

    // Показать анимацию награды
    showRewardAnimation(reward) {
        this.createConfetti();
        
        const modal = document.createElement('div');
        modal.className = 'modal-bonus';
        modal.innerHTML = `
            <div class="modal-bonus-content">
                <div class="reward-animation">${reward.type === 'vip' ? '👑' : '🎫'}</div>
                <div class="reward-title">Поздравляем!</div>
                <div class="reward-description">
                    ${reward.type === 'vip' 
                        ? `Вы получили <strong style="color: #ffd700">VIP статус на ${reward.duration} минут</strong>!<br>Особые привилегии активированы.` 
                        : `Вы получили <strong style="color: #00ff00">скидку ${reward.discount}%</strong>!<br>Промокод: <code style="background: rgba(255,215,0,0.3); padding: 5px 10px; border-radius: 5px; font-size: 1.2em;">${reward.code}</code>`}
                </div>
                <button class="auth-btn" onclick="this.closest('.modal-bonus').remove()" style="margin-top: 20px;">🎉 Ура!</button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Создать конфетти
    createConfetti() {
        const emojis = ['🎄', '🎁', '⭐', '🔴', '🟢', '🔵', '🎅', '🤶'];
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
                confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }, i * 100);
        }
    }

    // Инициализация ввода кода
    initCodeInputs() {
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('code-input')) {
                const input = e.target;
                const index = parseInt(input.getAttribute('data-index'));
                const value = input.value;
                
                if (value && index < 5) {
                    const nextInput = document.querySelector(`.code-input[data-index="${index + 1}"]`);
                    if (nextInput) nextInput.focus();
                }
                
                // Автопроверка при заполнении всех полей
                if (index === 5 && value) {
                    const allFilled = Array.from(document.querySelectorAll('.code-input')).every(input => input.value);
                    if (allFilled) {
                        setTimeout(() => verifyEmailCode(), 300);
                    }
                }
            }
        });
        
        // Обработка backspace
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.classList.contains('code-input')) {
                const input = e.target;
                const index = parseInt(input.getAttribute('data-index'));
                
                if (!input.value && index > 0) {
                    const prevInput = document.querySelector(`.code-input[data-index="${index - 1}"]`);
                    if (prevInput) prevInput.focus();
                }
            }
        });
    }

    // Обновить таймер бонуса
    updateBonusTimer() {
        if (!this.currentUser) return;

        const timerElement = document.getElementById('dailyBonusTimer');
        const progressBar = document.getElementById('bonusProgressBar');
        const claimButton = document.getElementById('claimBonusBtn');

        const now = Date.now();
        const lastClaim = this.currentUser.bonuses.lastClaim;
        const cooldown = 24 * 60 * 60 * 1000;

        if (!lastClaim) {
            timerElement.textContent = '🎁 Бонус доступен!';
            progressBar.style.width = '100%';
            claimButton.disabled = false;
            return;
        }

        const timeLeft = lastClaim + cooldown - now;

        if (timeLeft <= 0) {
            timerElement.textContent = '🎁 Бонус доступен!';
            progressBar.style.width = '100%';
            claimButton.disabled = false;
            
            // Отправляем уведомление о готовности бонуса
            this.sendBonusReadyNotification(this.currentUser);
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timerElement.textContent = `⏰ Следующий бонус через: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            const progress = 100 - (timeLeft / cooldown * 100);
            progressBar.style.width = `${progress}%`;
            claimButton.disabled = true;
        }
    }

    // Обновить статистику пользователя
    updateUserStats() {
        const vipStatus = document.getElementById('userVipStatus');
        const discountBadge = document.getElementById('userDiscountBadge');
        const discountValue = document.getElementById('userDiscountValue');

        const isVip = this.currentUser.bonuses.isVip && this.currentUser.bonuses.vipExpires > Date.now();
        const discount = this.currentUser.bonuses.personalDiscount;

        if (isVip) {
            vipStatus.classList.remove('hidden');
        } else {
            vipStatus.classList.add('hidden');
        }

        if (discount > 0) {
            discountBadge.classList.remove('hidden');
            discountValue.textContent = discount;
        } else {
            discountBadge.classList.add('hidden');
        }
    }

    // Обновить активные бонусы
    updateActiveBonuses() {
        if (!this.currentUser) return;

        const bonusesList = document.getElementById('activeBonusesList');
        const activeBonuses = this.getActiveBonuses();

        if (activeBonuses.length === 0) {
            bonusesList.innerHTML = '<div class="bonus-item"><p>Нет активных бонусов</p></div>';
            return;
        }

        bonusesList.innerHTML = activeBonuses.map(bonus => {
            const timeLeft = bonus.expiresAt ? this.formatTime(bonus.expiresAt - Date.now()) : null;
            const isVip = bonus.type === 'vip';
            
            return `
                <div class="bonus-item ${isVip ? 'vip' : 'discount'}">
                    <h4>${isVip ? '👑' : '🎫'} ${bonus.name}</h4>
                    ${bonus.code ? `<div class="bonus-code">${bonus.code}</div>` : ''}
                    ${timeLeft ? `<div class="bonus-timer">⏰ Осталось: ${timeLeft}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    getActiveBonuses() {
        const now = Date.now();
        return this.currentUser.bonuses.activeBonuses.filter(bonus => 
            !bonus.expiresAt || bonus.expiresAt > now
        );
    }

    // Обновить цены в магазине
    updateShopPrices() {
        if (!this.currentUser) return;

        const discount = this.currentUser.bonuses.personalDiscount;
        const prices = {
            'vip1': 299,
            'weapon': 799,
            'premium': 1499
        };

        Object.keys(prices).forEach(itemId => {
            const element = document.getElementById(`price${itemId.charAt(0).toUpperCase() + itemId.slice(1)}`);
            if (element) {
                const originalPrice = prices[itemId];
                const finalPrice = Math.round(originalPrice * (1 - discount / 100));
                
                if (discount > 0) {
                    element.innerHTML = `<span class="original-price">${originalPrice}₽</span> <span class="discounted-price">${finalPrice}₽</span>`;
                } else {
                    element.innerHTML = `<span class="discounted-price">${originalPrice}₽</span>`;
                }
            }
        });
    }

    // Купить товар
    buyItem(itemId) {
        if (!this.currentUser) return;

        const prices = {
            'vip1': 299,
            'weapon': 799,
            'premium': 1499
        };

        const discount = this.currentUser.bonuses.personalDiscount;
        const originalPrice = prices[itemId];
        const finalPrice = Math.round(originalPrice * (1 - discount / 100));

        showMessage(`Покупка успешна! Сумма: ${finalPrice}₽${discount > 0 ? ` (скидка ${discount}%)` : ''}`, 'success');
    }

    // Вспомогательные методы
    formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        
        if (hours > 0) {
            return `${hours}ч ${minutes}м ${seconds}с`;
        } else if (minutes > 0) {
            return `${minutes}м ${seconds}с`;
        } else {
            return `${seconds}с`;
        }
    }

    updateBonusTimers() {
        if (this.currentUser) {
            this.cleanExpiredBonuses();
            this.updateBonusTimer();
            this.updateUserStats();
            this.updateActiveBonuses();
        }
    }

    updateUserData() {
        if (this.currentUser && this.currentSession) {
            const session = this.sessions[this.currentSession];
            if (session) {
                this.users[session.nickname].data = this.currentUser;
                this.saveData();
            }
        }
    }

    saveData() {
        localStorage.setItem('bonus_users', JSON.stringify(this.users));
        localStorage.setItem('bonus_sessions', JSON.stringify(this.sessions));
    }
}

// Инициализация системы бонусов
const bonusSystem = new BonusSystem();

// Глобальные функции для HTML
function bonusLogin() {
    const nick = document.getElementById('bonusNick').value.trim();
    const password = document.getElementById('bonusPassword').value;

    if (!nick || !password) {
        showMessage('Заполните все поля', 'error');
        return;
    }

    const result = bonusSystem.login(nick, password);
    if (result.success) {
        bonusSystem.currentSession = result.sessionId;
        bonusSystem.currentUser = result.userData;
        localStorage.setItem('currentBonusSession', result.sessionId);
        bonusSystem.showBonusInterface();
        
        document.getElementById('bonusNick').value = '';
        document.getElementById('bonusPassword').value = '';
        
        showMessage('Успешный вход!', 'success');
    } else {
        showMessage(result.error, 'error');
    }
}

function bonusLogout() {
    bonusSystem.logout();
}

// Показать страницу регистрации
function showRegisterPage() {
    showPage('register');
}

// Валидация шага 1
function validateStep1() {
    const nick = document.getElementById('regNick').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (!nick || !email || !password || !confirmPassword) {
        showMessage('Заполните все поля', 'error');
        return;
    }

    const result = bonusSystem.register(nick, email, password, confirmPassword);
    if (result.success) {
        // Переходим к шагу 2
        document.getElementById('step1').classList.remove('active');
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step2').classList.remove('hidden');
        document.getElementById('step2').classList.add('active');
        
        // Показываем email пользователя
        document.getElementById('userEmailDisplay').textContent = email;
        
        // Запускаем таймер для повторной отправки
        startResendTimer();
        
        showMessage('Код подтверждения отправлен на вашу почту', 'success');
    } else {
        showMessage(result.error, 'error');
    }
}

// Назад к шагу 1
function backToStep1() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step2').classList.add('hidden');
    document.getElementById('step1').classList.remove('hidden');
    document.getElementById('step1').classList.add('active');
}

// Проверка кода подтверждения
function verifyEmailCode() {
    const codeInputs = document.querySelectorAll('.code-input');
    const code = Array.from(codeInputs).map(input => input.value).join('');
    
    if (code.length !== 6) {
        showMessage('Введите 6-значный код', 'error');
        return;
    }

    const email = bonusSystem.pendingRegistration?.email;
    if (!email) {
        showMessage('Ошибка регистрации. Начните заново.', 'error');
        return;
    }

    const result = bonusSystem.verifyEmailCode(email, code);
    if (result.success) {
        // Завершаем регистрацию
        const finalResult = bonusSystem.completeRegistration();
        if (finalResult.success) {
            // Переходим к шагу 3
            document.getElementById('step2').classList.remove('active');
            document.getElementById('step2').classList.add('hidden');
            document.getElementById('step3').classList.remove('hidden');
            document.getElementById('step3').classList.add('active');
            
            // Показываем данные пользователя
            document.getElementById('successNick').textContent = finalResult.userData.nickname;
            document.getElementById('successEmail').textContent = finalResult.userData.email;
            document.getElementById('finalNick').textContent = finalResult.userData.nickname;
            
            showMessage('Email успешно подтвержден!', 'success');
        } else {
            showMessage(finalResult.error, 'error');
        }
    } else {
        showMessage(result.error, 'error');
    }
}

// Повторная отправка кода
function resendVerificationCode() {
    const email = bonusSystem.pendingRegistration?.email;
    if (!email) {
        showMessage('Ошибка отправки кода', 'error');
        return;
    }

    const code = bonusSystem.generateVerificationCode();
    bonusSystem.sendVerificationCode(email, code);
    startResendTimer();
}

// Таймер для повторной отправки
function startResendTimer() {
    const resendBtn = document.getElementById('resendBtn');
    const timer = document.getElementById('resendTimer');
    let timeLeft = 60;
    
    resendBtn.disabled = true;
    
    const countdown = setInterval(() => {
        timeLeft--;
        timer.textContent = `(${timeLeft})`;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            resendBtn.disabled = false;
            timer.textContent = '';
        }
    }, 1000);
}

// Завершение регистрации
function finishRegistration() {
    showPage('bonus');
    showMessage('Регистрация завершена! Теперь вы можете получать бонусы.', 'success');
}

// Показать сообщение
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `bonus-message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Обработка силы пароля
document.getElementById('regPassword')?.addEventListener('input', function(e) {
    const password = e.target.value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!password) {
        strengthIndicator.className = 'password-strength';
        return;
    }
    
    let strength = 'weak';
    if (password.length >= 8) strength = 'medium';
    if (password.length >= 10 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)) strength = 'strong';
    if (password.length >= 12 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) strength = 'very-strong';
    
    strengthIndicator.className = `password-strength ${strength}`;
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initSnow();
    initParticles();
    initNavigation();
    
    updateDailyTimer();
    setInterval(updateDailyTimer, 1000);
    
    document.addEventListener('mousemove', function(e) {
        const trees = document.querySelectorAll('.tree');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        trees.forEach((tree, index) => {
            const speed = (index + 1) * 0.3;
            const xMove = x * speed * 20;
            const yMove = y * speed * 10;
            tree.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    });
});

// Добавляем CSS для анимации уведомления
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .bonus-message {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
    
    .bonus-message.success {
        background: #00ff00;
        color: black;
        border-left: 4px solid #00cc00;
    }
    
    .bonus-message.error {
        background: #ff4444;
        color: white;
        border-left: 4px solid #cc0000;
    }
    
    .bonus-message.warning {
        background: #ffaa00;
        color: black;
        border-left: 4px solid #cc8800;
    }
    
    .bonus-message.info {
        background: #0088cc;
        color: white;
        border-left: 4px solid #006699;
    }
    
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(style);
