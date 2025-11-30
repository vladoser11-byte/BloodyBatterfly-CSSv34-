// script.js - BloodyButterfly DJN ClientMod V34 Новогодний 2026
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех систем
    initSnowAnimation();
    initSantaAnimation();
    initNavigation();
    initAuthSystem();
    initBonusWheel();
    initCountdown();
    initPasswordValidation();
    initModalWindows();
    initServerStatus();
    initAnimations();
    initParticles();
    initSoundEffects();
    initPerformanceOptimizer();
});

// ==================== СИСТЕМА АНИМАЦИИ СНЕГА ====================
function initSnowAnimation() {
    const snowContainer = document.querySelector('.snow-container');
    const snowflakes = ['❅', '❆', '•', '·'];
    
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
        snowflake.style.opacity = Math.random() * 0.7 + 0.3;
        snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
        snowflake.style.zIndex = Math.floor(Math.random() * 10);
        
        snowContainer.appendChild(snowflake);
        
        // Удаление снежинки после анимации
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.remove();
            }
        }, 15000);
    }
    
    // Создание снежинок каждые 100ms
    setInterval(createSnowflake, 100);
    
    // Начальное создание снежинок
    for (let i = 0; i < 30; i++) {
        setTimeout(createSnowflake, i * 100);
    }
}

// ==================== АНИМАЦИЯ ДЕДА МОРОЗА ====================
function initSantaAnimation() {
    const santa = document.getElementById('santa');
    const promoModal = document.getElementById('promoModal');
    const closePromo = document.getElementById('closePromo');
    const copyPromo = document.getElementById('copyPromo');
    const promoCode = document.getElementById('promoCode');
    
    let santaPosition = -200;
    let santaDirection = 1;
    let santaSpeed = 0.5;
    
    function animateSanta() {
        santaPosition += santaDirection * santaSpeed;
        
        if (santaPosition > 120) {
            santaDirection = -1;
            santa.style.transform = 'scaleX(-1)';
        } else if (santaPosition < -20) {
            santaDirection = 1;
            santa.style.transform = 'scaleX(1)';
        }
        
        santa.style.left = santaPosition + 'vw';
        santa.style.top = (10 + Math.sin(Date.now() * 0.001) * 5) + 'vh';
        
        requestAnimationFrame(animateSanta);
    }
    
    // Обработчик клика на Деда Мороза
    santa.addEventListener('click', function() {
        generatePromoCode();
        promoModal.style.display = 'block';
        playSound('magic');
    });
    
    // Закрытие модального окна
    closePromo.addEventListener('click', function() {
        promoModal.style.display = 'none';
    });
    
    // Копирование промокода
    copyPromo.addEventListener('click', function() {
        navigator.clipboard.writeText(promoCode.textContent).then(() => {
            showNotification('Промокод скопирован!', 'success');
            playSound('click');
        });
    });
    
    // Генерация промокода
    function generatePromoCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'BB2026-VIP-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        promoCode.textContent = code;
    }
    
    animateSanta();
}

// ==================== СИСТЕМА НАВИГАЦИИ ====================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentTabs = document.querySelectorAll('.content-tab');
    const authBtn = document.getElementById('authBtn');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    
    // Переключение вкладок
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Удаление активных классов
            navLinks.forEach(l => l.classList.remove('active'));
            contentTabs.forEach(tab => tab.classList.remove('active'));
            
            // Добавление активных классов
            this.classList.add('active');
            const targetTab = this.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
            
            playSound('click');
            
            // Прокрутка к верху
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Модальное окно авторизации
    authBtn.addEventListener('click', function() {
        authModal.style.display = 'block';
        playSound('click');
    });
    
    closeAuthModal.addEventListener('click', function() {
        authModal.style.display = 'none';
    });
    
    // Закрытие модальных окон по клику вне области
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
        if (e.target === promoModal) {
            promoModal.style.display = 'none';
        }
    });
}

