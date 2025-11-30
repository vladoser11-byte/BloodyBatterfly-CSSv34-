// Система бонусов с шансами
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

    // Генерация случайного бонуса с шансами
    generateRandomBonus() {
        const random = Math.random() * 100;
        
        // 50% шанс выпадения VIP, 50% шанс выпадения промокода
        if (random < 50) {
            // VIP статусы
            const vipRandom = Math.random() * 100;
            if (vipRandom < 50) {
                return { type: 'vip', duration: 10, name: 'VIP 10 минут' }; // 50%
            } else if (vipRandom < 75) {
                return { type: 'vip', duration: 20, name: 'VIP 20 минут' }; // 25%
            } else {
                return { type: 'vip', duration: 30, name: 'VIP 30 минут' }; // 15%
            }
        } else {
            // Промокоды
            const discountRandom = Math.random() * 100;
            if (discountRandom < 70) {
                return { type: 'discount', value: 10, name: 'Промокод 10%' }; // 70%
            } else if (discountRandom < 90) {
                return { type: 'discount', value: 20, name: 'Промокод 20%' }; // 20%
            } else if (discountRandom < 95) {
                return { type: 'discount', value: 30, name: 'Промокод 30%' }; // 5%
            } else {
                return { type: 'discount', value: 40, name: 'Промокод 40%' }; // 1%
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
            alert('Бонус уже был получен сегодня!');
            return;
        }

        // Генерируем случайный бонус
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
            
            // Применяем VIP статус
            this.currentUser.bonuses.isVip = true;
            this.currentUser.bonuses.vipExpires = reward.expiresAt;
        } else {
            const code = `BB${bonus.value}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            reward = {
                type: 'discount',
                name: `Скидка ${bonus.value}%`,
                discount: bonus.value,
                expiresAt: now + (60 * 60 * 1000), // 1 час
                obtainedAt: now,
                code: code
            };
            
            // Применяем скидку
            this.currentUser.bonuses.personalDiscount = Math.max(
                this.currentUser.bonuses.personalDiscount,
                bonus.value
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

        alert(`Покупка успешна! Сумма: ${finalPrice}₽${discount > 0 ? ` (скидка ${discount}%)` : ''}`);
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

// Добавьте навигацию для бонусов в существующую функцию
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
    // Добавляем обработчик для страницы бонусов
    document.querySelectorAll('.nav-link, .footer-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            if (pageId === 'bonus') {
                // Проверяем авторизацию при переходе на страницу бонусов
                bonusSystem.checkBonusAuth();
            }
            
            // Обновляем активные классы в навигации
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Переключаем страницы
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            
            // Прокрутка вверх
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});
