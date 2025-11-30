// script.js - BloodyButterfly DJN ClientMod V34 Новогодний 2026
class BloodyButterflySystem {
    constructor() {
        this.init();
    }

    init() {
        // Инициализация всех систем
        this.initSnowAnimation();
        this.initSantaAnimation();
        this.initNavigation();
        this.initAuthSystem();
        this.initBonusWheel();
        this.initCountdown();
        this.initPasswordValidation();
        this.initModalWindows();
        this.initServerStatus();
        this.initAnimations();
        this.initParticles();
        this.initSoundEffects();
        this.initPerformanceOptimizer();
        this.initUserSession();
        this.initNotifications();
        this.initFAQSystem();
        this.initFormValidation();
        this.initThemeSystem();
        
        console.log('🎮 BloodyButterfly DJN System initialized successfully!');
        console.log('🚀 ClientMod V34 ready for New Year 2026!');
    }

    // ==================== СИСТЕМА АНИМАЦИИ СНЕГА ====================
    initSnowAnimation() {
        const snowContainer = document.querySelector('.snow-container');
        const snowflakes = ['❅', '❆', '•', '·', '*', '+'];
        
        function createSnowflake() {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
            snowflake.style.opacity = Math.random() * 0.7 + 0.3;
            snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
            snowflake.style.zIndex = Math.floor(Math.random() * 10);
            snowflake.style.animationDelay = Math.random() * 5 + 's';
            
            snowContainer.appendChild(snowflake);
            
            // Удаление снежинки после анимации
            setTimeout(() => {
                if (snowflake.parentNode) {
                    snowflake.remove();
                }
            }, 15000);
        }
        
        // Создание снежинок каждые 100ms
        this.snowInterval = setInterval(createSnowflake, 100);
        
        // Начальное создание снежинок
        for (let i = 0; i < 30; i++) {
            setTimeout(createSnowflake, i * 100);
        }
    }

    // ==================== АНИМАЦИЯ ДЕДА МОРОЗА ====================
    initSantaAnimation() {
        const santa = document.querySelector('.santa-parade');
        const promoModal = document.getElementById('promoModal');
        const closePromo = document.getElementById('closePromo');
        const copyPromo = document.getElementById('copyPromo');
        const promoCode = document.getElementById('promoCode');
        const activatePromo = document.getElementById('activatePromo');
        
        let santaSpeed = 1;
        let isSantaPaused = false;

        // Обработчик клика на Деда Мороза
        santa.addEventListener('click', () => {
            if (!this.isSantaClicked) {
                this.isSantaClicked = true;
                this.generatePromoCode();
                this.showModal(promoModal);
                this.playSound('magic');
                
                // Создание частиц вокруг Деда Мороза
                this.createParticlesAround(santa, 20, '#ffd700');
                
                setTimeout(() => {
                    this.isSantaClicked = false;
                }, 3000);
            }
        });
        
        // Закрытие модального окна
        closePromo.addEventListener('click', () => {
            this.hideModal(promoModal);
        });
        
        // Копирование промокода
        copyPromo.addEventListener('click', () => {
            this.copyToClipboard(promoCode.textContent);
            this.showNotification('Промокод скопирован в буфер обмена!', 'success');
            this.playSound('click');
            
            // Анимация кнопки копирования
            copyPromo.style.transform = 'scale(0.9)';
            setTimeout(() => {
                copyPromo.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Активация промокода
        activatePromo.addEventListener('click', () => {
            this.activateVIP(1440); // 24 часа в минутах
            this.showNotification('VIP статус активирован на 24 часа!', 'success');
            this.playSound('success');
            this.hideModal(promoModal);
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && promoModal.style.display === 'block') {
                this.hideModal(promoModal);
            }
        });
    }

    // ==================== СИСТЕМА НАВИГАЦИИ ====================
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const contentSections = document.querySelectorAll('.content-section');
        const userMenu = document.getElementById('userMenu');
        const userModal = document.getElementById('userModal');
        const closeUserModal = document.getElementById('closeUserModal');
        const loginFromModal = document.getElementById('loginFromModal');
        const registerFromModal = document.getElementById('registerFromModal');
        
        // Переключение вкладок
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Удаление активных классов
                navLinks.forEach(l => l.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                // Добавление активных классов
                link.classList.add('active');
                const targetTab = link.getAttribute('data-tab');
                document.getElementById(targetTab).classList.add('active');
                
                this.playSound('click');
                
                // Прокрутка к верху
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Анимация перехода
                this.animateTabTransition(targetTab);
            });
        });
        
