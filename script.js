/**
 * BloodyButterfly Website - Main JavaScript
 * Версия 1.0.0
 * Новогодний игровой сервер DJN ClientMod V34
 */

'use strict';

// Основной класс приложения
class BloodyButterflyApp {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.currentUser = null;
        this.notificationCount = 0;
        this.surpriseShownToday = false;
        
        // Конфигурация
        this.config = {
            serverName: 'BloodyButterfly DJN',
            serverVersion: 'ClientMod V34',
            newYear: new Date('2026-01-01T00:00:00'),
            apiBaseUrl: 'https://api.bloodybutterfly.ru',
            wsUrl: 'wss://ws.bloodybutterfly.ru',
            defaultLanguage: 'ru',
            maxPasswordLength: 128,
            minPasswordLength: 12,
            cookieLifetime: 365, // дней
            surpriseChance: 0.1, // 10% шанс появления сюрприза
            surpriseCooldown: 24, // часов
            sessionTimeout: 30 // минут
        };
        
        // Состояние приложения
        this.state = {
            isAuthenticated: false,
            isMobileMenuOpen: false,
            currentSection: 'home',
            notifications: [],
            bonuses: {
                daily: {
                    available: true,
                    claimed: false,
                    nextReset: this.getNextBonusReset()
                },
                weekly: {
                    streak: 3,
                    maxStreak: 7,
                    lastClaim: '2025-12-28'
                }
            },
            statistics: {
                onlinePlayers: 127,
                maxPlayers: 200,
                uptime: 99.8,
                monthsOnline: 12,
                newPlayersToday: 42,
                averagePlaytime: 3.5,
                monthlyDonations: 24500
            },
            settings: {
                theme: 'dark',
                notifications: true,
                sounds: true,
                language: 'ru',
                cookiesAccepted: false
            }
        };
        