// ==================== СИСТЕМА АВТОРИЗАЦИИ ====================
function initAuthSystem() {
    const authTabBtns = document.querySelectorAll('.auth-tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    
    // Переключение между входом и регистрацией
    authTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-auth-tab');
            
            authTabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetTab + 'Form').classList.add('active');
            
            playSound('click');
        });
    });
    
    // Обработка формы входа
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        if (validateLogin(username, password)) {
            simulateLogin(username);
        }
    });
    
    // Обработка формы регистрации
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (validateRegistration(username, email, password, confirmPassword)) {
            simulateRegistration(username, email);
        }
    });
    
    // Валидация логина
    function validateLogin(username, password) {
        if (!username.trim()) {
            showNotification('Введите никнейм', 'error');
            return false;
        }
        
        if (!password) {
            showNotification('Введите пароль', 'error');
            return false;
        }
        
        if (password.length < 8) {
            showNotification('Пароль слишком короткий', 'error');
            return false;
        }
        
        return true;
    }
    
    // Валидация регистрации
    function validateRegistration(username, email, password, confirmPassword) {
        // Проверка ника
        if (!username.trim()) {
            showNotification('Введите никнейм', 'error');
            return false;
        }
        
        if (username.length < 3) {
            showNotification('Никнейм должен содержать минимум 3 символа', 'error');
            return false;
        }
        
        // Проверка email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Введите корректный email', 'error');
            return false;
        }
        
        // Проверка пароля
        if (!validatePasswordStrength(password)) {
            showNotification('Пароль не соответствует требованиям безопасности', 'error');
            return false;
        }
        
        // Проверка подтверждения пароля
        if (password !== confirmPassword) {
            showNotification('Пароли не совпадают', 'error');
            return false;
        }
        
        return true;
    }
    
    // Симуляция успешного входа
    function simulateLogin(username) {
        showNotification(`Добро пожаловать, ${username}!`, 'success');
        playSound('success');
        
        // Обновление интерфейса
        const authBtn = document.getElementById('authBtn');
        authBtn.innerHTML = `<i class="fas fa-user-check"></i><span>${username}</span>`;
        authBtn.classList.add('logged-in');
        
        // Закрытие модального окна
        document.getElementById('authModal').style.display = 'none';
        
        // Сохранение в localStorage
        localStorage.setItem('bb_user', JSON.stringify({
            username: username,
            loggedIn: true,
            loginTime: Date.now()
        }));
    }
    
    // Симуляция регистрации
    function simulateRegistration(username, email) {
        showNotification('Регистрация успешна! Проверьте вашу почту для подтверждения.', 'success');
        playSound('success');
        
        // Симуляция отправки email
        setTimeout(() => {
            showNotification(`Код подтверждения отправлен на ${email}`, 'info');
        }, 2000);
        
        // Переключение на вкладку входа
        authTabBtns.forEach(b => b.classList.remove('active'));
        authForms.forEach(form => form.classList.remove('active'));
        document.querySelector('[data-auth-tab="login"]').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    }
}

// ==================== СИСТЕМА ВАЛИДАЦИИ ПАРОЛЯ ====================
function initPasswordValidation() {
    const passwordInput = document.getElementById('regPassword');
    const requirements = {
        length: document.getElementById('reqLength'),
        letter: document.getElementById('reqLetter'),
        symbol: document.getElementById('reqSymbol'),
        notSimple: document.getElementById('reqNotSimple')
    };
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        // Проверка длины
        const hasLength = password.length >= 8;
        requirements.length.classList.toggle('valid', hasLength);
        requirements.length.classList.toggle('invalid', !hasLength);
        
        // Проверка английских букв
        const hasLetter = /[a-zA-Z]/.test(password);
        requirements.letter.classList.toggle('valid', hasLetter);
        requirements.letter.classList.toggle('invalid', !hasLetter);
        
        // Проверка символов
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        requirements.symbol.classList.toggle('valid', hasSymbol);
        requirements.symbol.classList.toggle('invalid', !hasSymbol);
        
        // Проверка на простой пароль
        const isNotSimple = !/^123456789$|^password$|^qwerty$/i.test(password);
        requirements.notSimple.classList.toggle('valid', isNotSimple);
        requirements.notSimple.classList.toggle('invalid', !isNotSimple);
    });
    
    // Функция проверки силы пароля
    function validatePasswordStrength(password) {
        const minLength = 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const isNotSimple = !/^123456789$|^password$|^qwerty$/i.test(password);
        
        return password.length >= minLength && hasLetter && hasSymbol && isNotSimple;
    }
}

