// Система бонусов
class BonusSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('bonus_users') || '{}');
        this.sessions = JSON.parse(localStorage.getItem('bonus_sessions') || '{}');
        this.currentUser = null;
        this.currentSession = null;
        this.init();
    }

    init() {
        this.checkBonusAuth();
        setInterval(() => this.updateBonusTimers(), 1000);
    }

    // Регистрация
    register(nickname, password) {
        if (nickname.length < 3) {
            return { success: false, error: 'Никнейм должен быть не менее 3 символов' };
        }
        if (password.length < 4) {
            return { success: false, error: 'Пароль должен быть не менее 4 символов' };
        }
        if (this.users[nickname]) {
            return { success: false, error: 'Пользователь уже существует' };
        }

        this.users[nickname] = {
            password: btoa(password),
            data: {
                nickname: nickname,
                registrationDate: Date.now(),
                bonuses: {
                    lastClaim: null,
                    activeBonuses: [],
                    personalDiscount: 0,
                    isVip: false,
                    vipExpires: null
                }
            }
        };

        this.saveData();
        return { success: true };
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
    }

    // Получить ежедневный бонус
    claimDailyBonus() {
        if (!this.currentUser) return;

        const now = Date.now();
        const lastClaim = this.currentUser.bonuses.lastClaim;
        const cooldown = 24 * 60 * 60 * 1000;

        if (lastClaim && (now - lastClaim) < cooldown) {
            alert('Бонус уже был получен сегодня!');
            return;
        }

        // Генерируем случайный бонус (ИЛИ VIP ИЛИ промокод)
        const bonusType = Math.random() > 0.5 ? 'vip' : 'discount';
        let reward;

        if (bonusType === 'vip') {
            const vipDurations = [10, 20, 30];
            const duration = vipDurations[Math.floor(Math.random() * vipDurations.length)];
            reward = {
                type: 'vip',
                name: `VIP статус ${duration} минут`,
                duration: duration,
                expiresAt: now + (duration * 60 * 1000),
                obtainedAt: now
            };
            
            // Применяем VIP статус
            this.currentUser.bonuses.isVip = true;
            this.currentUser.bonuses.vipExpires = reward.expiresAt;
        } else {
            const discountValues = [10, 20, 30, 40];
            const discount = discountValues[Math.floor(Math.random() * discountValues.length)];
            reward = {
                type: 'discount',
                name: `Скидка ${discount}%`,
                discount: discount,
                expiresAt: now + (60 * 60 * 1000), // 1 час
                obtainedAt: now,
                code: `BONUS${discount}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`
            };
            
            // Применяем скидку
            this.currentUser.bonuses.personalDiscount = Math.max(
                this.currentUser.bonuses.personalDiscount,
                discount
            );
        }

        // Обновляем данные
        this.currentUser.bonuses.lastClaim = now;
        this.currentUser.bonuses.activeBonuses.push(reward);

        // Очищаем просроченные бонусы
        this.cleanExpiredBonuses();

        // Сохраняем
        this.updateUserData();
        this.showRewardAnimation(reward);
        this.updateUserStats();
        this.updateActiveBonuses();
        this.updateShopPrices();
        this.updateBonusTimer();
    }

    // Очистка просроченных бонусов
    cleanExpiredBonuses() {
        const now = Date.now();
        this.currentUser.bonuses.activeBonuses = this.currentUser.bonuses.activeBonuses.filter(bonus => {
            if (!bonus.expiresAt) return true;
            if (bonus.expiresAt > now) return true;
            
            // Убираем VIP статус если истек
            if (bonus.type === 'vip' && bonus.expiresAt <= now) {
                this.currentUser.bonuses.isVip = false;
                this.currentUser.bonuses.vipExpires = null;
            }
            
            // Убираем скидку если истек
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
                        ? `Вы получили <strong>VIP статус на ${reward.duration} минут</strong>! Особые привилегии активированы.` 
                        : `Вы получили <strong>скидку ${reward.discount}%</strong>! Промокод: <code>${reward.code}</code>`}
                </div>
                <button class="auth-btn" onclick="this.closest('.modal-bonus').remove()">🎉 Ура!</button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Создать конфетти
    createConfetti() {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.background = this.getRandomColor();
                confetti.style.animation = `confetti ${Math.random() * 3 + 2}s linear forwards`;
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }, i * 100);
        }
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        return colors[Math.floor(Math.random() * colors.length)];
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
            'vip1': 200,
            'weapon': 500,
            'premium': 1000
        };

        Object.keys(prices).forEach(itemId => {
            const element = document.getElementById(`price${itemId.charAt(0).toUpperCase() + itemId.slice(1)}`);
            if (element) {
                const originalPrice = prices[itemId];
                const finalPrice = Math.round(originalPrice * (1 - discount / 100));
                
                if (discount > 0) {
                    element.innerHTML = `<span class="original-price">${originalPrice}₽</span> ${finalPrice}₽`;
                } else {
                    element.textContent = `${originalPrice}₽`;
                }
            }
        });
    }

    // Купить товар
    buyItem(itemId) {
        if (!this.currentUser) return;

        const prices = {
            'vip1': 200,
            'weapon': 500,
            'premium': 1000
        };

        const discount = this.currentUser.bonuses.personalDiscount;
        const originalPrice = prices[itemId];
        const finalPrice = Math.round(originalPrice * (1 - discount / 100));

        alert(`Покупка успешна! Сумма: ${finalPrice}₽${discount > 0 ? ` (скидка ${discount}%)` : ''}`);
    }

    // Вспомогательные методы
    formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        
        if (hours > 0) {
            return `${hours}ч ${minutes}м`;
        } else {
            return `${minutes}м ${seconds}с`;
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
        alert('Заполните все поля');
        return;
    }

    const result = bonusSystem.login(nick, password);
    if (result.success) {
        bonusSystem.currentSession = result.sessionId;
        bonusSystem.currentUser = result.userData;
        localStorage.setItem('currentBonusSession', result.sessionId);
        bonusSystem.showBonusInterface();
        
        // Очищаем поля
        document.getElementById('bonusNick').value = '';
        document.getElementById('bonusPassword').value = '';
    } else {
        alert(result.error);
    }
}

function bonusLogout() {
    bonusSystem.logout();
}

function showBonusRegister() {
    const nick = prompt('Введите никнейм (мин. 3 символа):');
    if (!nick || nick.length < 3) {
        alert('Никнейм должен быть не менее 3 символов');
        return;
    }

    const password = prompt('Введите пароль (мин. 4 символа):');
    if (!password || password.length < 4) {
        alert('Пароль должен быть не менее 4 символов');
        return;
    }

    const result = bonusSystem.register(nick, password);
    if (result.success) {
        alert('Регистрация успешна! Теперь войдите в систему.');
    } else {
        alert(result.error);
    }
}

function claimDailyBonus() {
    bonusSystem.claimDailyBonus();
}

function buyItem(itemId) {
    bonusSystem.buyItem(itemId);
}