        // Модальное окно пользователя
        userMenu.addEventListener('click', () => {
            this.showModal(userModal);
            this.playSound('click');
        });
        
        closeUserModal.addEventListener('click', () => {
            this.hideModal(userModal);
        });
        
        loginFromModal.addEventListener('click', () => {
            this.hideModal(userModal);
            this.switchToTab('auth');
            this.switchAuthTab('login');
        });
        
        registerFromModal.addEventListener('click', () => {
            this.hideModal(userModal);
            this.switchToTab('auth');
            this.switchAuthTab('register');
        });
        
        // Закрытие модальных окон по клику вне области
        window.addEventListener('click', (e) => {
            if (e.target === userModal) {
                this.hideModal(userModal);
            }
            const promoModal = document.getElementById('promoModal');
            if (e.target === promoModal) {
                this.hideModal(promoModal);
            }
        });
    }

    // ==================== СИСТЕМА АВТОРИЗАЦИИ ====================
    initAuthSystem() {
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        const loginForm = document.getElementById('loginFormElement');
        const registerForm = document.getElementById('registerFormElement');
        const showLoginPassword = document.getElementById('showLoginPassword');
        const showRegPassword = document.getElementById('showRegPassword');
        const showConfirmPassword = document.getElementById('showConfirmPassword');
        
        // Переключение между входом и регистрацией
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(form => form.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(targetTab + 'Form').classList.add('active');
                
                this.playSound('click');
            });
        });
        
        // Показать/скрыть пароль
        showLoginPassword.addEventListener('click', () => {
            this.togglePasswordVisibility('loginPassword', showLoginPassword);
        });
        
        showRegPassword.addEventListener('click', () => {
            this.togglePasswordVisibility('regPassword', showRegPassword);
        });
        
        showConfirmPassword.addEventListener('click', () => {
            this.togglePasswordVisibility('regConfirmPassword', showConfirmPassword);
        });
        
        // Обработка формы входа
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const remember = document.querySelector('input[name="remember"]').checked;
            
            if (this.validateLogin(username, password)) {
                this.simulateLogin(username, remember);
            }
        });
        
        // Обработка формы регистрации
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const newsletter = document.querySelector('input[name="newsletter"]').checked;
            const terms = document.querySelector('input[name="terms"]').checked;
            
            if (this.validateRegistration(username, email, password, confirmPassword, terms)) {
                this.simulateRegistration(username, email, password, newsletter);
            }
        });
        
        // Социальная авторизация
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const provider = btn.classList.contains('discord') ? 'discord' : 'google';
                this.socialLogin(provider);
            });
        });
    }

    // ==================== СИСТЕМА ВАЛИДАЦИИ ПАРОЛЯ ====================
    initPasswordValidation() {
        const passwordInput = document.getElementById('regPassword');
        const confirmInput = document.getElementById('regConfirmPassword');
        const requirements = {
            length: document.getElementById('reqLength'),
            letter: document.getElementById('reqLetter'),
            symbol: document.getElementById('reqSymbol'),
            notSimple: document.getElementById('reqNotSimple')
        };
        
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        const passwordMatch = document.getElementById('passwordMatch');
        
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            
            // Проверка требований
            const hasLength = password.length >= 8;
            const hasLetter = /[a-zA-Z]/.test(password);
            const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
            const isNotSimple = !/^(123456789|password|qwerty)$/i.test(password);
            
            // Обновление иконок требований
            this.updateRequirement(requirements.length, hasLength);
            this.updateRequirement(requirements.letter, hasLetter);
            this.updateRequirement(requirements.symbol, hasSymbol);
            this.updateRequirement(requirements.notSimple, isNotSimple);
            
            // Расчет силы пароля
            const strength = this.calculatePasswordStrength(password);
            this.updatePasswordStrength(strength, strengthFill, strengthText);
            
            // Проверка совпадения паролей
            this.checkPasswordMatch(password, confirmInput.value, passwordMatch);
        });
        
        confirmInput.addEventListener('input', () => {
            this.checkPasswordMatch(passwordInput.value, confirmInput.value, passwordMatch);
        });
    }

    // ==================== СИСТЕМА КОЛЕСА БОНУСОВ ====================
    initBonusWheel() {
        const spinBtn = document.getElementById('spinBtn');
        const wheelCircle = document.getElementById('wheelCircle');
        const spinsCount = document.getElementById('spinsCount');
        const nextSpinTime = document.getElementById('nextSpinTime');
        const clearHistory = document.getElementById('clearHistory');
        const historyList = document.getElementById('historyList');
        
        let isSpinning = false;
        let spinCount = 0;
        const maxSpins = 1;
        
        // Шансы выпадения (в процентах)
        const rewards = {
            vip10: { 
                type: 'vip', 
                duration: 10, 
                chance: 50,
                name: 'VIP 10 минут',
                icon: 'crown',
                color: '#ffd700'
            },
            vip20: { 
                type: 'vip', 
                duration: 20, 
                chance: 25,
                name: 'VIP 20 минут',
                icon: 'crown',
                color: '#ffd700'
            },
            vip30: { 
                type: 'vip', 
                duration: 30, 
                chance: 15,
                name: 'VIP 30 минут',
                icon: 'crown',
                color: '#ffd700'
            },
            promo10: { 
                type: 'promo', 
                discount: 10, 
                chance: 70,
                name: 'Промокод 10%',
                icon: 'tag',
                color: '#3366ff'
            },
            promo20: { 
                type: 'promo', 
                discount: 20, 
                chance: 20,
                name: 'Промокод 20%',
                icon: 'tag',
                color: '#3366ff'
            },
            promo30: { 
                type: 'promo', 
                discount: 30, 
                chance: 5,
                name: 'Промокод 30%',
                icon: 'tag',
                color: '#3366ff'
            },
            promo40: { 
                type: 'promo', 
                discount: 40, 
                chance: 1,
                name: 'Промокод 40%',
                icon: 'tag',
                color: '#3366ff'
            },
            coins: { 
                type: 'coins', 
                amount: 100, 
                chance: 10,
                name: '100 Монет',
                icon: 'coins',
                color: '#33cc99'
            }
        };
        
        spinBtn.addEventListener('click', () => {
            if (isSpinning) return;
            
            const lastSpin = localStorage.getItem('bb_last_spin');
            const today = new Date().toDateString();
            
            // Проверка ежедневного лимита
            if (lastSpin === today && spinCount >= maxSpins) {
                this.showNotification('Вы уже использовали свой ежедневный бонус сегодня!', 'warning');
                this.playSound('error');
                return;
            }
            
            this.startSpin();
        });
        
        clearHistory.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите очистить историю наград?')) {
                localStorage.removeItem('bb_spin_history');
                historyList.innerHTML = '<div class="history-empty">История наград пуста</div>';
                this.showNotification('История наград очищена', 'info');
            }
        });
        
        // Загрузка истории
        this.loadSpinHistory();
        
        // Обновление таймера следующего спина
        this.updateNextSpinTimer();
        setInterval(() => {
            this.updateNextSpinTimer();
        }, 1000);
        
        this.startSpin = () => {
            isSpinning = true;
            spinBtn.disabled = true;
            spinBtn.querySelector('.spin-text').style.opacity = '0';
            spinBtn.querySelector('.spin-loader').style.display = 'block';
            
            this.playSound('spin');
            
            // Случайный угол вращения (минимум 5 полных оборотов)
            const spinDegrees = 1800 + Math.random() * 360;
            const winningReward = this.getRandomReward();
            const segmentAngle = 45; // 360 / 8 сегментов
            const winningSegmentIndex = Object.keys(rewards).indexOf(winningReward.key);
            const stopAngle = 360 - (winningSegmentIndex * segmentAngle + Math.random() * segmentAngle);
            
            wheelCircle.style.transition = 'transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)';
            wheelCircle.style.transform = `rotate(${spinDegrees + stopAngle}deg)`;
            
            // Анимация вращения
            this.animateWheelSpin();
            
            // Завершение вращения
            setTimeout(() => {
                isSpinning = false;
                spinBtn.disabled = false;
                spinBtn.querySelector('.spin-text').style.opacity = '1';
                spinBtn.querySelector('.spin-loader').style.display = 'none';
                
                // Показ выигрыша
                this.showReward(winningReward);
                
                // Сохранение в историю
                this.saveSpinResult(winningReward);
                
                // Обновление счетчика
                spinCount++;
                localStorage.setItem('bb_last_spin', new Date().toDateString());
                spinsCount.textContent = maxSpins - spinCount;
                
                this.playSound('win');
            }, 4000);
        };
        
        this.animateWheelSpin = () => {
            const segments = wheelCircle.querySelectorAll('.wheel-segment');
            segments.forEach((segment, index) => {
                setTimeout(() => {
                    segment.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        segment.style.transform = 'scale(1)';
                    }, 100);
                }, index * 50);
            });
        };
    }

    // ==================== ТАЙМЕР ОБРАТНОГО ОТСЧЕТА ====================
    initCountdown() {
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
                
                this.showNewYearCelebration();
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
                this.accelerateAnimations();
            }
        }
        
        // Обновление каждую секунду
        this.countdownInterval = setInterval(updateCountdown.bind(this), 1000);
        updateCountdown.bind(this)();
    }

    // ==================== СИСТЕМА МОДАЛЬНЫХ ОКОН ====================
    initModalWindows() {
        // Инициализация всех модальных окон
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            // Закрытие по ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'block') {
                    this.hideModal(modal);
                }
            });
        });
    }

    // ==================== СИСТЕМА СТАТУСА СЕРВЕРА ====================
    initServerStatus() {
        const onlineCount = document.querySelector('.players-online');
        const statusIndicator = document.querySelector('.status-indicator');
        
        function updateServerStatus() {
            // Симуляция изменения онлайна
            const baseOnline = 127;
            const variation = Math.floor(Math.random() * 20) - 10;
            const currentOnline = Math.max(50, baseOnline + variation);
            
            onlineCount.textContent = currentOnline;
            
            // Анимация изменения
            onlineCount.classList.add('updating');
            setTimeout(() => onlineCount.classList.remove('updating'), 500);
            
            // Обновление индикатора статуса
            if (currentOnline > 150) {
                statusIndicator.style.background = '#ff3366';
                statusIndicator.style.boxShadow = '0 0 10px #ff3366';
            } else if (currentOnline > 100) {
                statusIndicator.style.background = '#ffd700';
                statusIndicator.style.boxShadow = '0 0 10px #ffd700';
            } else {
                statusIndicator.style.background = '#33cc99';
                statusIndicator.style.boxShadow = '0 0 10px #33cc99';
            }
        }
        
        // Обновление каждые 30 секунд
        this.serverStatusInterval = setInterval(updateServerStatus, 30000);
        updateServerStatus();
    }

    // ==================== СИСТЕМА АНИМАЦИЙ ====================
    initAnimations() {
        // Анимация появления элементов при скролле
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Наблюдение за элементами для анимации
        const animatedElements = document.querySelectorAll('.feature-card, .package-card, .support-card, .mode-card');
        animatedElements.forEach(el => observer.observe(el));
        
        // Параллакс эффект для фона
        this.initParallax();
        
        // Анимация логотипа бабочки
        this.animateButterfly();
    }

    // ==================== СИСТЕМА ЧАСТИЦ ====================
    initParticles() {
        // Инициализация системы частиц для спецэффектов
        this.particles = [];
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'particles-container';
        this.particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(this.particleContainer);
    }

    // ==================== СИСТЕМА ЗВУКОВ ====================
    initSoundEffects() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {};
        this.isSoundEnabled = localStorage.getItem('bb_sound_enabled') !== 'false';
        
        // Предзагрузка звуков
        this.preloadSounds();
    }

    // ==================== ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ ====================
    initPerformanceOptimizer() {
        // Отложенная загрузка тяжелых ресурсов
        this.lazyLoadResources();
        
        // Оптимизация анимаций
        this.optimizeAnimations();
        
        // Очистка неиспользуемых элементов
        this.cleanupUnusedElements();
    }

    // ==================== СИСТЕМА ПОЛЬЗОВАТЕЛЬСКОЙ СЕССИИ ====================
    initUserSession() {
        // Восстановление сессии пользователя
        const userData = this.getUserData();
        if (userData.loggedIn) {
            this.updateUserInterface(userData);
        }
        
        // Проверка VIP статуса
        this.checkVIPStatus();
        
        // Загрузка истории бонусов
        this.loadBonusHistory();
    }

    // ==================== СИСТЕМА УВЕДОМЛЕНИЙ ====================
    initNotifications() {
        this.notificationContainer = document.getElementById('notificationsContainer');
        this.notificationQueue = [];
        this.isShowingNotification = false;
    }

    // ==================== СИСТЕМА FAQ ====================
    initFAQSystem() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Закрытие всех FAQ
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                    faq.querySelector('.faq-answer').style.maxHeight = '0';
                });
                
                if (!isOpen) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    this.playSound('click');
                }
            });
        });
    }

    // ==================== СИСТЕМА ВАЛИДАЦИИ ФОРМ ====================
    initFormValidation() {
        // Дополнительная валидация форм
        this.initEmailValidation();
        this.initUsernameValidation();
    }

    // ==================== СИСТЕМА ТЕМ ====================
    initThemeSystem() {
        // Проверка предпочтений пользователя
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-theme');
        }
        
        // Обработчик изменения темы
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (e.matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        });
    }

    // ==================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ====================
    
    // Генерация промокода
    generatePromoCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'BB2026-VIP-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        document.getElementById('promoCode').textContent = code;
        return code;
    }

    // Показать модальное окно
    showModal(modal) {
        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Скрыть модальное окно
    hideModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Закрытие по кнопке
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.closeNotification(notification);
        });
        
        // Автоматическое закрытие
        setTimeout(() => {
            if (notification.parentNode) {
                this.closeNotification(notification);
            }
        }, 5000);
        
        return notification;
    }

    // Закрыть уведомление
    closeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    // Воспроизведение звука
    playSound(type) {
        if (!this.isSoundEnabled) return;
        
        try {
            switch (type) {
                case 'click':
                    this.playClickSound();
                    break;
                case 'success':
                    this.playSuccessSound();
                    break;
                case 'error':
                    this.playErrorSound();
                    break;
                case 'spin':
                    this.playSpinSound();
                    break;
                case 'win':
                    this.playWinSound();
                    break;
                case 'magic':
                    this.playMagicSound();
                    break;
                case 'celebration':
                    this.playCelebrationSound();
                    break;
            }
        } catch (error) {
            console.warn('Audio error:', error);
        }
    }

    // Создание частиц
    createParticles(x, y, count, color = '#ffffff') {
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, color);
        }
    }

    createParticle(x, y, color) {
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
        
        this.particleContainer.appendChild(particle);
        
        // Анимация частицы
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        let posX = x;
        let posY = y;
        let opacity = 1;
        
        const animate = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }

    // Создание частиц вокруг элемента
    createParticlesAround(element, count, color) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radius = Math.max(rect.width, rect.height) / 2;
        
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            this.createParticle(x, y, color);
        }
    }

    // Копирование в буфер обмена
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(() => {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }

    // Переключение видимости пароля
    togglePasswordVisibility(inputId, button) {
        const input = document.getElementById(inputId);
        const icon = button.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    // Валидация логина
    validateLogin(username, password) {
        if (!username.trim()) {
            this.showNotification('Введите никнейм', 'error');
            return false;
        }
        
        if (!password) {
            this.showNotification('Введите пароль', 'error');
            return false;
        }
        
        return true;
    }

    // Валидация регистрации
    validateRegistration(username, email, password, confirmPassword, terms) {
        if (!username.trim()) {
            this.showNotification('Введите никнейм', 'error');
            return false;
        }
        
        if (username.length < 3) {
            this.showNotification('Никнейм должен содержать минимум 3 символа', 'error');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Введите корректный email', 'error');
            return false;
        }
        
        if (!this.validatePasswordStrength(password)) {
            this.showNotification('Пароль не соответствует требованиям безопасности', 'error');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Пароли не совпадают', 'error');
            return false;
        }
        
        if (!terms) {
            this.showNotification('Необходимо принять условия использования', 'error');
            return false;
        }
        
        return true;
    }

    // Проверка силы пароля
    validatePasswordStrength(password) {
        const minLength = 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const isNotSimple = !/^(123456789|password|qwerty)$/i.test(password);
        
        return password.length >= minLength && hasLetter && hasSymbol && isNotSimple;
    }

    // Обновление требования пароля
    updateRequirement(element, isValid) {
        const icon = element.querySelector('i');
        if (isValid) {
            icon.className = 'fas fa-check';
            element.classList.add('valid');
            element.classList.remove('invalid');
        } else {
            icon.className = 'fas fa-circle';
            element.classList.remove('valid');
            element.classList.add('invalid');
        }
    }

    // Расчет силы пароля
    calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 15;
        
        if (/[a-z]/.test(password)) strength += 10;
        if (/[A-Z]/.test(password)) strength += 15;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 20;
        
        return Math.min(strength, 100);
    }

    // Обновление индикатора силы пароля
    updatePasswordStrength(strength, fillElement, textElement) {
        fillElement.style.width = strength + '%';
        
        if (strength < 40) {
            fillElement.style.background = '#ff3366';
            textElement.textContent = 'Слабый пароль';
        } else if (strength < 70) {
            fillElement.style.background = '#ffd700';
            textElement.textContent = 'Средний пароль';
        } else {
            fillElement.style.background = '#33cc99';
            textElement.textContent = 'Надежный пароль';
        }
    }

    // Проверка совпадения паролей
    checkPasswordMatch(password, confirmPassword, matchElement) {
        if (!confirmPassword) {
            matchElement.style.display = 'none';
            return;
        }
        
        if (password === confirmPassword) {
            matchElement.style.display = 'flex';
            matchElement.classList.add('match');
            matchElement.classList.remove('mismatch');
        } else {
            matchElement.style.display = 'flex';
            matchElement.classList.add('mismatch');
            matchElement.classList.remove('match');
            matchElement.innerHTML = '<i class="fas fa-times"></i> Пароли не совпадают';
        }
    }

    // Получение случайной награды
    getRandomReward() {
        const random = Math.random() * 100;
        let accumulatedChance = 0;
        
        for (const [key, reward] of Object.entries(this.rewards)) {
            accumulatedChance += reward.chance;
            if (random <= accumulatedChance) {
                return { key, ...reward };
            }
        }
        
        // Fallback
        return { key: 'vip10', ...this.rewards.vip10 };
    }

    // Показать выигрыш
    showReward(reward) {
        let message = '';
        
        if (reward.type === 'vip') {
            message = `🎉 Поздравляем! Вы выиграли VIP статус на ${reward.duration} минут!`;
            this.activateVIP(reward.duration);
        } else if (reward.type === 'promo') {
            message = `🎉 Поздравляем! Вы выиграли промокод на скидку ${reward.discount}%!`;
            this.activatePromoCode(reward.discount);
        } else if (reward.type === 'coins') {
            message = `🎉 Поздравляем! Вы выиграли ${reward.amount} монет!`;
            this.addCoins(reward.amount);
        }
        
        this.showNotification(message, 'success');
        this.createParticlesAround(document.querySelector('.bonus-wheel'), 30, reward.color);
        
        // Симуляция отправки email уведомления
        const userData = this.getUserData();
        if (userData.email) {
            this.simulateEmailNotification(userData.email, message);
        }
    }

    // Активация VIP статуса
    activateVIP(duration) {
        const userData = this.getUserData();
        userData.vipActive = true;
        userData.vipExpires = Date.now() + (duration * 60 * 1000);
        this.saveUserData(userData);
        
        this.updateVIPStatus();
        this.showNotification(`VIP статус активирован на ${duration} минут!`, 'success');
    }

    // Активация промокода
    activatePromoCode(discount) {
        const code = this.generatePromoCode();
        this.showNotification(`Ваш промокод на скидку ${discount}%: ${code}`, 'info');
        
        const userData = this.getUserData();
        userData.activePromo = { 
            code, 
            discount, 
            expires: Date.now() + 24 * 60 * 60 * 1000 
        };
        this.saveUserData(userData);
    }

    // Добавление монет
    addCoins(amount) {
        const userData = this.getUserData();
        userData.coins = (userData.coins || 0) + amount;
        this.saveUserData(userData);
        
        this.showNotification(`Получено ${amount} монет!`, 'success');
    }

    // Сохранение результата спина
    saveSpinResult(reward) {
        const spinHistory = JSON.parse(localStorage.getItem('bb_spin_history') || '[]');
        spinHistory.unshift({
            date: new Date().toISOString(),
            reward: reward,
            claimed: true
        });
        
        // Ограничение истории 50 записями
        if (spinHistory.length > 50) {
            spinHistory.pop();
        }
        
        localStorage.setItem('bb_spin_history', JSON.stringify(spinHistory));
        this.loadSpinHistory();
    }

    // Загрузка истории спинов
    loadSpinHistory() {
        const historyList = document.getElementById('historyList');
        const spinHistory = JSON.parse(localStorage.getItem('bb_spin_history') || '[]');
        
        if (spinHistory.length === 0) {
            historyList.innerHTML = '<div class="history-empty">История наград пуста</div>';
            return;
        }
        
        historyList.innerHTML = spinHistory.map(entry => `
            <div class="history-item">
                <div class="history-icon">
                    <i class="fas fa-${entry.reward.icon}"></i>
                </div>
                <div class="history-info">
                    <div class="history-reward">${entry.reward.name}</div>
                    <div class="history-date">${new Date(entry.date).toLocaleDateString('ru-RU')}</div>
                </div>
                <div class="history-status ${entry.claimed ? 'claimed' : 'pending'}">
                    ${entry.claimed ? 'Получено' : 'Ожидает'}
                </div>
            </div>
        `).join('');
    }

    // Обновление таймера следующего спина
    updateNextSpinTimer() {
        const nextSpinTime = document.getElementById('nextSpinTime');
        const lastSpin = localStorage.getItem('bb_last_spin');
        
        if (!lastSpin) {
            nextSpinTime.textContent = '00:00:00';
            return;
        }
        
        const lastSpinDate = new Date(lastSpin);
        const nextSpinDate = new Date(lastSpinDate);
        nextSpinDate.setDate(nextSpinDate.getDate() + 1);
        
        const now = new Date();
        const diff = nextSpinDate - now;
        
        if (diff <= 0) {
            nextSpinTime.textContent = '00:00:00';
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        nextSpinTime.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Празднование Нового года
    showNewYearCelebration() {
        // Запуск праздничных анимаций
        this.createFireworks();
        this.playSound('celebration');
        this.showNotification('С Новым 2026 Годом! 🎉', 'success');
        
        // Специальный бонус на Новый год
        if (!localStorage.getItem('bb_ny2026_bonus')) {
            this.activateVIP(1440); // 24 часа VIP
            this.addCoins(2026); // 2026 монет
            localStorage.setItem('bb_ny2026_bonus', 'claimed');
        }
    }

    // Ускорение анимаций перед Новым годом
    accelerateAnimations() {
        document.documentElement.style.setProperty('--ease-bounce', 'cubic-bezier(0.5, -0.5, 0.5, 1.5)');
        document.documentElement.style.setProperty('--ease-elastic', 'cubic-bezier(0.5, -0.3, 0.5, 1.3)');
    }

    // Параллакс эффект
    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.winter-landscape, .mountain, .house, .tree');
            
            parallaxElements.forEach((el, index) => {
                const speed = 0.3 * (index + 1) / parallaxElements.length;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Анимация бабочки
    animateButterfly() {
        const butterfly = document.querySelector('.butterfly');
        
        setInterval(() => {
            butterfly.classList.toggle('butterfly-flap');
        }, 1000);
    }

    // Предзагрузка звуков
    preloadSounds() {
        // Здесь будет код предзагрузки звуковых файлов
        // В реальном проекте здесь будут загружаться аудио файлы
    }

    // Звук клика
    playClickSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Звук успеха
    playSuccessSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Звук вращения
    playSpinSound() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                const freq = 300 + i * 50;
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
            }, i * 100);
        }
    }

    // Звук победы
    playWinSound() {
        const frequencies = [523.25, 659.25, 783.99, 1046.50];
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.5);
            }, index * 100);
        });
    }

    // Звук магии
    playMagicSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.6);
    }

    // Звук празднования
    playCelebrationSound() {
        // Создание праздничного аккорда
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.playSuccessSound();
            }, i * 200);
        }
    }

    // Отложенная загрузка ресурсов
    lazyLoadResources() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
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
    optimizeAnimations() {
        let lastTime = performance.now();
        let frameCount = 0;
        
        const checkFPS = () => {
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
        };
        
        checkFPS();
    }

    // Очистка неиспользуемых элементов
    cleanupUnusedElements() {
        setInterval(() => {
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                if (index > 100) {
                    particle.remove();
                }
            });
        }, 5000);
    }

    // Получение данных пользователя
    getUserData() {
        return JSON.parse(localStorage.getItem('bb_user') || '{}');
    }

    // Сохранение данных пользователя
    saveUserData(userData) {
        localStorage.setItem('bb_user', JSON.stringify(userData));
    }

    // Обновление интерфейса пользователя
    updateUserInterface(userData) {
        const userMenu = document.getElementById('userMenu');
        const userName = userMenu.querySelector('.user-name');
        const userAvatar = userMenu.querySelector('.user-avatar');
        
        userName.textContent = userData.username;
        userAvatar.innerHTML = '<i class="fas fa-user-check"></i>';
        
        if (userData.vipActive && userData.vipExpires > Date.now()) {
            userMenu.classList.add('vip-active');
        }
    }

    // Проверка VIP статуса
    checkVIPStatus() {
        const userData = this.getUserData();
        const userMenu = document.getElementById('userMenu');
        
        if (userData.vipActive && userData.vipExpires > Date.now()) {
            userMenu.classList.add('vip-active');
            const timeLeft = Math.ceil((userData.vipExpires - Date.now()) / 60000);
            userMenu.title = `VIP активен (осталось ${timeLeft} мин)`;
        } else {
            userMenu.classList.remove('vip-active');
            userData.vipActive = false;
            this.saveUserData(userData);
        }
    }

    // Загрузка истории бонусов
    loadBonusHistory() {
        // Загрузка истории бонусов из localStorage
        const bonusHistory = JSON.parse(localStorage.getItem('bb_bonus_history') || '[]');
        // Обновление интерфейса истории бонусов
    }

    // Симуляция входа
    simulateLogin(username, remember) {
        this.showNotification(`Добро пожаловать, ${username}!`, 'success');
        this.playSound('success');
        
        // Обновление интерфейса
        const userMenu = document.getElementById('userMenu');
        const userName = userMenu.querySelector('.user-name');
        const userAvatar = userMenu.querySelector('.user-avatar');
        
        userName.textContent = username;
        userAvatar.innerHTML = '<i class="fas fa-user-check"></i>';
        
        // Сохранение в localStorage
        const userData = {
            username: username,
            loggedIn: true,
            loginTime: Date.now(),
            remember: remember
        };
        this.saveUserData(userData);
        
        // Закрытие модальных окон
        const authModal = document.getElementById('userModal');
        this.hideModal(authModal);
    }

    // Симуляция регистрации
    simulateRegistration(username, email, password, newsletter) {
        this.showNotification('Регистрация успешна! Проверьте вашу почту для подтверждения.', 'success');
        this.playSound('success');
        
        // Симуляция отправки email
        setTimeout(() => {
            this.showNotification(`Код подтверждения отправлен на ${email}`, 'info');
        }, 2000);
        
        // Сохранение данных пользователя
        const userData = {
            username: username,
            email: email,
            registered: true,
            registrationDate: new Date().toISOString(),
            newsletter: newsletter
        };
        this.saveUserData(userData);
        
        // Переключение на вкладку входа
        this.switchAuthTab('login');
    }

    // Социальный вход
    socialLogin(provider) {
        this.showNotification(`Вход через ${provider}...`, 'info');
        this.playSound('click');
        
        // Симуляция социального входа
        setTimeout(() => {
            this.simulateLogin(`User_${Math.random().toString(36).substr(2, 9)}`, true);
        }, 1500);
    }

    // Переключение вкладки авторизации
    switchAuthTab(tab) {
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        
        authTabs.forEach(t => t.classList.remove('active'));
        authForms.forEach(form => form.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}Form`).classList.add('active');
    }

    // Переключение основной вкладки
    switchToTab(tab) {
        const navLinks = document.querySelectorAll('.nav-link');
        const contentSections = document.querySelectorAll('.content-section');
        
        navLinks.forEach(l => l.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(tab).classList.add('active');
    }

    // Анимация перехода между вкладками
    animateTabTransition(tab) {
        const section = document.getElementById(tab);
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 50);
    }

    // Создание фейерверков
    createFireworks() {
        const interval = setInterval(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight / 2;
            this.createFirework(x, y);
        }, 500);
        
        setTimeout(() => clearInterval(interval), 5000);
    }

    createFirework(x, y) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Взрыв
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createParticle(x, y, color);
            }, i * 10);
        }
        
        this.playSound('celebration');
    }

    // Получение иконки для уведомления
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Валидация email
    initEmailValidation() {
        const emailInput = document.getElementById('regEmail');
        
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.showNotification('Введите корректный email адрес', 'error');
            }
        });
    }

    // Валидация имени пользователя
    initUsernameValidation() {
        const usernameInput = document.getElementById('regUsername');
        
        usernameInput.addEventListener('blur', () => {
            const username = usernameInput.value;
            
            if (username && username.length < 3) {
                this.showNotification('Никнейм должен содержать минимум 3 символа', 'error');
            }
        });
    }

    // Симуляция отправки email
    simulateEmailNotification(email, message) {
        console.log(`📧 Email отправлен на ${email}: ${message}`);
        // В реальной системе здесь был бы AJAX запрос к серверу
    }

    // Деструктор для очистки
    destroy() {
        // Очистка интервалов
        if (this.snowInterval) clearInterval(this.snowInterval);
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        if (this.serverStatusInterval) clearInterval(this.serverStatusInterval);
        
        // Очистка событий
        // ... код очистки событий ...
        
        console.log('🎮 BloodyButterfly DJN System destroyed');
    }
}

// Инициализация системы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Создание экземпляра системы
    window.bbSystem = new BloodyButterflySystem();
    
    // Обработка ошибок
    window.addEventListener('error', (e) => {
        console.error('Произошла ошибка:', e.error);
        window.bbSystem.showNotification('Произошла непредвиденная ошибка', 'error');
    });
    
    // Обработка обещаний без обработчиков
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Необработанное обещание:', e.reason);
        window.bbSystem.showNotification('Произошла ошибка при выполнении операции', 'error');
    });
});

// Экспорт для глобального использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BloodyButterflySystem;
}