        this.initialize();
    }

    // Инициализация приложения
    async initialize() {
        console.log(`🚀 Инициализация BloodyButterfly ${this.version}`);
        
        try {
            // Инициализация компонентов
            this.initEventListeners();
            this.initBackgroundAnimation();
            this.initCountdown();
            this.initPasswordValidation();
            this.initModals();
            this.initNotifications();
            this.initCookieConsent();
            this.initSurpriseSystem();
            this.initCharts();
            this.initNavigation();
            this.initForms();
            this.initAnimations();
            this.initServiceWorker();
            this.initWebSocket();
            this.initPerformanceMonitoring();
            
            // Загрузка данных пользователя
            await this.loadUserData();
            
            // Обновление статистики
            await this.updateStatistics();
            
            // Проверка ежедневного бонуса
            this.checkDailyBonus();
            
            // Проверка показа сюрприза
            this.checkSurprise();
            
            // Скрытие лоадера
            setTimeout(() => {
                this.hideLoader();
                this.showNotification('Добро пожаловать!', 'Сервер BloodyButterfly готов к работе!', 'info');
            }, 1500);
            
            this.isInitialized = true;
            console.log('✅ Приложение успешно инициализировано');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации:', error);
            this.showNotification('Ошибка загрузки', 'Не удалось загрузить приложение. Пожалуйста, обновите страницу.', 'error');
        }
    }

    // ===== СИСТЕМА ФОНА И АНИМАЦИЙ =====
    
    initBackgroundAnimation() {
        console.log('🎨 Инициализация фоновой анимации');
        
        // Создание частиц
        this.createParticles();
        
        // Создание снежинок
        this.createSnowflakes();
        
        // Анимация градиента
        this.startGradientAnimation();
    }
    
    createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // Случайный размер
                const size = Math.random() * 4 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Случайная позиция
                particle.style.left = `${Math.random() * 100}vw`;
                particle.style.top = `${Math.random() * 100}vh`;
                
                // Случайный цвет
                const colors = [
                    'rgba(58, 134, 255, 0.1)',
                    'rgba(131, 56, 236, 0.1)',
                    'rgba(255, 0, 110, 0.1)',
                    'rgba(255, 190, 11, 0.1)'
                ];
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                // Случайная скорость
                const duration = Math.random() * 30 + 20;
                particle.style.animationDuration = `${duration}s`;
                particle.style.animationDelay = `${Math.random() * 10}s`;
                
                container.appendChild(particle);
            }, i * 100);
        }
    }
    
    createSnowflakes() {
        const container = document.getElementById('snowflakes');
        if (!container) return;
        
        const snowflakeCount = 100;
        
        for (let i = 0; i < snowflakeCount; i++) {
            setTimeout(() => {
                const snowflake = document.createElement('div');
                snowflake.className = 'snowflake';
                
                // Случайный размер
                const size = Math.random() * 6 + 3;
                snowflake.style.width = `${size}px`;
                snowflake.style.height = `${size}px`;
                
                // Случайная позиция
                snowflake.style.left = `${Math.random() * 100}vw`;
                
                // Случайная скорость
                const duration = Math.random() * 15 + 10;
                snowflake.style.animationDuration = `${duration}s`;
                snowflake.style.animationDelay = `${Math.random() * 5}s`;
                
                // Случайная прозрачность
                snowflake.style.opacity = Math.random() * 0.5 + 0.5;
                
                container.appendChild(snowflake);
            }, i * 50);
        }
    }
    
    startGradientAnimation() {
        const overlay = document.querySelector('.gradient-overlay');
        if (!overlay) return;
        
        let angle = 0;
        const animate = () => {
            angle = (angle + 0.1) % 360;
            overlay.style.background = `radial-gradient(
                circle at ${50 + Math.sin(angle * Math.PI / 180) * 10}% 50%,
                rgba(26, 26, 74, 0.8) 0%,
                rgba(10, 10, 42, 0.9) 50%,
                rgba(42, 7, 80, 0.95) 100%
            )`;
            requestAnimationFrame(animate);
        };
        animate();
    }

    // ===== СИСТЕМА СЧЕТЧИКА =====
    
    initCountdown() {
        console.log('⏰ Инициализация счетчика');
        
        const updateCountdown = () => {
            const now = new Date();
            const diff = this.config.newYear - now;
            
            if (diff <= 0) {
                // Новый год наступил!
                this.updateCountdownDisplay(0, 0, 0, 0);
                this.showNewYearCelebration();
                return;
            }
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            this.updateCountdownDisplay(days, hours, minutes, seconds);
            
            // Обновление прогресс-бара
            this.updateProgressBar(diff);
        };
        
        // Первое обновление
        updateCountdown();
        
        // Обновление каждую секунду
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    updateCountdownDisplay(days, hours, minutes, seconds) {
        const elements = {
            days: document.getElementById('countdownDays'),
            hours: document.getElementById('countdownHours'),
            minutes: document.getElementById('countdownMinutes'),
            seconds: document.getElementById('countdownSeconds')
        };
        
        if (elements.days) elements.days.textContent = days.toString().padStart(2, '0');
        if (elements.hours) elements.hours.textContent = hours.toString().padStart(2, '0');
        if (elements.minutes) elements.minutes.textContent = minutes.toString().padStart(2, '0');
        if (elements.seconds) elements.seconds.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateProgressBar(diff) {
        const totalDays = 365;
        const daysPassed = totalDays - Math.floor(diff / (1000 * 60 * 60 * 24));
        const progress = (daysPassed / totalDays) * 100;
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }
    
    showNewYearCelebration() {
        clearInterval(this.countdownInterval);
        
        // Показ праздничного сообщения
        this.showNotification(
            'С Новым 2026 Годом! 🎉',
            'Поздравляем с наступлением Нового года! Счастливого Рождества!',
            'success'
        );
        
        // Запуск праздничных эффектов
        this.startCelebrationEffects();
    }
    
    startCelebrationEffects() {
        // Добавление конфетти
        this.createConfetti();
        
        // Изменение фона
        document.body.style.background = 'linear-gradient(135deg, #ff006e, #ffbe0b, #3a86ff)';
        
        // Анимация элементов
        const elements = document.querySelectorAll('.countdown-title, .time-block');
        elements.forEach(el => {
            el.style.animation = 'bounce 1s infinite';
        });
    }
    
    createConfetti() {
        const colors = ['#ff006e', '#ffbe0b', '#3a86ff', '#8338ec', '#00cc88'];
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        document.body.appendChild(container);
        
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    transform: rotate(${Math.random() * 360}deg);
                `;
                
                const animation = confetti.animate([
                    { 
                        transform: `translateY(0) rotate(0deg)`,
                        opacity: 1 
                    },
                    { 
                        transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`,
                        opacity: 0 
                    }
                ], {
                    duration: Math.random() * 3000 + 2000,
                    easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
                });
                
                animation.onfinish = () => confetti.remove();
                
                container.appendChild(confetti);
            }, i * 100);
        }
        
        // Удаление контейнера через 5 секунд
        setTimeout(() => container.remove(), 5000);
    }

    // ===== СИСТЕМА ВАЛИДАЦИИ ПАРОЛЯ =====
    
    initPasswordValidation() {
        console.log('🔐 Инициализация валидации пароля');
        
        // Настройка валидации для формы входа
        const loginPassword = document.getElementById('loginPassword');
        if (loginPassword) {
            loginPassword.addEventListener('input', (e) => {
                this.validatePassword(e.target.value, 'login');
            });
        }
        
        // Настройка валидации для формы регистрации
        const registerPassword = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('registerConfirmPassword');
        
        if (registerPassword) {
            registerPassword.addEventListener('input', (e) => {
                const password = e.target.value;
                this.validatePassword(password, 'register');
                
                // Проверка совпадения паролей
                if (confirmPassword && confirmPassword.value) {
                    this.checkPasswordMatch(password, confirmPassword.value);
                }
            });
        }
        
        if (confirmPassword) {
            confirmPassword.addEventListener('input', (e) => {
                if (registerPassword) {
                    this.checkPasswordMatch(registerPassword.value, e.target.value);
                }
            });
        }
        
        // Настройка переключения видимости пароля
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                this.togglePasswordVisibility(e.target.closest('.password-field'));
            });
        });
    }
    
    validatePassword(password, formType = 'register') {
        const strength = this.calculatePasswordStrength(password);
        const requirements = this.checkPasswordRequirements(password);
        
        // Обновление индикатора силы
        this.updatePasswordStrengthIndicator(strength, formType);
        
        // Обновление требований
        this.updatePasswordRequirements(requirements, formType);
        
        return strength >= 4; // Минимум 4 из 6 требований
    }
    
    calculatePasswordStrength(password) {
        let strength = 0;
        
        // Проверка длины
        if (password.length >= this.config.minPasswordLength) strength++;
        
        // Проверка заглавных букв
        if (/[A-Z]/.test(password)) strength++;
        
        // Проверка строчных букв
        if (/[a-z]/.test(password)) strength++;
        
        // Проверка цифр
        if (/\d/.test(password)) strength++;
        
        // Проверка специальных символов
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
        
        // Проверка на распространенные пароли
        if (!this.isCommonPassword(password)) strength++;
        
        return strength;
    }
    
    checkPasswordRequirements(password) {
        return {
            length: password.length >= this.config.minPasswordLength,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            common: !this.isCommonPassword(password)
        };
    }
    
    isCommonPassword(password) {
        const commonPasswords = [
            '123456', '123456789', 'qwerty', 'password', '111111',
            '12345678', 'abc123', 'password1', '12345', '1234567',
            '1234567890', 'admin', 'welcome', 'monkey', 'sunshine',
            'password123', 'letmein', '123123', 'football', 'iloveyou',
            '123456789', '1234567890', '12345678910', '123456789101112'
        ];
        
        return commonPasswords.includes(password.toLowerCase());
    }
    
    updatePasswordStrengthIndicator(strength, formType) {
        const strengthFill = document.getElementById(`${formType}StrengthFill`);
        const strengthText = document.getElementById(`${formType}Strength`);
        
        if (!strengthFill || !strengthText) return;
        
        const percentage = (strength / 6) * 100;
        strengthFill.style.width = `${percentage}%`;
        
        // Цвет в зависимости от силы
        let color, text;
        if (strength <= 2) {
            color = '#ff3333';
            text = 'Очень слабый';
        } else if (strength === 3) {
            color = '#ffbe0b';
            text = 'Слабый';
        } else if (strength === 4) {
            color = '#ffbe0b';
            text = 'Средний';
        } else if (strength === 5) {
            color = '#00cc88';
            text = 'Сильный';
        } else {
            color = '#00cc88';
            text = 'Очень сильный';
        }
        
        strengthFill.style.background = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
    
    updatePasswordRequirements(requirements, formType) {
        const requirementsContainer = document.getElementById(`${formType}Requirements`);
        if (!requirementsContainer) return;
        
        Object.entries(requirements).forEach(([type, isValid]) => {
            const element = requirementsContainer.querySelector(`[data-type="${type}"]`);
            if (element) {
                const icon = element.querySelector('i');
                if (icon) {
                    icon.className = isValid ? 'fas fa-check' : 'fas fa-times';
                    icon.style.color = isValid ? '#00cc88' : '#ff3333';
                }
                element.style.color = isValid ? '#00cc88' : '#ff3333';
            }
        });
    }
    
    checkPasswordMatch(password, confirmPassword) {
        const matchElement = document.getElementById('passwordMatch');
        if (!matchElement) return;
        
        const isValid = password === confirmPassword && password.length > 0;
        const icon = matchElement.querySelector('i');
        const text = matchElement.querySelector('span');
        
        if (isValid) {
            icon.className = 'fas fa-check';
            icon.style.color = '#00cc88';
            text.textContent = 'Пароли совпадают';
            matchElement.style.color = '#00cc88';
        } else {
            icon.className = 'fas fa-times';
            icon.style.color = '#ff3333';
            text.textContent = 'Пароли не совпадают';
            matchElement.style.color = '#ff3333';
        }
        
        matchElement.classList.toggle('valid', isValid);
        matchElement.classList.toggle('visible', confirmPassword.length > 0);
    }
    
    togglePasswordVisibility(passwordField) {
        if (!passwordField) return;
        
        const input = passwordField.querySelector('input');
        const toggle = passwordField.querySelector('.password-toggle');
        
        if (input.type === 'password') {
            input.type = 'text';
            toggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            toggle.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    // ===== СИСТЕМА МОДАЛЬНЫХ ОКОН =====
    
    initModals() {
        console.log('🪟 Инициализация модальных окон');
        
        // Открытие модальных окон
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });
        
        // Закрытие модальных окон
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Закрытие при клике вне модального окна
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Закрытие при нажатии Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
        
        // Переключение между формами авторизации
        document.querySelectorAll('.switch-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const from = link.getAttribute('data-from');
                const to = link.getAttribute('data-to');
                this.switchAuthForm(from, to);
            });
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        // Закрытие всех других модальных окон
        this.closeAllModals();
        
        // Показ модального окна
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Фокус на первом поле ввода
        setTimeout(() => {
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) firstInput.focus();
        }, 100);
        
        // Аналитика
        this.trackModalOpen(modalId);
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Сброс форм
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            
            // Сброс валидации пароля
            const passwordInputs = form.querySelectorAll('input[type="password"]');
            passwordInputs.forEach(input => {
                if (input.type === 'text') {
                    input.type = 'password';
                    const toggle = input.closest('.password-field')?.querySelector('.password-toggle');
                    if (toggle) {
                        toggle.innerHTML = '<i class="fas fa-eye"></i>';
                    }
                }
            });
            
            // Сброс индикаторов
            this.resetPasswordValidation(form.id);
        }
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
    
    switchAuthForm(from, to) {
        this.closeModal(`${from}Modal`);
        setTimeout(() => {
            this.openModal(`${to}Modal`);
        }, 300);
    }
    
    resetPasswordValidation(formId) {
        // Сброс индикатора силы пароля
        const strengthFills = document.querySelectorAll('.strength-fill');
        strengthFills.forEach(fill => {
            fill.style.width = '0%';
            fill.style.background = '#ff3333';
        });
        
        // Сброс текста силы
        const strengthTexts = document.querySelectorAll('.strength-value');
        strengthTexts.forEach(text => {
            text.textContent = 'Очень слабый';
            text.style.color = '#ff3333';
        });
        
        // Сброс требований
        const requirements = document.querySelectorAll('.requirement');
        requirements.forEach(req => {
            const icon = req.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-times';
                icon.style.color = '#ff3333';
            }
            req.style.color = '#ff3333';
        });
        
        // Сброс совпадения паролей
        const matchElement = document.getElementById('passwordMatch');
        if (matchElement) {
            matchElement.classList.remove('valid', 'visible');
            const icon = matchElement.querySelector('i');
            const text = matchElement.querySelector('span');
            if (icon) icon.className = 'fas fa-times';
            if (text) text.textContent = 'Пароли не совпадают';
        }
    }
    
    trackModalOpen(modalId) {
        console.log(`📊 Модальное окно открыто: ${modalId}`);
        // Здесь может быть интеграция с аналитикой
    }

    // ===== СИСТЕМА УВЕДОМЛЕНИЙ =====
    
    initNotifications() {
        console.log('🔔 Инициализация системы уведомлений');
        
        // Очистка старых уведомлений
        this.clearOldNotifications();
        
        // Проверка новых уведомлений
        this.checkForNotifications();
    }
    
    showNotification(title, message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;
        
        const notificationId = `notification_${Date.now()}_${this.notificationCount++}`;
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Автоматическое закрытие
        const timeout = setTimeout(() => {
            this.hideNotification(notificationId);
        }, duration);
        
        // Закрытие по клику
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(timeout);
                this.hideNotification(notificationId);
            });
        }
        
        // Сохранение в историю
        this.saveNotificationToHistory({ title, message, type, timestamp: Date.now() });
        
        return notificationId;
    }
    
    hideNotification(notificationId) {
        const notification = document.getElementById(notificationId);
        if (!notification) return;
        
        notification.classList.add('hiding');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    clearOldNotifications() {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;
        
        // Удаление уведомлений старше 30 секунд
        const notifications = container.querySelectorAll('.notification');
        notifications.forEach(notification => {
            const timeAttr = notification.getAttribute('data-time');
            if (timeAttr && Date.now() - parseInt(timeAttr) > 30000) {
                notification.remove();
            }
        });
    }
    
    checkForNotifications() {
        // Проверка системных уведомлений
        this.checkSystemNotifications();
        
        // Проверка бонусов
        this.checkBonusNotifications();
        
        // Проверка обновлений
        this.checkUpdateNotifications();
    }
    
    checkSystemNotifications() {
        // Пример: Проверка статуса сервера
        if (this.state.statistics.uptime < 99) {
            this.showNotification(
                'Внимание: Падение стабильности',
                'Стабильность сервера упала ниже 99%. Мы работаем над решением проблемы.',
                'warning',
                10000
            );
        }
    }
    
    checkBonusNotifications() {
        if (this.state.bonuses.daily.available && !this.state.bonuses.daily.claimed) {
            this.showNotification(
                'Ежедневный бонус доступен! 🎁',
                'Не забудьте забрать свой ежедневный бонус на вкладке "Бонусы".',
                'info',
                8000
            );
        }
    }
    
    checkUpdateNotifications() {
        // Здесь может быть проверка обновлений через API
        const lastUpdateCheck = localStorage.getItem('lastUpdateCheck');
        const now = Date.now();
        
        if (!lastUpdateCheck || now - parseInt(lastUpdateCheck) > 86400000) { // 24 часа
            localStorage.setItem('lastUpdateCheck', now.toString());
            
            // Симуляция проверки обновлений
            setTimeout(() => {
                this.showNotification(
                    'Доступно обновление! 🔄',
                    'Установлена новая версия ClientMod V34.1 с улучшениями производительности.',
                    'info',
                    10000
                );
            }, 10000);
        }
    }
    
    saveNotificationToHistory(notification) {
        try {
            const history = JSON.parse(localStorage.getItem('notificationHistory') || '[]');
            history.unshift(notification);
            
            // Ограничение истории 100 записей
            if (history.length > 100) {
                history.length = 100;
            }
            
            localStorage.setItem('notificationHistory', JSON.stringify(history));
        } catch (error) {
            console.error('Ошибка сохранения уведомления:', error);
        }
    }

    // ===== СИСТЕМА СОГЛАСИЯ НА COOKIE =====
    
    initCookieConsent() {
        console.log('🍪 Инициализация согласия на cookie');
        
        const consent = localStorage.getItem('cookieConsent');
        const consentElement = document.getElementById('cookieConsent');
        
        if (!consent && consentElement) {
            // Показать уведомление через 3 секунды
            setTimeout(() => {
                consentElement.classList.add('show');
            }, 3000);
        }
        
        // Обработка кнопок
        const acceptBtn = document.getElementById('cookieAccept');
        const rejectBtn = document.getElementById('cookieReject');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.handleCookieConsent(true));
        }
        
        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => this.handleCookieConsent(false));
        }
    }
    
    handleCookieConsent(accepted) {
        const consentElement = document.getElementById('cookieConsent');
        
        // Сохранение выбора
        localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'rejected');
        localStorage.setItem('cookieConsentDate', Date.now().toString());
        
        // Скрытие уведомления
        if (consentElement) {
            consentElement.classList.remove('show');
        }
        
        // Установка cookie
        if (accepted) {
            this.setCookie('cookie_consent', 'accepted', this.config.cookieLifetime);
            
            // Инициализация аналитики и других сервисов
            this.initAnalytics();
            this.initAdvertisement();
            
            this.showNotification(
                'Спасибо за согласие! 👍',
                'Мы используем куки для улучшения вашего опыта на сайте.',
                'success'
            );
        } else {
            this.setCookie('cookie_consent', 'rejected', 30);
            
            this.showNotification(
                'Настройки сохранены',
                'Мы уважаем ваш выбор и не будем использовать куки для отслеживания.',
                'info'
            );
        }
    }
    
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
    }
    
    getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    initAnalytics() {
        console.log('📈 Инициализация аналитики');
        // Здесь может быть интеграция с Google Analytics, Яндекс.Метрикой и т.д.
    }
    
    initAdvertisement() {
        console.log('📢 Инициализация рекламы');
        // Здесь может быть интеграция с рекламными сетями
    }

    // ===== СИСТЕМА СЮРПРИЗОВ =====
    
    initSurpriseSystem() {
        console.log('🎁 Инициализация системы сюрпризов');
        
        // Проверка, был ли сегодня показан сюрприз
        const lastSurpriseDate = localStorage.getItem('lastSurpriseDate');
        const today = new Date().toDateString();
        
        if (lastSurpriseDate === today) {
            this.surpriseShownToday = true;
        }
        
        // Обработка закрытия сюрприза
        const closeBtn = document.getElementById('surpriseClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideSurprise();
            });
        }
        
        // Обработка получения сюрприза
        const claimBtn = document.getElementById('claimSurprise');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => {
                this.claimSurprise();
            });
        }
        
        // Обработка модального окна сюрприза
        const copyBtn = document.getElementById('copySurprisePromo');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copySurprisePromoCode();
            });
        }
    }
    
    checkSurprise() {
        // Проверка, нужно ли показывать сюрприз
        if (this.surpriseShownToday) return;
        
        // Случайная проверка с шансом 10%
        if (Math.random() < this.config.surpriseChance) {
            // Показать сюрприз через случайное время (5-30 секунд)
            const delay = Math.random() * 25000 + 5000;
            
            setTimeout(() => {
                this.showSurprise();
            }, delay);
        }
    }
    
    showSurprise() {
        if (this.surpriseShownToday) return;
        
        // Генерация случайной позиции
        const container = document.getElementById('surpriseContainer');
        if (!container) return;
        
        // Случайная позиция (избегаем краев)
        const margin = 20;
        const maxX = window.innerWidth - container.offsetWidth - margin;
        const maxY = window.innerHeight - container.offsetHeight - margin;
        
        const x = margin + Math.random() * maxX;
        const y = margin + Math.random() * maxY;
        
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
        container.style.display = 'block';
        
        // Генерация промокода
        this.generateSurprisePromoCode();
        
        // Сохранение факта показа
        this.surpriseShownToday = true;
        localStorage.setItem('lastSurpriseDate', new Date().toDateString());
        
        // Аналитика
        console.log('🎁 Сюрприз показан');
    }
    
    hideSurprise() {
        const container = document.getElementById('surpriseContainer');
        if (container) {
            container.style.display = 'none';
        }
    }
    
    generateSurprisePromoCode() {
        const prefixes = ['BLOODY', 'XMAS', 'NEWYEAR', 'WINTER', 'GIFT'];
        const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const code = `${prefix}-2026-${suffix}`;
        
        const discountTypes = [
            { type: 'VIP', duration: '30 минут', chance: 0.4 },
            { type: 'Скидка', value: '10%', chance: 0.3 },
            { type: 'Скидка', value: '20%', chance: 0.2 },
            { type: 'Скидка', value: '30%', chance: 0.08 },
            { type: 'Скидка', value: '40%', chance: 0.02 }
        ];
        
        let random = Math.random();
        let selectedType;
        for (const type of discountTypes) {
            if (random < type.chance) {
                selectedType = type;
                break;
            }
            random -= type.chance;
        }
        
        const codeElement = document.getElementById('surpriseCode');
        if (codeElement) {
            const codeValue = codeElement.querySelector('.code-value');
            const codeDiscount = codeElement.querySelector('.code-discount');
            
            if (codeValue) codeValue.textContent = code;
            if (codeDiscount) {
                codeDiscount.textContent = selectedType.type === 'VIP' 
                    ? `VIP ${selectedType.duration}`
                    : `Скидка ${selectedType.value}`;
            }
        }
        
        // Сохранение промокода
        this.savePromoCode({
            code,
            type: selectedType.type,
            value: selectedType.value || selectedType.duration,
            expires: Date.now() + 86400000, // 24 часа
            source: 'surprise'
        });
        
        return { code, ...selectedType };
    }
    
    claimSurprise() {
        const codeElement = document.getElementById('surpriseCode');
        if (!codeElement) return;
        
        const code = codeElement.querySelector('.code-value')?.textContent;
        const discount = codeElement.querySelector('.code-discount')?.textContent;
        
        if (code) {
            // Активация промокода
            this.activatePromoCode(code);
            
            // Показ уведомления
            this.showNotification(
                'Сюрприз получен! 🎉',
                `Промокод ${code} активирован. ${discount}`,
                'success'
            );
            
            // Показ модального окна с деталями
            this.showSurpriseModal(code, discount);
            
            // Скрытие контейнера сюрприза
            this.hideSurprise();
        }
    }
    
    showSurpriseModal(code, discount) {
        // Обновление данных в модальном окне
        const codeElement = document.getElementById('surprisePromoCode');
        const discountElement = document.getElementById('surpriseDiscount');
        const typeElement = document.getElementById('surpriseType');
        
        if (codeElement) codeElement.textContent = code;
        if (discountElement) discountElement.textContent = discount;
        if (typeElement) {
            typeElement.textContent = discount.includes('VIP') 
                ? 'VIP статус' 
                : 'Промокод на скидку';
        }
        
        // Показ модального окна
        this.openModal('surpriseModal');
    }
    
    copySurprisePromoCode() {
        const codeElement = document.getElementById('surprisePromoCode');
        if (!codeElement) return;
        
        const code = codeElement.textContent;
        navigator.clipboard.writeText(code).then(() => {
            this.showNotification('Скопировано! 📋', 'Промокод скопирован в буфер обмена.', 'success');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            this.showNotification('Ошибка', 'Не удалось скопировать промокод.', 'error');
        });
    }
    
    savePromoCode(promoData) {
        try {
            const promoCodes = JSON.parse(localStorage.getItem('userPromoCodes') || '[]');
            promoCodes.push(promoData);
            localStorage.setItem('userPromoCodes', JSON.stringify(promoCodes));
        } catch (error) {
            console.error('Ошибка сохранения промокода:', error);
        }
    }
    
    activatePromoCode(code) {
        // Симуляция активации промокода
        console.log(`🎫 Активация промокода: ${code}`);
        
        // Здесь может быть API запрос для активации промокода
        setTimeout(() => {
            this.showNotification(
                'Промокод активирован! ✅',
                'Бонус применен к вашему аккаунту.',
                'success'
            );
        }, 1000);
    }

    // ===== СИСТЕМА ГРАФИКОВ =====
    
    initCharts() {
        console.log('📊 Инициализация графиков');
        
        // Инициализация при наличии библиотеки Chart.js
        if (typeof Chart !== 'undefined') {
            this.initOnlineChart();
            this.initPlayersChart();
        } else {
            console.warn('Chart.js не загружен, графики отключены');
        }
    }
    
    initOnlineChart() {
        const canvas = document.getElementById('onlineChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Генерация тестовых данных
        const labels = [];
        const onlineData = [];
        const maxData = [];
        
        for (let i = 0; i < 24; i++) {
            labels.push(`${i}:00`);
            onlineData.push(Math.floor(Math.random() * 50) + 100);
            maxData.push(Math.floor(Math.random() * 30) + 150);
        }
        
        this.onlineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Онлайн',
                        data: onlineData,
                        borderColor: '#3a86ff',
                        backgroundColor: 'rgba(58, 134, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Максимум',
                        data: maxData,
                        borderColor: '#8338ec',
                        backgroundColor: 'rgba(131, 56, 236, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
    }
    
    initPlayersChart() {
        const canvas = document.getElementById('playersChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        this.playersChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['VIP', 'Премиум', 'Обычные'],
                datasets: [{
                    data: [25, 35, 40],
                    backgroundColor: [
                        '#ff006e',
                        '#fb5607',
                        '#ffbe0b'
                    ],
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }
    
    updateCharts() {
        if (this.onlineChart) {
            // Обновление данных графика онлайн
            const newData = this.generateChartData();
            this.onlineChart.data.datasets[0].data = newData.online;
            this.onlineChart.data.datasets[1].data = newData.max;
            this.onlineChart.update();
        }
        
        if (this.playersChart) {
            // Обновление данных графика распределения
            const newDistribution = this.generateDistributionData();
            this.playersChart.data.datasets[0].data = newDistribution;
            this.playersChart.update();
        }
    }
    
    generateChartData() {
        const online = [];
        const max = [];
        
        for (let i = 0; i < 24; i++) {
            online.push(Math.floor(Math.random() * 50) + 100);
            max.push(Math.floor(Math.random() * 30) + 150);
        }
        
        return { online, max };
    }
    
    generateDistributionData() {
        const total = 100;
        const vip = Math.floor(Math.random() * 30) + 20;
        const premium = Math.floor(Math.random() * 40) + 30;
        const normal = total - vip - premium;
        
        return [vip, premium, normal];
    }

    // ===== СИСТЕМА НАВИГАЦИИ =====
    
    initNavigation() {
        console.log('🧭 Инициализация навигации');
        
        // Навигация по секциям
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
                
                // Закрытие мобильного меню
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });
        
        // Кнопка "Наверх"
        const scrollTopBtn = document.getElementById('scrollToTop');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Изменение темы
        const themeBtn = document.getElementById('changeTheme');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Мобильное меню
        const menuToggle = document.getElementById('mobileMenuToggle');
        const menuClose = document.getElementById('mobileMenuClose');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        if (menuClose) {
            menuClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        // Закрытие мобильного меню при клике вне его
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobileMenu');
            const menuToggle = document.getElementById('mobileMenuToggle');
            
            if (mobileMenu && mobileMenu.classList.contains('active') &&
                !mobileMenu.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Обработка кнопок входа/регистрации
        document.querySelectorAll('.btn-login, #headerLogin, #mobileLogin').forEach(btn => {
            btn.addEventListener('click', () => {
                this.openModal('loginModal');
                this.closeMobileMenu();
            });
        });
        
        document.querySelectorAll('.btn-register, #headerRegister, #mobileRegister').forEach(btn => {
            btn.addEventListener('click', () => {
                this.openModal('registerModal');
                this.closeMobileMenu();
            });
        });
        
        // Загрузка лаунчера
        document.querySelectorAll('.btn-download-launcher').forEach(btn => {
            btn.addEventListener('click', () => {
                this.downloadLauncher();
            });
        });
        
        // Ссылки в футере
        document.querySelectorAll('#footerFaq, #openFaq').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFAQ();
            });
        });
        
        document.querySelectorAll('#footerBug, #reportBug').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.reportBug();
            });
        });
        
        document.querySelectorAll('#footerDiscord, #joinDiscord').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('https://discord.gg/bloodybutterfly', '_blank');
            });
        });
    }
    
    navigateToSection(sectionId) {
        // Обновление активной ссылки
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
        });
        
        // Прокрутка к секции
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            this.state.currentSection = sectionId;
            
            // Аналитика
            this.trackNavigation(sectionId);
        }
    }
    
    toggleTheme() {
        const isDark = document.body.classList.contains('dark-theme');
        
        if (isDark) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            
            this.showNotification('Тема изменена', 'Установлена светлая тема', 'info');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            
            this.showNotification('Тема изменена', 'Установлена темная тема', 'info');
        }
    }
    
    toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const toggle = document.getElementById('mobileMenuToggle');
        
        if (menu && toggle) {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
            this.state.isMobileMenuOpen = menu.classList.contains('active');
            
            // Блокировка скролла
            document.body.style.overflow = this.state.isMobileMenuOpen ? 'hidden' : '';
        }
    }
    
    closeMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const toggle = document.getElementById('mobileMenuToggle');
        
        if (menu && toggle) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            this.state.isMobileMenuOpen = false;
            document.body.style.overflow = '';
        }
    }
    
    downloadLauncher() {
        this.showNotification('Загрузка началась', 'Лаунчер BloodyButterfly скачивается...', 'info');
        
        // Симуляция загрузки
        setTimeout(() => {
            this.showNotification(
                'Загрузка завершена! 🎮',
                'Лаунчер успешно скачан. Установите его и начните играть!',
                'success'
            );
        }, 2000);
    }
    
    showFAQ() {
        // Показ модального окна с FAQ
        this.showNotification(
            'Часто задаваемые вопросы',
            'Раздел FAQ находится в разработке. Скоро будет доступен!',
            'info'
        );
    }
    
    reportBug() {
        // Открытие формы для сообщения об ошибках
        this.showNotification(
            'Сообщить об ошибке',
            'Пожалуйста, опишите проблему в разделе "Поддержка".',
            'info'
        );
        
        // Навигация к форме поддержки
        this.navigateToSection('support');
    }
    
    trackNavigation(section) {
        console.log(`📍 Навигация: ${section}`);
        // Здесь может быть интеграция с аналитикой
    }

    // ===== СИСТЕМА ФОРМ =====
    
    initForms() {
        console.log('📝 Инициализация форм');
        
        // Форма входа
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Форма регистрации
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
        
        // Форма поддержки
        const supportForm = document.getElementById('supportForm');
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSupportRequest();
            });
        }
        
        // Кнопка отмены поддержки
        const supportCancel = document.getElementById('supportCancel');
        if (supportCancel) {
            supportCancel.addEventListener('click', () => {
                supportForm.reset();
            });
        }
        
        // Форма промокода
        const promoInput = document.getElementById('promoInput');
        const activatePromo = document.getElementById('activatePromo');
        
        if (promoInput && activatePromo) {
            activatePromo.addEventListener('click', () => {
                this.activateUserPromoCode();
            });
            
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.activateUserPromoCode();
                }
            });
        }
        
        // Форма принятия правил
        const acceptRules = document.getElementById('acceptRules');
        if (acceptRules) {
            acceptRules.addEventListener('click', () => {
                this.acceptRules();
            });
        }
        
        // Копирование реферальной ссылки
        const copyReferralLink = document.getElementById('copyReferralLink');
        if (copyReferralLink) {
            copyReferralLink.addEventListener('click', () => {
                this.copyReferralLink();
            });
        }
        
        // Получение ежедневного бонуса
        const claimDailyBonus = document.getElementById('claimDailyBonus');
        if (claimDailyBonus) {
            claimDailyBonus.addEventListener('click', () => {
                this.claimDailyBonus();
            });
        }
        
        // Покупка пакетов
        document.querySelectorAll('.btn-purchase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const packageId = e.target.getAttribute('data-package');
                this.handlePurchase(packageId);
            });
        });
        
        // Покупка монет
        document.querySelectorAll('[data-coins]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const coins = e.target.getAttribute('data-coins');
                this.handleCoinPurchase(coins);
            });
        });
    }
    
    async handleLogin() {
        const form = document.getElementById('loginForm');
        if (!form) return;
        
        const username = document.getElementById('loginUsername')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;
        const remember = document.getElementById('rememberSession')?.checked;
        
        // Валидация
        if (!this.validateLoginForm(username, password)) {
            return;
        }
        
        // Показ лоадера
        this.showFormLoading('loginSubmit');
        
        try {
            // Симуляция API запроса
            await this.simulateApiCall(1500);
            
            // Успешный вход
            this.state.isAuthenticated = true;
            this.currentUser = {
                username,
                email: `${username}@bloodybutterfly.ru`,
                role: 'user',
                joinDate: new Date().toISOString()
            };
            
            // Сохранение сессии
            if (remember) {
                this.saveSession();
            }
            
            // Закрытие модального окна
            this.closeModal('loginModal');
            
            // Обновление интерфейса
            this.updateUserInterface();
            
            // Уведомление
            this.showNotification(
                'Добро пожаловать! 👋',
                `Вы успешно вошли как ${username}`,
                'success'
            );
            
        } catch (error) {
            console.error('Ошибка входа:', error);
            this.showNotification(
                'Ошибка входа',
                'Неверное имя пользователя или пароль',
                'error'
            );
        } finally {
            this.hideFormLoading('loginSubmit');
        }
    }
    
    validateLoginForm(username, password) {
        if (!username || username.length < 3) {
            this.showNotification(
                'Ошибка валидации',
                'Имя пользователя должно содержать минимум 3 символа',
                'error'
            );
            return false;
        }
        
        if (!password || password.length < this.config.minPasswordLength) {
            this.showNotification(
                'Ошибка валидации',
                `Пароль должен содержать минимум ${this.config.minPasswordLength} символов`,
                'error'
            );
            return false;
        }
        
        // Проверка сложности пароля
        if (!this.validatePassword(password)) {
            this.showNotification(
                'Слабый пароль',
                'Пароль слишком слабый. Используйте более сложный пароль.',
                'warning'
            );
            return false;
        }
        
        return true;
    }
    
    async handleRegistration() {
        const form = document.getElementById('registerForm');
        if (!form) return;
        
        const username = document.getElementById('registerUsername')?.value.trim();
        const email = document.getElementById('registerEmail')?.value.trim();
        const password = document.getElementById('registerPassword')?.value;
        const confirmPassword = document.getElementById('registerConfirmPassword')?.value;
        const acceptTerms = document.getElementById('acceptTerms')?.checked;
        const acceptNewsletter = document.getElementById('acceptNewsletter')?.checked;
        const captcha = document.getElementById('captchaInput')?.value;
        
        // Валидация
        if (!this.validateRegistrationForm(username, email, password, confirmPassword, acceptTerms, captcha)) {
            return;
        }
        
        // Показ лоадера
        this.showFormLoading('registerSubmit');
        
        try {
            // Симуляция API запроса
            await this.simulateApiCall(2000);
            
            // Успешная регистрация
            this.state.isAuthenticated = true;
            this.currentUser = {
                username,
                email,
                role: 'user',
                joinDate: new Date().toISOString(),
                settings: {
                    newsletter: acceptNewsletter
                }
            };
            
            // Сохранение пользователя
            this.saveUserData();
            
            // Отправка email подтверждения
            this.sendConfirmationEmail(email);
            
            // Закрытие модального окна
            this.closeModal('registerModal');
            
            // Обновление интерфейса
            this.updateUserInterface();
            
            // Уведомление
            this.showNotification(
                'Регистрация успешна! 🎉',
                `Аккаунт ${username} создан. Проверьте почту для подтверждения.`,
                'success'
            );
            
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            this.showNotification(
                'Ошибка регистрации',
                'Не удалось создать аккаунт. Попробуйте позже.',
                'error'
            );
        } finally {
            this.hideFormLoading('registerSubmit');
        }
    }
    
    validateRegistrationForm(username, email, password, confirmPassword, acceptTerms, captcha) {
        // Проверка никнейма
        if (!username || username.length < 3) {
            this.showNotification(
                'Ошибка валидации',
                'Имя пользователя должно содержать минимум 3 символа',
                'error'
            );
            return false;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            this.showNotification(
                'Ошибка валидации',
                'Имя пользователя может содержать только латинские буквы, цифры и подчеркивания',
                'error'
            );
            return false;
        }
        
        // Проверка email
        if (!email || !this.validateEmail(email)) {
            this.showNotification(
                'Ошибка валидации',
                'Введите корректный email адрес',
                'error'
            );
            return false;
        }
        
        // Проверка пароля
        if (!password || password.length < this.config.minPasswordLength) {
            this.showNotification(
                'Ошибка валидации',
                `Пароль должен содержать минимум ${this.config.minPasswordLength} символов`,
                'error'
            );
            return false;
        }
        
        if (!this.validatePassword(password)) {
            this.showNotification(
                'Слабый пароль',
                'Пароль слишком слабый. Используйте более сложный пароль.',
                'warning'
            );
            return false;
        }
        
        // Проверка совпадения паролей
        if (password !== confirmPassword) {
            this.showNotification(
                'Ошибка валидации',
                'Пароли не совпадают',
                'error'
            );
            return false;
        }
        
        // Проверка согласия с правилами
        if (!acceptTerms) {
            this.showNotification(
                'Требуется согласие',
                'Вы должны принять пользовательское соглашение',
                'warning'
            );
            return false;
        }
        
        // Проверка капчи
        if (!captcha || !this.validateCaptcha(captcha)) {
            this.showNotification(
                'Ошибка капчи',
                'Введите правильный код с картинки',
                'error'
            );
            return false;
        }
        
        return true;
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validateCaptcha(input) {
        // Простая валидация капчи
        const storedCaptcha = sessionStorage.getItem('captchaCode');
        return input && storedCaptcha && input.toLowerCase() === storedCaptcha.toLowerCase();
    }
    
    async handleSupportRequest() {
        const form = document.getElementById('supportForm');
        if (!form) return;
        
        const name = document.getElementById('supportName')?.value.trim();
        const email = document.getElementById('supportEmail')?.value.trim();
        const category = document.getElementById('supportCategory')?.value;
        const subject = document.getElementById('supportSubject')?.value.trim();
        const message = document.getElementById('supportMessage')?.value.trim();
        
        // Валидация
        if (!name || !email || !category || !subject || !message) {
            this.showNotification(
                'Заполните все поля',
                'Все поля формы обязательны для заполнения',
                'warning'
            );
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showNotification(
                'Неверный email',
                'Введите корректный email адрес',
                'error'
            );
            return;
        }
        
        // Показ лоадера
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
        }
        
        try {
            // Симуляция отправки
            await this.simulateApiCall(1500);
            
            // Успешная отправка
            form.reset();
            
            this.showNotification(
                'Сообщение отправлено! 📨',
                'Мы получили ваше обращение. Ответим в течение 24 часов.',
                'success'
            );
            
        } catch (error) {
            console.error('Ошибка отправки:', error);
            this.showNotification(
                'Ошибка отправки',
                'Не удалось отправить сообщение. Попробуйте позже.',
                'error'
            );
        } finally {
            // Восстановление кнопки
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить сообщение';
                submitBtn.disabled = false;
            }
        }
    }
    
    activateUserPromoCode() {
        const input = document.getElementById('promoInput');
        if (!input) return;
        
        const code = input.value.trim().toUpperCase();
        
        if (!code) {
            this.showNotification(
                'Введите промокод',
                'Поле промокода не может быть пустым',
                'warning'
            );
            return;
        }
        
        // Проверка формата промокода
        if (!/^[A-Z0-9-]+$/.test(code)) {
            this.showNotification(
                'Неверный формат',
                'Промокод может содержать только латинские буквы, цифры и дефисы',
                'error'
            );
            return;
        }
        
        // Активация промокода
        this.activatePromoCode(code);
        
        // Очистка поля
        input.value = '';
        
        // Обновление истории
        this.updatePromoHistory(code);
    }
    
    updatePromoHistory(code) {
        const historyList = document.querySelector('.history-list');
        if (!historyList) return;
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-date">${new Date().toLocaleDateString()}</div>
            <div class="history-code">${code}</div>
            <div class="history-reward">Ожидание...</div>
            <div class="history-status claimed">
                <i class="fas fa-spinner fa-spin"></i>
            </div>
        `;
        
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // Обновление статуса через 2 секунды
        setTimeout(() => {
            const status = historyItem.querySelector('.history-status');
            if (status) {
                status.innerHTML = '<i class="fas fa-check"></i>';
            }
            
            const reward = historyItem.querySelector('.history-reward');
            if (reward) {
                const rewards = ['VIP 10 мин', '500 монет', 'Скидка 10%', 'Набор новичка'];
                reward.textContent = rewards[Math.floor(Math.random() * rewards.length)];
            }
        }, 2000);
    }
    
    acceptRules() {
        localStorage.setItem('rulesAccepted', 'true');
        localStorage.setItem('rulesAcceptDate', Date.now().toString());
        
        this.showNotification(
            'Правила приняты! ✅',
            'Вы подтвердили ознакомление с правилами сервера.',
            'success'
        );
    }
    
    copyReferralLink() {
        const input = document.getElementById('referralLink');
        if (!input) return;
        
        input.select();
        input.setSelectionRange(0, 99999);
        
        navigator.clipboard.writeText(input.value).then(() => {
            this.showNotification('Скопировано! 📋', 'Реферальная ссылка скопирована в буфер обмена.', 'success');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            this.showNotification('Ошибка', 'Не удалось скопировать ссылку.', 'error');
        });
    }
    
    async claimDailyBonus() {
        const button = document.getElementById('claimDailyBonus');
        if (!button) return;
        
        // Проверка доступности бонуса
        if (!this.state.bonuses.daily.available || this.state.bonuses.daily.claimed) {
            this.showNotification(
                'Бонус недоступен',
                'Вы уже получили сегодняшний бонус',
                'warning'
            );
            return;
        }
        
        // Показ лоадера
        this.showFormLoading('claimDailyBonus');
        
        try {
            // Симуляция API запроса
            await this.simulateApiCall(2000);
            
            // Получение награды
            const reward = this.getDailyReward();
            
            // Обновление состояния
            this.state.bonuses.daily.claimed = true;
            this.state.bonuses.daily.nextReset = this.getNextBonusReset();
            
            // Сохранение в localStorage
            localStorage.setItem('dailyBonusClaimed', 'true');
            localStorage.setItem('dailyBonusDate', new Date().toDateString());
            
            // Обновление интерфейса
            this.updateBonusInterface();
            
            // Показ награды
            this.showRewardNotification(reward);
            
            // Обновление статистики
            this.updateUserStatistics();
            
        } catch (error) {
            console.error('Ошибка получения бонуса:', error);
            this.showNotification(
                'Ошибка',
                'Не удалось получить бонус. Попробуйте позже.',
                'error'
            );
        } finally {
            this.hideFormLoading('claimDailyBonus');
        }
    }
    
    getDailyReward() {
        const rewards = [
            { type: 'VIP', duration: 10, chance: 0.5 },
            { type: 'VIP', duration: 20, chance: 0.25 },
            { type: 'VIP', duration: 30, chance: 0.15 },
            { type: 'DISCOUNT', value: 10, chance: 0.7 },
            { type: 'DISCOUNT', value: 20, chance: 0.2 },
            { type: 'DISCOUNT', value: 30, chance: 0.05 },
            { type: 'DISCOUNT', value: 40, chance: 0.01 }
        ];
        
        let random = Math.random();
        for (const reward of rewards) {
            if (random < reward.chance) {
                return reward;
            }
            random -= reward.chance;
        }
        
        // По умолчанию возвращаем VIP 10 минут
        return rewards[0];
    }
    
    showRewardNotification(reward) {
        let title, message;
        
        if (reward.type === 'VIP') {
            title = `🎉 VIP на ${reward.duration} минут!`;
            message = `Вы получили VIP статус на ${reward.duration} минут. Наслаждайтесь привилегиями!`;
        } else {
            title = `🎁 Скидка ${reward.value}%!`;
            message = `Вы получили промокод на скидку ${reward.value}% на все товары.`;
        }
        
        this.showNotification(title, message, 'success', 8000);
    }
    
    updateBonusInterface() {
        const button = document.getElementById('claimDailyBonus');
        if (!button) return;
        
        const btnText = button.querySelector('.btn-text');
        if (btnText) {
            btnText.innerHTML = '<i class="fas fa-check"></i> Бонус получен';
        }
        
        button.disabled = true;
        
        // Обновление статуса бонусов
        const bonusStatuses = document.querySelectorAll('.bonus-status');
        bonusStatuses.forEach(status => {
            status.innerHTML = '<i class="fas fa-check"></i> Получено';
            status.classList.remove('available');
            status.classList.add('claimed');
        });
    }
    
    async handlePurchase(packageId) {
        // Проверка авторизации
        if (!this.state.isAuthenticated) {
            this.showNotification(
                'Требуется авторизация',
                'Войдите в аккаунт для совершения покупки',
                'warning'
            );
            this.openModal('loginModal');
            return;
        }
        
        // Показ окна подтверждения
        const confirmed = await this.showPurchaseConfirmation(packageId);
        if (!confirmed) return;
        
        // Обработка покупки
        this.processPurchase(packageId);
    }
    
    async showPurchaseConfirmation(packageId) {
        return new Promise((resolve) => {
            // Создание модального окна подтверждения
            const modal = document.createElement('div');
            modal.className = 'modal-overlay active';
            modal.innerHTML = `
                <div class="modal-container modal-sm">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            <i class="fas fa-shopping-cart"></i>
                            Подтверждение покупки
                        </h2>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Вы уверены, что хотите купить этот пакет?</p>
                        <div class="form-actions">
                            <button class="btn btn-outline" id="cancelPurchase">Отмена</button>
                            <button class="btn btn-primary" id="confirmPurchase">Купить</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Обработка событий
            modal.querySelector('.modal-close').addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
            
            modal.querySelector('#cancelPurchase').addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
            
            modal.querySelector('#confirmPurchase').addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });
        });
    }
    
    async processPurchase(packageId) {
        // Показ лоадера
        this.showNotification(
            'Обработка платежа...',
            'Пожалуйста, подождите',
            'info'
        );
        
        try {
            // Симуляция обработки платежа
            await this.simulateApiCall(3000);
            
            // Успешная покупка
            this.showNotification(
                'Покупка успешна! ✅',
                'Пакет активирован на вашем аккаунте',
                'success'
            );
            
            // Обновление статистики
            this.updatePurchaseStatistics(packageId);
            
            // Обновление интерфейса пользователя
            this.updateUserInterface();
            
        } catch (error) {
            console.error('Ошибка покупки:', error);
            this.showNotification(
                'Ошибка платежа',
                'Не удалось обработать платеж. Попробуйте позже.',
                'error'
            );
        }
    }
    
    async handleCoinPurchase(coins) {
        // Аналогично handlePurchase, но для игровых монет
        if (!this.state.isAuthenticated) {
            this.showNotification(
                'Требуется авторизация',
                'Войдите в аккаунт для покупки монет',
                'warning'
            );
            this.openModal('loginModal');
            return;
        }
        
        const confirmed = await this.showCoinPurchaseConfirmation(coins);
        if (!confirmed) return;
        
        this.processCoinPurchase(coins);
    }
    
    async showCoinPurchaseConfirmation(coins) {
        return new Promise((resolve) => {
            // Реализация аналогична showPurchaseConfirmation
            resolve(true);
        });
    }
    
    async processCoinPurchase(coins) {
        try {
            await this.simulateApiCall(2000);
            
            this.showNotification(
                'Монеты куплены! 🪙',
                `${coins} игровых монет добавлены на ваш счет`,
                'success'
            );
            
        } catch (error) {
            console.error('Ошибка покупки монет:', error);
            this.showNotification(
                'Ошибка',
                'Не удалось купить монеты',
                'error'
            );
        }
    }
    
    showFormLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add('loading');
        }
    }
    
    hideFormLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.remove('loading');
        }
    }
    
    simulateApiCall(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    // ===== СИСТЕМА АНИМАЦИЙ =====
    
    initAnimations() {
        console.log('✨ Инициализация анимаций');
        
        // Анимация при скролле
        this.initScrollAnimations();
        
        // Анимация при наведении
        this.initHoverAnimations();
        
        // Анимация загрузки
        this.initLoadingAnimations();
        
        // Параллакс эффект
        this.initParallaxEffect();
    }
    
    initScrollAnimations() {
        let lastScrollTop = 0;
        const header = document.querySelector('.main-header');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Скрытие/показ шапки
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
            
            // Анимация элементов при скролле
            this.animateOnScroll();
        });
    }
    
    animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .package-card, .bonus-card, .stat-card');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    }
    
    initHoverAnimations() {
        // Анимация кнопок
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
        
        // Анимация карточек
        document.querySelectorAll('.card, .package-card, .bonus-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
    
    initLoadingAnimations() {
        // Анимация лоадера
        const loader = document.getElementById('pageLoader');
        if (loader) {
            // Анимация прогресса
            let progress = 0;
            const progressFill = document.getElementById('loaderProgress');
            const progressText = document.querySelector('.progress-text');
            
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;
                
                if (progressFill) {
                    progressFill.style.width = `${progress}%`;
                }
                
                if (progressText) {
                    progressText.textContent = `${Math.round(progress)}%`;
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 100);
        }
    }
    
    initParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // ===== СИСТЕМА SERVICE WORKER =====
    
    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').then(
                    (registration) => {
                        console.log('✅ ServiceWorker зарегистрирован:', registration.scope);
                    },
                    (error) => {
                        console.error('❌ Ошибка регистрации ServiceWorker:', error);
                    }
                );
            });
        }
    }

    // ===== WEB SOCKET СИСТЕМА =====
    
    initWebSocket() {
        try {
            this.ws = new WebSocket(this.config.wsUrl);
            
            this.ws.onopen = () => {
                console.log('✅ WebSocket подключен');
                this.showNotification('Соединение установлено', 'Сервер подключен в реальном времени', 'success');
            };
            
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };
            
            this.ws.onerror = (error) => {
                console.error('❌ WebSocket ошибка:', error);
            };
            
            this.ws.onclose = () => {
                console.log('📡 WebSocket отключен');
                // Попытка переподключения через 5 секунд
                setTimeout(() => this.initWebSocket(), 5000);
            };
            
        } catch (error) {
            console.error('❌ Ошибка инициализации WebSocket:', error);
        }
    }
    
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'player_count':
                this.updatePlayerCount(data.count);
                break;
                
            case 'server_status':
                this.updateServerStatus(data.status);
                break;
                
            case 'notification':
                this.showNotification(data.title, data.message, data.level || 'info');
                break;
                
            case 'bonus_available':
                this.handleBonusNotification(data);
                break;
                
            case 'chat_message':
                this.handleChatMessage(data);
                break;
        }
    }
    
    updatePlayerCount(count) {
        this.state.statistics.onlinePlayers = count;
        
        // Обновление счетчиков на странице
        const elements = document.querySelectorAll('#onlinePlayers, #livePlayers, #footerPlayers');
        elements.forEach(el => {
            if (el) el.textContent = count;
        });
    }
    
    updateServerStatus(status) {
        const indicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        if (indicator && statusText) {
            if (status === 'online') {
                indicator.classList.add('online');
                indicator.classList.remove('offline');
                statusText.textContent = 'Сервер онлайн';
                statusText.style.color = '#00cc88';
            } else {
                indicator.classList.remove('online');
                indicator.classList.add('offline');
                statusText.textContent = 'Сервер оффлайн';
                statusText.style.color = '#ff3333';
            }
        }
    }
    
    handleBonusNotification(data) {
        if (data.available) {
            this.showNotification(
                'Новый бонус доступен! 🎁',
                data.message || 'Проверьте вкладку "Бонусы" для получения награды',
                'info',
                10000
            );
        }
    }
    
    handleChatMessage(data) {
        // Здесь может быть обработка чата в реальном времени
        console.log('💬 Чат:', data);
    }

    // ===== МОНИТОРИНГ ПРОИЗВОДИТЕЛЬНОСТИ =====
    
    initPerformanceMonitoring() {
        // Мониторинг производительности
        if ('performance' in window) {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`⏱️ Время загрузки страницы: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('⚠️ Долгая загрузка страницы');
            }
        }
        
        // Мониторинг памяти
        if ('memory' in performance) {
            setInterval(() => {
                const usedMemory = performance.memory.usedJSHeapSize;
                const totalMemory = performance.memory.totalJSHeapSize;
                const memoryUsage = (usedMemory / totalMemory) * 100;
                
                if (memoryUsage > 80) {
                    console.warn(`⚠️ Высокое использование памяти: ${memoryUsage.toFixed(1)}%`);
                }
            }, 30000);
        }
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ =====
    
    hideLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }
    
    async loadUserData() {
        try {
            // Загрузка данных из localStorage
            const userData = localStorage.getItem('userData');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.state.isAuthenticated = true;
                
                // Обновление интерфейса
                this.updateUserInterface();
            }
            
            // Загрузка настроек
            const settings = localStorage.getItem('userSettings');
            if (settings) {
                this.state.settings = { ...this.state.settings, ...JSON.parse(settings) };
                this.applySettings();
            }
            
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    }
    
    saveUserData() {
        try {
            if (this.currentUser) {
                localStorage.setItem('userData', JSON.stringify(this.currentUser));
            }
        } catch (error) {
            console.error('Ошибка сохранения данных пользователя:', error);
        }
    }
    
    saveSession() {
        try {
            const sessionData = {
                user: this.currentUser,
                timestamp: Date.now()
            };
            sessionStorage.setItem('userSession', JSON.stringify(sessionData));
        } catch (error) {
            console.error('Ошибка сохранения сессии:', error);
        }
    }
    
    updateUserInterface() {
        // Обновление интерфейса в зависимости от состояния пользователя
        if (this.state.isAuthenticated && this.currentUser) {
            // Показ имени пользователя
            const userElements = document.querySelectorAll('.user-name');
            userElements.forEach(el => {
                el.textContent = this.currentUser.username;
            });
            
            // Обновление кнопок авторизации
            document.querySelectorAll('.auth-section').forEach(section => {
                section.innerHTML = `
                    <div class="user-profile">
                        <div class="user-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-info">
                            <div class="user-name">${this.currentUser.username}</div>
                            <div class="user-status">Online</div>
                        </div>
                    </div>
                `;
            });
            
        } else {
            // Сброс интерфейса к состоянию гостя
            document.querySelectorAll('.auth-section').forEach(section => {
                section.innerHTML = `
                    <button class="btn btn-login">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>Вход</span>
                    </button>
                    <button class="btn btn-primary btn-register">
                        <i class="fas fa-user-plus"></i>
                        <span>Регистрация</span>
                    </button>
                `;
            });
        }
    }
    
    applySettings() {
        // Применение настроек темы
        if (this.state.settings.theme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        } else {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        }
        
        // Применение настроек уведомлений
        if (!this.state.settings.notifications) {
            // Отключение уведомлений
            console.log('🔕 Уведомления отключены');
        }
    }
    
    async updateStatistics() {
        try {
            // Обновление статистики сервера
            const stats = await this.fetchServerStatistics();
            if (stats) {
                this.state.statistics = { ...this.state.statistics, ...stats };
                this.updateStatisticsDisplay();
            }
        } catch (error) {
            console.error('Ошибка обновления статистики:', error);
        }
    }
    
    async fetchServerStatistics() {
        // Симуляция запроса к API
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    onlinePlayers: Math.floor(Math.random() * 50) + 100,
                    uptime: 99.8,
                    newPlayersToday: Math.floor(Math.random() * 20) + 30,
                    monthlyDonations: Math.floor(Math.random() * 10000) + 20000
                });
            }, 1000);
        });
    }
    
    updateStatisticsDisplay() {
        // Обновление счетчика игроков
        const playerElements = document.querySelectorAll('#onlinePlayers, #livePlayers, #footerPlayers');
        playerElements.forEach(el => {
            if (el) el.textContent = this.state.statistics.onlinePlayers;
        });
        
        // Обновление других статистик
        const uptimeElement = document.querySelector('#uptimeStat');
        if (uptimeElement) uptimeElement.textContent = `${this.state.statistics.uptime}%`;
        
        const monthsElement = document.querySelector('#monthsStat');
        if (monthsElement) monthsElement.textContent = this.state.statistics.monthsOnline;
    }
    
    checkDailyBonus() {
        const lastClaimDate = localStorage.getItem('dailyBonusDate');
        const today = new Date().toDateString();
        
        if (lastClaimDate === today) {
            this.state.bonuses.daily.claimed = true;
            this.state.bonuses.daily.available = false;
        } else {
            this.state.bonuses.daily.claimed = false;
            this.state.bonuses.daily.available = true;
        }
    }
    
    getNextBonusReset() {
        const now = new Date();
        const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        return nextDay.getTime();
    }
    
    updatePurchaseStatistics(packageId) {
        // Обновление статистики покупок
        const purchases = JSON.parse(localStorage.getItem('userPurchases') || '[]');
        purchases.push({
            packageId,
            date: new Date().toISOString(),
            amount: this.getPackagePrice(packageId)
        });
        
        localStorage.setItem('userPurchases', JSON.stringify(purchases));
        
        // Обновление общей статистики
        this.state.statistics.monthlyDonations += this.getPackagePrice(packageId);
    }
    
    getPackagePrice(packageId) {
        const prices = {
            'monthly-basic': 299,
            'monthly-premium': 799,
            'monthly-ultimate': 1499,
            'perm-vip': 1999,
            'perm-premium': 4999,
            'perm-ultimate': 9999
        };
        
        return prices[packageId] || 0;
    }
    
    updateUserStatistics() {
        // Обновление статистики пользователя
        const userStats = JSON.parse(localStorage.getItem('userStatistics') || '{}');
        
        userStats.totalBonuses = (userStats.totalBonuses || 0) + 1;
        userStats.lastBonusDate = new Date().toISOString();
        
        localStorage.setItem('userStatistics', JSON.stringify(userStats));
    }
    
    sendConfirmationEmail(email) {
        // Симуляция отправки email
        console.log(`📧 Отправка подтверждения на ${email}`);
        
        setTimeout(() => {
            this.showNotification(
                'Письмо отправлено',
                `Код подтверждения отправлен на ${email}`,
                'info'
            );
        }, 2000);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BloodyButterflyApp();
});

// Глобальные обработчики ошибок
window.addEventListener('error', (event) => {
    console.error('❌ Глобальная ошибка:', event.error);
    
    if (window.app) {
        window.app.showNotification(
            'Произошла ошибка',
            'Пожалуйста, обновите страницу или сообщите об ошибке в поддержку.',
            'error'
        );
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Необработанный промис:', event.reason);
});

// Экспорт для использования в консоли
window.BloodyButterflyApp = BloodyButterflyApp;