// ==================== СИСТЕМА КОЛЕСА БОНУСОВ ====================
function initBonusWheel() {
    const spinBtn = document.getElementById('spinBtn');
    const wheel = document.querySelector('.wheel-circle');
    const segments = document.querySelectorAll('.wheel-segment');
    
    let isSpinning = false;
    let spinCount = 0;
    const maxSpins = 1; // Максимум 1 спин в день
    
    // Шансы выпадения (в процентах)
    const rewards = {
        vip10: { type: 'vip', duration: 10, chance: 50 },
        vip20: { type: 'vip', duration: 20, chance: 25 },
        vip30: { type: 'vip', duration: 30, chance: 15 },
        promo10: { type: 'promo', discount: 10, chance: 70 },
        promo20: { type: 'promo', discount: 20, chance: 20 },
        promo30: { type: 'promo', discount: 30, chance: 5 },
        promo40: { type: 'promo', discount: 40, chance: 1 },
        coins: { type: 'coins', amount: 100, chance: 10 }
    };
    
    spinBtn.addEventListener('click', function() {
        if (isSpinning) return;
        
        const lastSpin = localStorage.getItem('bb_last_spin');
        const today = new Date().toDateString();
        
        // Проверка ежедневного лимита
        if (lastSpin === today && spinCount >= maxSpins) {
            showNotification('Вы уже использовали свой ежедневный бонус сегодня!', 'warning');
            playSound('error');
            return;
        }
        
        startSpin();
    });
    
    function startSpin() {
        isSpinning = true;
        spinBtn.disabled = true;
        playSound('spin');
        
        // Случайный угол вращения (минимум 5 полных оборотов)
        const spinDegrees = 1800 + Math.random() * 360;
        const winningSegment = getRandomReward();
        
        wheel.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
        wheel.style.transform = `rotate(${spinDegrees}deg)`;
        
        // Завершение вращения
        setTimeout(() => {
            isSpinning = false;
            spinBtn.disabled = false;
            
            // Показ выигрыша
            showReward(winningSegment);
            
            // Сохранение в историю
            saveSpinResult(winningSegment);
            
            // Обновление счетчика
            spinCount++;
            localStorage.setItem('bb_last_spin', new Date().toDateString());
            
            playSound('win');
        }, 4000);
    }
    
    function getRandomReward() {
        const random = Math.random() * 100;
        let accumulatedChance = 0;
        
        for (const [key, reward] of Object.entries(rewards)) {
            accumulatedChance += reward.chance;
            if (random <= accumulatedChance) {
                return { key, ...reward };
            }
        }
        
        // Fallback
        return { key: 'vip10', ...rewards.vip10 };
    }
    
    function showReward(reward) {
        let message = '';
        
        if (reward.type === 'vip') {
            message = `🎉 Поздравляем! Вы выиграли VIP статус на ${reward.duration} минут!`;
            activateVIP(reward.duration);
        } else if (reward.type === 'promo') {
            message = `🎉 Поздравляем! Вы выиграли промокод на скидку ${reward.discount}%!`;
            activatePromoCode(reward.discount);
        } else if (reward.type === 'coins') {
            message = `🎉 Поздравляем! Вы выиграли ${reward.amount} монет!`;
            addCoins(reward.amount);
        }
        
        showNotification(message, 'success');
        
        // Симуляция отправки email уведомления
        const userData = JSON.parse(localStorage.getItem('bb_user') || '{}');
        if (userData.email) {
            simulateEmailNotification(userData.email, message);
        }
    }
    
    function activateVIP(duration) {
        const userData = JSON.parse(localStorage.getItem('bb_user') || '{}');
        userData.vipActive = true;
        userData.vipExpires = Date.now() + (duration * 60 * 1000);
        localStorage.setItem('bb_user', JSON.stringify(userData));
        
        // Обновление интерфейса
        updateVIPStatus();
    }
    
    function activatePromoCode(discount) {
        const code = generatePromoCode(discount);
        showNotification(`Ваш промокод: ${code}`, 'info');
        
        const userData = JSON.parse(localStorage.getItem('bb_user') || '{}');
        userData.activePromo = { code, discount, expires: Date.now() + 24 * 60 * 60 * 1000 };
        localStorage.setItem('bb_user', JSON.stringify(userData));
    }
    
    function addCoins(amount) {
        const userData = JSON.parse(localStorage.getItem('bb_user') || '{}');
        userData.coins = (userData.coins || 0) + amount;
        localStorage.setItem('bb_user', JSON.stringify(userData));
    }
    
    function generatePromoCode(discount) {
        const prefix = 'BB2026';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = `${prefix}-${discount}-`;
        
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return code;
    }
    
    function saveSpinResult(reward) {
        const spinHistory = JSON.parse(localStorage.getItem('bb_spin_history') || '[]');
        spinHistory.push({
            date: new Date().toISOString(),
            reward: reward
        });
        localStorage.setItem('bb_spin_history', JSON.stringify(spinHistory));
    }
    
    function updateVIPStatus() {
        const userData = JSON.parse(localStorage.getItem('bb_user') || '{}');
        const authBtn = document.getElementById('authBtn');
        
        if (userData.vipActive && userData.vipExpires > Date.now()) {
            authBtn.classList.add('vip-active');
            const timeLeft = Math.ceil((userData.vipExpires - Date.now()) / 60000);
            authBtn.title = `VIP активен (осталось ${timeLeft} мин)`;
        } else {
            authBtn.classList.remove('vip-active');
            userData.vipActive = false;
            localStorage.setItem('bb_user', JSON.stringify(userData));
        }
    }
    
    // Проверка VIP статуса при загрузке
    updateVIPStatus();
}

// ==================== ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ====================
function initCountdown() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    function updateCountdown() {
        const now = new Date();
        const newYear2026 = new Date('January 1, 2026 00:00:00');
        const diff = newYear2026 - now;
        
        if (diff <= 0) {
            // Новый год наступил!
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            showNewYearCelebration();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Специальные эффекты при приближении Нового года
        if (days === 0 && hours < 24) {
            document.body.classList.add('new-year-eve');
        }
    }
    
    function showNewYearCelebration() {
        // Запуск праздничных анимаций
        createFireworks();
        playSound('celebration');
        showNotification('С Новым 2026 Годом! 🎉', 'success');
        
        // Специальный бонус на Новый год
        if (!localStorage.getItem('bb_ny2026_bonus')) {
            activateVIP(60); // 1 час VIP
            addCoins(2026); // 2026 монет
            localStorage.setItem('bb_ny2026_bonus', 'claimed');
        }
    }
    
    // Обновление каждую секунду
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// ==================== СИСТЕМА УВЕДОМЛЕНИЙ ====================
function showNotification(message, type = 'info') {
    // Создание элемента уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Добавление в DOM
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Закрытие по кнопке
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Автоматическое закрытие
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification);
        }
    }, 5000);
    
    function closeNotification(notif) {
        notif.classList.remove('show');
        setTimeout(() => {
            if (notif.parentNode) {
                notif.remove();
            }
        }, 300);
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// ==================== СИСТЕМА ЗВУКОВ ====================
function initSoundEffects() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sounds = {};
    
    function playSound(type) {
        if (!localStorage.getItem('bb_sound_enabled')) {
            localStorage.setItem('bb_sound_enabled', 'true');
        }
        
        if (localStorage.getItem('bb_sound_enabled') === 'false') return;
        
        switch (type) {
            case 'click':
                playClickSound();
                break;
            case 'success':
                playSuccessSound();
                break;
            case 'error':
                playErrorSound();
                break;
            case 'spin':
                playSpinSound();
                break;
            case 'win':
                playWinSound();
                break;
            case 'magic':
                playMagicSound();
                break;
            case 'celebration':
                playCelebrationSound();
                break;
        }
    }
    
    function playClickSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
    
    function playSuccessSound() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    function playSpinSound() {
        // Более сложный звук вращения
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                const freq = 300 + i * 50;
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }, i * 100);
        }
    }
    
    function playWinSound() {
        // Победный аккорд
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }, index * 100);
        });
    }
    
    // Сохранение функции в глобальной области видимости
    window.playSound = playSound;
}

// ==================== СИСТЕМА ЧАСТИЦ И АНИМАЦИЙ ====================
function initParticles() {
    // Создание частиц для специальных эффектов
    function createParticles(x, y, count, color = '#ffffff') {
        for (let i = 0; i < count; i++) {
            createParticle(x, y, color);
        }
    }
    
    function createParticle(x, y, color) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(particle);
        
        // Анимация частицы
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        let posX = x;
        let posY = y;
        
        function animate() {
            posX += vx;
            posY += vy;
            particle.style.opacity = parseFloat(particle.style.opacity || 1) - 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            
            if (parseFloat(particle.style.opacity) > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }
        
        animate();
    }
    
    // Создание фейерверков
    function createFireworks() {
        const interval = setInterval(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight / 2;
            createFirework(x, y);
        }, 500);
        
        setTimeout(() => clearInterval(interval), 5000);
    }
    
    function createFirework(x, y) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Взрыв
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createParticle(x, y, color);
            }, i * 10);
        }
        
        playSound('celebration');
    }
    
    // Сохранение функций в глобальной области видимости
    window.createParticles = createParticles;
    window.createFireworks = createFireworks;
}

// ==================== СИСТЕМА МОДАЛЬНЫХ ОКОН ====================
function initModalWindows() {
    // Инициализация всех модальных окон
    const modals = document.querySelectorAll('.modal-overlay, .promo-modal');
    
    modals.forEach(modal => {
        // Закрытие по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
                playSound('click');
            }
        });
    });
    
    // Анимация появления модальных окон
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const modal = mutation.target;
                if (modal.style.display === 'block') {
                    modal.classList.add('appearing');
                    setTimeout(() => modal.classList.remove('appearing'), 300);
                }
            }
        });
    });
    
    modals.forEach(modal => {
        observer.observe(modal, { attributes: true });
    });
}

// ==================== СИСТЕМА СТАТУСА СЕРВЕРА ====================
function initServerStatus() {
    const onlineCount = document.querySelector('.online-count');
    
    function updateServerStatus() {
        // Симуляция изменения онлайна
        const baseOnline = 127;
        const variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
        const currentOnline = Math.max(50, baseOnline + variation);
        
        onlineCount.textContent = currentOnline;
        
        // Анимация изменения
        onlineCount.classList.add('updating');
        setTimeout(() => onlineCount.classList.remove('updating'), 500);
    }
    
    // Обновление каждые 30 секунд
    setInterval(updateServerStatus, 30000);
    updateServerStatus();
}

// ==================== ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ ====================
function initPerformanceOptimizer() {
    // Отложенная загрузка тяжелых ресурсов
    function lazyLoadResources() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Оптимизация анимаций
    function optimizeAnimations() {
        // Отключение сложных анимаций при низком FPS
        let lastTime = performance.now();
        let frameCount = 0;
        
        function checkFPS() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Упрощение анимаций при низком FPS
                if (fps < 30) {
                    document.body.classList.add('reduced-animations');
                } else {
                    document.body.classList.remove('reduced-animations');
                }
            }
            
            requestAnimationFrame(checkFPS);
        }
        
        checkFPS();
    }
    
    // Очистка неиспользуемых элементов
    function cleanupUnusedElements() {
        setInterval(() => {
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                if (index > 100) { // Ограничение количества частиц
                    particle.remove();
                }
            });
        }, 5000);
    }
    
    lazyLoadResources();
    optimizeAnimations();
    cleanupUnusedElements();
}

// ==================== ДОПОЛНИТЕЛЬНЫЕ АНИМАЦИИ ====================
function initAnimations() {
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдение за элементами для анимации
    const animatedElements = document.querySelectorAll('.feature-item, .package-card, .support-card');
    animatedElements.forEach(el => observer.observe(el));
    
    // Параллакс эффект для фона
    function initParallax() {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.winter-scene, .mountain, .house');
            
            parallaxElements.forEach((el, index) => {
                const speed = 0.5 * (index + 1) / parallaxElements.length;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    initParallax();
    
    // Анимация логотипа бабочки
    function animateButterfly() {
        const butterfly = document.querySelector('.logo-animated');
        
        setInterval(() => {
            butterfly.classList.toggle('butterfly-flap');
        }, 1000);
    }
    
    animateButterfly();
}

// ==================== СИМУЛЯЦИЯ EMAIL УВЕДОМЛЕНИЙ ====================
function simulateEmailNotification(email, message) {
    console.log(`📧 Email отправлен на ${email}: ${message}`);
    // В реальной системе здесь был бы AJAX запрос к серверу
}

// ==================== ИНИЦИАЛИЗАЦИЯ ВСЕХ СИСТЕМ ПРИ ЗАГРУЗКЕ ====================
function initializeAllSystems() {
    // Проверка поддержки браузером необходимых функций
    if (!window.AudioContext && !window.webkitAudioContext) {
        console.warn('Браузер не поддерживает Web Audio API');
    }
    
    if (!localStorage.getItem('bb_first_visit')) {
        showNotification('Добро пожаловать на BloodyButterfly DJN! 🎮', 'info');
        localStorage.setItem('bb_first_visit', 'true');
    }
    
    // Восстановление сессии пользователя
    const userData = JSON.parse(localStorage.getItem('bb_user') || '{}');
    if (userData.loggedIn) {
        const authBtn = document.getElementById('authBtn');
        authBtn.innerHTML = `<i class="fas fa-user-check"></i><span>${userData.username}</span>`;
        authBtn.classList.add('logged-in');
    }
}

// Запуск инициализации при полной загрузке страницы
window.addEventListener('load', initializeAllSystems);

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Произошла ошибка:', e.error);
    showNotification('Произошла непредвиденная ошибка', 'error');
});

// ==================== ДОПОЛНИТЕЛЬНЫЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// Функция для форматирования времени
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Функция для генерации случайного цвета
function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Функция для проверки видимости элемента
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Функция для троттлинга (ограничение частоты вызова)
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Функция для дебаунсинга (отложенный вызов)
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Экспорт функций для глобального использования
window.BB = {
    showNotification,
    playSound,
    createParticles,
    createFireworks,
    formatTime,
    getRandomColor,
    isElementInViewport,
    throttle,
    debounce
};

console.log('🎮 BloodyButterfly DJN System initialized successfully!');
console.log('🚀 ClientMod V34 ready for New Year 2026!');
