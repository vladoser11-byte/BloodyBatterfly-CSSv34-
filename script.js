// BloodyBatterfly Server Website - Script File
// Создатель сайта: GmeowG
// Создатель сервера: KILLMAKER
// Версия: 2026 Новогоднее издание

// Глобальные переменные и константы
const API_BASE_URL = 'https://api.bloodybatterfly.serv.cc';
const SITE_VERSION = '2026.1.0';
const NEW_YEAR_DATE = new Date('2026-01-01T00:00:00').getTime();

// Предустановленные промокоды
const PROMO_CODES = [
    {
        code: 'BloodyBatterfly2026NewYers',
        type: 'discount',
        discount: 15,
        description: 'Скидка на все донат-пакеты',
        expires: '2026-01-31'
    },
    {
        code: 'GmaowG-thans',
        type: 'discount',
        discount: 20,
        description: 'Бонус от создателя сайта',
        expires: '2026-02-28'
    },
    {
        code: 'KILLMAKERHappyNewYers',
        type: 'vip',
        duration: 7,
        description: 'VIP на 7 дней от создателя сервера',
        expires: '2026-01-15'
    },
    {
        code: 'HappyNewYers',
        type: 'discount',
        discount: 10,
        description: 'С новым годом!',
        expires: '2026-01-10'
    },
    {
        code: 'Meow',
        type: 'bonus',
        bonus: 'extra_daily',
        description: 'Дополнительный ежедневный бонус',
        expires: '2026-12-31'
    },
    {
        code: 'Bloody',
        type: 'vip',
        duration: 1,
        description: 'VIP на 1 день',
        expires: '2026-12-31'
    },
    {
        code: '[BloodyBatteflytimeTOplay]',
        type: 'discount',
        discount: 25,
        description: 'Особая скидка',
        expires: '2026-03-01'
    },
    {
        code: 'youSOgoodPlayer',
        type: 'bonus',
        bonus: 'double_xp',
        description: 'Двойной опыт на 24 часа',
        expires: '2026-12-31'
    },
    {
        code: '2025-2026',
        type: 'discount',
        discount: 30,
        description: 'Переходный годовой бонус',
        expires: '2026-01-07'
    },
    {
        code: 'Deeeeeeep',
        type: 'vip',
        duration: 3,
        description: 'VIP на 3 дня',
        expires: '2026-02-01'
    }
];

// Состояние приложения
const AppState = {
    user: null,
    isAuthenticated: false,
    currentPage: 'home',
    notifications: [],
    dailyBonusClaimed: false,
    activatedPromoCodes: [],
    userDiscount: 0,
    vipUntil: null
};

// DOM элементы
const DOM = {
    // Основные контейнеры
    container: document.querySelector('.container'),
    mainContent: document.getElementById('mainContent'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    notificationContainer: document.getElementById('notificationContainer'),
    
    // Навигация
    navLinks: document.querySelectorAll('.nav-link'),
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    
    // Страницы
    pages: document.querySelectorAll('.page'),
    
    // Профиль
    profileUsername: document.getElementById('profileUsername'),
    profileEmail: document.getElementById('profileEmail'),
    profileRegDate: document.getElementById('profileRegDate'),
    profileServerStatus: document.getElementById('profileServerStatus'),
    changeAvatarBtn: document.getElementById('changeAvatarBtn'),
    changeNicknameBtn: document.getElementById('changeNicknameBtn'),
    changePasswordBtn: document.getElementById('changePasswordBtn'),
    verifyEmailBtn: document.getElementById('verifyEmailBtn'),
    linkServerBtn: document.getElementById('linkServerBtn'),
    
    // Модальные окна
    loginModal: document.getElementById('loginModal'),
    registerModal: document.getElementById('registerModal'),
    avatarModal: document.getElementById('avatarModal'),
    nicknameModal: document.getElementById('nicknameModal'),
    passwordModal: document.getElementById('passwordModal'),
    santaModal: document.getElementById('santaModal'),
    
    // Таймер нового года
    daysEl: document.getElementById('days'),
    hoursEl: document.getElementById('hours'),
    minutesEl: document.getElementById('minutes'),
    secondsEl: document.getElementById('seconds'),
    
    // Ежедневный бонус
    bonusCalendar: document.getElementById('bonusCalendar'),
    claimBonusBtn: document.getElementById('claimBonusBtn'),
    bonusHistory: document.getElementById('bonusHistory'),
    
    // Промокоды
    promocodeInput: document.getElementById('promocodeInput'),
    activatePromoBtn: document.getElementById('activatePromoBtn'),
    promocodesList: document.getElementById('promocodesList'),
    activatedPromocodes: document.getElementById('activatedPromocodes'),
    
    // Донат
    donateTelegramBtn: document.getElementById('donateTelegramBtn'),
    packageBtns: document.querySelectorAll('.package-btn'),
    
    // Санта
    santa: document.getElementById('santa'),
    closeSantaModal: document.querySelector('.close-santa-modal'),
    santaPromoCode: document.getElementById('santaPromoCode')
};

// Инициализация приложения
class BloodyBatterflyApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.initEventListeners();
        this.loadUserState();
        this.startAnimations();
        this.updateDateTime();
        this.startNewYearCountdown();
        this.initSanta();
        this.generateBonusCalendar();
        this.renderPromoCodes();
        this.checkDailyBonus();
        this.setupPasswordValidation();
        this.setupPageTransitions();
        
        // Показать уведомление о загрузке
        this.showNotification('Добро пожаловать на BloodyBatterfly!', 'Новогодняя версия 2026', 'info');
        
        // Автоматически показывать ежедневный бонус если не забран
        setTimeout(() => {
            if (!AppState.dailyBonusClaimed && AppState.isAuthenticated) {
                this.showNotification('Не забудьте получить ежедневный бонус!', 'Доступно в разделе "Ежедневный бонус"', 'info');
            }
        }, 3000);
    }
    
    // Инициализация обработчиков событий
    initEventListeners() {
        // Навигация
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            });
        });
        
        // Кнопки авторизации
        DOM.loginBtn.addEventListener('click', () => this.showModal('loginModal'));
        DOM.registerBtn.addEventListener('click', () => this.showModal('registerModal'));
        
        // Модальные окны
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                this.hideModal(modal.id);
            });
        });
        
        // Кнопки закрытия модальных окон при клике на оверлей
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
        
        // Переключение между логином и регистрацией
        document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('loginModal');
            this.showModal('registerModal');
        });
        
        document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('registerModal');
            this.showModal('loginModal');
        });
        
        // Форма входа
        document.getElementById('submitLoginBtn')?.addEventListener('click', () => this.handleLogin());
        document.getElementById('cancelLoginBtn')?.addEventListener('click', () => this.hideModal('loginModal'));
        
        // Форма регистрации
        document.getElementById('submitRegisterBtn')?.addEventListener('click', () => this.handleRegister());
        document.getElementById('cancelRegisterBtn')?.addEventListener('click', () => this.hideModal('registerModal'));
        
        // Профиль
        DOM.changeAvatarBtn?.addEventListener('click', () => this.showModal('avatarModal'));
        DOM.changeNicknameBtn?.addEventListener('click', () => this.showModal('nicknameModal'));
        DOM.changePasswordBtn?.addEventListener('click', () => this.showModal('passwordModal'));
        DOM.verifyEmailBtn?.addEventListener('click', () => this.verifyEmail());
        DOM.linkServerBtn?.addEventListener('click', () => this.linkServerAccount());
        
        // Модальное окно аватара
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
        
        document.getElementById('saveAvatarBtn')?.addEventListener('click', () => this.saveAvatar());
        document.getElementById('cancelAvatarBtn')?.addEventListener('click', () => this.hideModal('avatarModal'));
        
        // Модальное окно смены ника
        document.getElementById('saveNicknameBtn')?.addEventListener('click', () => this.changeNickname());
        document.getElementById('cancelNicknameBtn')?.addEventListener('click', () => this.hideModal('nicknameModal'));
        
        // Модальное окно смены пароля
        document.getElementById('savePasswordBtn')?.addEventListener('click', () => this.changePassword());
        document.getElementById('cancelPasswordBtn')?.addEventListener('click', () => this.hideModal('passwordModal'));
        
        // Валидация пароля в реальном времени
        document.getElementById('newPassword')?.addEventListener('input', (e) => this.validatePassword(e.target.value));
        document.getElementById('regPassword')?.addEventListener('input', (e) => this.validatePassword(e.target.value, true));
        
        // Ежедневный бонус
        DOM.claimBonusBtn?.addEventListener('click', () => this.claimDailyBonus());
        
        // Промокоды
        DOM.activatePromoBtn?.addEventListener('click', () => this.activatePromoCode());
        DOM.promocodeInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.activatePromoCode();
        });
        
        // Донат
        DOM.donateTelegramBtn?.addEventListener('click', () => this.redirectToTelegram());
        DOM.packageBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectPackage(e.target.getAttribute('data-package')));
        });
        
        // Санта
        DOM.santa?.addEventListener('click', () => this.showSantaModal());
        DOM.closeSantaModal?.addEventListener('click', () => this.hideModal('santaModal'));
        
        // Правила
        document.querySelectorAll('.category').forEach(category => {
            category.addEventListener('click', (e) => {
                const categoryName = e.currentTarget.getAttribute('data-category');
                this.showRulesCategory(categoryName);
            });
        });
        
        // Поддержка
        document.getElementById('submitSupportBtn')?.addEventListener('click', () => this.submitSupportRequest());
        
        // Закрытие уведомлений при клике
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification')) {
                const notification = e.target.closest('.notification');
                notification.remove();
            }
        });
        
        // Обработка Escape для закрытия модальных окон
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-overlay.active');
                if (openModal) {
                    this.hideModal(openModal.id);
                }
            }
        });
    }
    
    // Навигация по страницам
    navigateTo(page) {
        // Скрыть все страницы
        DOM.pages.forEach(p => p.classList.remove('active'));
        
        // Обновить активную ссылку в навигации
        DOM.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
        
        // Показать выбранную страницу
        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
            AppState.currentPage = page;
            
            // Прокрутить наверх
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Загрузить данные страницы если необходимо
            this.loadPageData(page);
        }
    }
    
    // Загрузка данных для страницы
    loadPageData(page) {
        switch(page) {
            case 'profile':
                this.loadProfileData();
                break;
            case 'bonus':
                this.updateBonusHistory();
                break;
            case 'promocodes':
                this.updateActivatedPromoCodes();
                break;
        }
    }
    
    // Загрузка состояния пользователя
    loadUserState() {
        const savedUser = localStorage.getItem('bb_user');
        const savedAuth = localStorage.getItem('bb_auth');
        const savedBonus = localStorage.getItem('bb_daily_bonus');
        const savedPromos = localStorage.getItem('bb_activated_promos');
        const savedDiscount = localStorage.getItem('bb_user_discount');
        const savedVIP = localStorage.getItem('bb_vip_until');
        
        if (savedUser && savedAuth === 'true') {
            try {
                AppState.user = JSON.parse(savedUser);
                AppState.isAuthenticated = true;
                this.updateAuthUI();
            } catch (e) {
                console.error('Ошибка загрузки данных пользователя:', e);
                localStorage.clear();
            }
        }
        
        if (savedBonus) {
            const lastClaim = new Date(savedBonus);
            const today = new Date();
            AppState.dailyBonusClaimed = lastClaim.toDateString() === today.toDateString();
        }
        
        if (savedPromos) {
            try {
                AppState.activatedPromoCodes = JSON.parse(savedPromos);
            } catch (e) {
                AppState.activatedPromoCodes = [];
            }
        }
        
        if (savedDiscount) {
            AppState.userDiscount = parseInt(savedDiscount) || 0;
        }
        
        if (savedVIP) {
            AppState.vipUntil = new Date(savedVIP);
        }
    }
    
    // Обновление UI в зависимости от авторизации
    updateAuthUI() {
        if (AppState.isAuthenticated && AppState.user) {
            // Обновить кнопки авторизации
            DOM.loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Выйти';
            DOM.loginBtn.onclick = () => this.logout();
            
            DOM.registerBtn.style.display = 'none';
            
            // Обновить данные в профиле
            this.updateProfileDisplay();
            
            // Показать уведомление
            this.showNotification(`Добро пожаловать, ${AppState.user.username}!`, 'Успешный вход в аккаунт', 'success');
        } else {
            DOM.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти';
            DOM.loginBtn.onclick = () => this.showModal('loginModal');
            
            DOM.registerBtn.style.display = 'flex';
            DOM.registerBtn.onclick = () => this.showModal('registerModal');
            
            // Сбросить данные профиля
            this.resetProfileDisplay();
        }
    }
    
    // Обновление отображения профиля
    updateProfileDisplay() {
        if (!AppState.user) return;
        
        DOM.profileUsername.textContent = AppState.user.username;
        DOM.profileEmail.textContent = AppState.user.email || 'Не указан';
        DOM.profileRegDate.textContent = AppState.user.registeredDate || '--.--.----';
        DOM.profileServerStatus.textContent = AppState.user.serverLinked ? 'Привязан' : 'Не привязан';
        DOM.profileServerStatus.style.color = AppState.user.serverLinked ? '#4caf50' : '#f44336';
        
        // Обновить аватар
        if (AppState.user.avatar) {
            DOM.currentAvatar.innerHTML = `<img src="${AppState.user.avatar}" alt="Аватар" style="width: 100%; height: 100%; object-fit: cover;">`;
        }
    }
    
    // Сброс отображения профиля
    resetProfileDisplay() {
        DOM.profileUsername.textContent = 'Неавторизован';
        DOM.profileEmail.textContent = 'Не указан';
        DOM.profileRegDate.textContent = '--.--.----';
        DOM.profileServerStatus.textContent = 'Не привязан';
        DOM.profileServerStatus.style.color = '#f44336';
        DOM.currentAvatar.innerHTML = '<i class="fas fa-user fa-4x"></i>';
    }
    
    // Вход в аккаунт
    async handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        if (!username || !password) {
            this.showNotification('Ошибка', 'Заполните все поля', 'error');
            return;
        }
        
        this.showLoading();
        
        try {
            // Имитация запроса к API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Проверка пользователя (в реальном приложении здесь будет запрос к серверу)
            const users = JSON.parse(localStorage.getItem('bb_registered_users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                AppState.user = {
                    username: user.username,
                    email: user.email,
                    registeredDate: user.registeredDate,
                    serverLinked: user.serverLinked || false,
                    avatar: user.avatar || null
                };
                
                AppState.isAuthenticated = true;
                
                if (rememberMe) {
                    localStorage.setItem('bb_user', JSON.stringify(AppState.user));
                    localStorage.setItem('bb_auth', 'true');
                }
                
                this.updateAuthUI();
                this.hideModal('loginModal');
                this.navigateTo('profile');
                this.showNotification('Успешный вход!', `Добро пожаловать, ${username}!`, 'success');
                
                // Очистить поля формы
                document.getElementById('loginUsername').value = '';
                document.getElementById('loginPassword').value = '';
            } else {
                throw new Error('Неверный логин или пароль');
            }
        } catch (error) {
            this.showNotification('Ошибка входа', error.message, 'error');
            document.getElementById('loginPassword').classList.add('error-shake');
            setTimeout(() => {
                document.getElementById('loginPassword').classList.remove('error-shake');
            }, 500);
        } finally {
            this.hideLoading();
        }
    }
    
    // Регистрация аккаунта
    async handleRegister() {
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Валидация
        if (!username || !email || !password || !confirmPassword) {
            this.showNotification('Ошибка', 'Заполните все поля', 'error');
            return;
        }
        
        if (!agreeTerms) {
            this.showNotification('Ошибка', 'Необходимо согласиться с правилами', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showNotification('Ошибка', 'Пароли не совпадают', 'error');
            document.getElementById('regConfirmPassword').classList.add('error-shake');
            setTimeout(() => {
                document.getElementById('regConfirmPassword').classList.remove('error-shake');
            }, 500);
            return;
        }
        
        // Проверка сложности пароля
        if (!this.isPasswordStrong(password)) {
            this.showNotification('Ошибка', 'Пароль слишком слабый. Используйте английские буквы, цифры и специальные символы', 'error');
            return;
        }
        
        // Проверка на простые пароли
        if (this.isCommonPassword(password)) {
            this.showNotification('Ошибка', 'Пароль слишком простой. Используйте более сложную комбинацию', 'error');
            return;
        }
        
        this.showLoading();
        
        try {
            // Имитация запроса к API
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Проверка существующего пользователя
            const users = JSON.parse(localStorage.getItem('bb_registered_users') || '[]');
            const existingUser = users.find(u => u.username === username || u.email === email);
            
            if (existingUser) {
                throw new Error('Пользователь с таким именем или email уже существует');
            }
            
            // Создание нового пользователя
            const newUser = {
                username,
                email,
                password, // В реальном приложении пароль должен быть захеширован
                registeredDate: new Date().toLocaleDateString('ru-RU'),
                serverLinked: false,
                avatar: null,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('bb_registered_users', JSON.stringify(users));
            
            // Имитация отправки email подтверждения
            this.sendVerificationEmail(email, username);
            
            // Автоматический вход
            AppState.user = {
                username: newUser.username,
                email: newUser.email,
                registeredDate: newUser.registeredDate,
                serverLinked: false,
                avatar: null
            };
            
            AppState.isAuthenticated = true;
            localStorage.setItem('bb_user', JSON.stringify(AppState.user));
            localStorage.setItem('bb_auth', 'true');
            
            // Автоматическая скидка для зарегистрированных пользователей
            this.applyRegistrationDiscount();
            
            this.updateAuthUI();
            this.hideModal('registerModal');
            this.navigateTo('profile');
            
            this.showNotification(
                'Регистрация успешна!',
                'На ваш email отправлено письмо с подтверждением. Не забудьте привязать аккаунт к серверу!',
                'success'
            );
            
            // Очистить поля формы
            document.getElementById('regUsername').value = '';
            document.getElementById('regEmail').value = '';
            document.getElementById('regPassword').value = '';
            document.getElementById('regConfirmPassword').value = '';
            document.getElementById('agreeTerms').checked = false;
            
        } catch (error) {
            this.showNotification('Ошибка регистрации', error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    // Применение скидки при регистрации
    applyRegistrationDiscount() {
        AppState.userDiscount = 5; // 5% скидка при регистрации
        localStorage.setItem('bb_user_discount', AppState.userDiscount.toString());
        
        this.showNotification(
            'Бонус за регистрацию!',
            `Вам начислена скидка ${AppState.userDiscount}% на все покупки`,
            'success'
        );
    }
    
    // Выход из аккаунта
    logout() {
        AppState.user = null;
        AppState.isAuthenticated = false;
        localStorage.removeItem('bb_user');
        localStorage.removeItem('bb_auth');
        
        this.updateAuthUI();
        this.navigateTo('home');
        
        this.showNotification('Вы вышли из аккаунта', 'До новых встреч!', 'info');
    }
    
    // Проверка сложности пароля
    isPasswordStrong(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        return password.length >= minLength && 
               hasUpperCase && 
               hasLowerCase && 
               hasNumbers && 
               hasSpecial;
    }
    
    // Проверка на простые пароли
    isCommonPassword(password) {
        const commonPasswords = [
            '123456', '123456789', 'password', 'qwerty', '111111',
            '12345678', 'abc123', 'password1', '12345', '1234567890'
        ];
        
        return commonPasswords.includes(password.toLowerCase());
    }
    
    // Валидация пароля в реальном времени
    validatePassword(password, isRegistration = false) {
        const strengthBar = document.querySelector(isRegistration ? 
            '#regPassword + .password-strength .strength-bar' : 
            '#newPassword + .password-strength .strength-bar');
        const strengthText = document.querySelector(isRegistration ? 
            '#regPassword + .password-strength .strength-text' : 
            '#newPassword + .password-strength .strength-text');
        
        if (!strengthBar || !strengthText) return;
        
        let strength = 0;
        let color = '#f44336';
        let text = 'Слабый';
        
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 25;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
        
        strengthBar.style.width = `${strength}%`;
        
        if (strength >= 75) {
            color = '#4caf50';
            text = 'Сильный';
        } else if (strength >= 50) {
            color = '#ff9800';
            text = 'Средний';
        } else if (strength >= 25) {
            color = '#ff9800';
            text = 'Слабый';
        }
        
        strengthBar.style.background = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
    
    // Отправка email подтверждения
    async sendVerificationEmail(email, username) {
        // Имитация отправки email
        const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        // Сохранить код для проверки
        localStorage.setItem(`bb_verify_${email}`, verificationCode);
        
        // В реальном приложении здесь будет запрос к API отправки email
        console.log(`Отправка письма подтверждения на ${email}`);
        console.log(`Код подтверждения для ${username}: ${verificationCode}`);
        
        // Показать уведомление
        this.showNotification(
            'Письмо отправлено',
            'На ваш email отправлен код подтверждения. Проверьте почту.',
            'info'
        );
    }
    
    // Подтверждение email
    verifyEmail() {
        if (!AppState.user || !AppState.user.email) {
            this.showNotification('Ошибка', 'Сначала войдите в аккаунт', 'error');
            return;
        }
        
        const email = AppState.user.email;
        const verificationCode = prompt('Введите код подтверждения из письма:');
        
        if (!verificationCode) return;
        
        const savedCode = localStorage.getItem(`bb_verify_${email}`);
        
        if (verificationCode === savedCode) {
            localStorage.removeItem(`bb_verify_${email}`);
            this.showNotification('Email подтвержден!', 'Теперь вы можете использовать все функции аккаунта', 'success');
        } else {
            this.showNotification('Ошибка', 'Неверный код подтверждения', 'error');
        }
    }
    
    // Привязка аккаунта к серверу
    linkServerAccount() {
        if (!AppState.isAuthenticated) {
            this.showNotification('Ошибка', 'Сначала войдите в аккаунт', 'error');
            return;
        }
        
        const serverNickname = prompt('Введите ваш никнейм на сервере BloodyBatterfly:');
        
        if (!serverNickname) return;
        
        if (serverNickname !== AppState.user.username) {
            const confirmLink = confirm(`Внимание! Ваш ник на сайте (${AppState.user.username}) не совпадает с введенным ником на сервере (${serverNickname}). Аккаунт не будет привязан корректно. Продолжить?`);
            
            if (!confirmLink) {
                this.showNotification('Отменено', 'Привязка отменена', 'warning');
                return;
            }
        }
        
        // Имитация привязки аккаунта
        AppState.user.serverLinked = true;
        localStorage.setItem('bb_user', JSON.stringify(AppState.user));
        
        this.updateProfileDisplay();
        this.showNotification('Аккаунт привязан!', 'Теперь вы можете получать бонусы на сервере', 'success');
    }
    
    // Смена аватара
    saveAvatar() {
        const selectedAvatar = document.querySelector('.avatar-option.selected');
        const uploadedFile = document.getElementById('avatarUpload').files[0];
        
        if (!selectedAvatar && !uploadedFile) {
            this.showNotification('Ошибка', 'Выберите аватар или загрузите свой', 'error');
            return;
        }
        
        if (uploadedFile) {
            // Имитация загрузки аватара
            const reader = new FileReader();
            reader.onload = (e) => {
                this.setUserAvatar(e.target.result);
            };
            reader.readAsDataURL(uploadedFile);
        } else {
            const avatarType = selectedAvatar.getAttribute('data-avatar');
            let avatarHTML = '';
            
            switch(avatarType) {
                case 'default':
                    avatarHTML = '<i class="fas fa-user"></i>';
                    break;
                case 'snowman':
                    avatarHTML = '<i class="fas fa-snowman"></i>';
                    break;
                case 'reindeer':
                    avatarHTML = '<i class="fas fa-horse-head"></i>';
                    break;
                case 'gift':
                    avatarHTML = '<i class="fas fa-gift"></i>';
                    break;
                case 'tree':
                    avatarHTML = '<i class="fas fa-tree"></i>';
                    break;
                case 'crown':
                    avatarHTML = '<i class="fas fa-crown"></i>';
                    break;
            }
            
            this.setUserAvatar(avatarHTML);
        }
        
        this.hideModal('avatarModal');
    }
    
    // Установка аватара пользователя
    setUserAvatar(avatar) {
        if (!AppState.user) return;
        
        AppState.user.avatar = avatar;
        localStorage.setItem('bb_user', JSON.stringify(AppState.user));
        
        if (typeof avatar === 'string' && avatar.startsWith('<i')) {
            DOM.currentAvatar.innerHTML = avatar.replace('fa-2x', 'fa-4x');
        } else {
            DOM.currentAvatar.innerHTML = `<img src="${avatar}" alt="Аватар" style="width: 100%; height: 100%; object-fit: cover;">`;
        }
        
        this.showNotification('Аватар обновлен!', 'Новый аватар успешно сохранен', 'success');
    }
    
    // Смена никнейма
    changeNickname() {
        const newNickname = document.getElementById('newNickname').value.trim();
        const currentPassword = document.getElementById('currentPasswordNick').value;
        
        if (!newNickname || !currentPassword) {
            this.showNotification('Ошибка', 'Заполните все поля', 'error');
            return;
        }
        
        if (!AppState.user) {
            this.showNotification('Ошибка', 'Сначала войдите в аккаунт', 'error');
            return;
        }
        
        // Проверка пароля (в реальном приложении - запрос к серверу)
        const users = JSON.parse(localStorage.getItem('bb_registered_users') || '[]');
        const userIndex = users.findIndex(u => u.username === AppState.user.username);
        
        if (userIndex === -1 || users[userIndex].password !== currentPassword) {
            this.showNotification('Ошибка', 'Неверный пароль', 'error');
            document.getElementById('currentPasswordNick').classList.add('error-shake');
            setTimeout(() => {
                document.getElementById('currentPasswordNick').classList.remove('error-shake');
            }, 500);
            return;
        }
        
        // Обновление никнейма
        const oldUsername = AppState.user.username;
        AppState.user.username = newNickname;
        users[userIndex].username = newNickname;
        
        localStorage.setItem('bb_user', JSON.stringify(AppState.user));
        localStorage.setItem('bb_registered_users', JSON.stringify(users));
        
        this.updateProfileDisplay();
        this.hideModal('nicknameModal');
        
        // Очистить поля
        document.getElementById('newNickname').value = '';
        document.getElementById('currentPasswordNick').value = '';
        
        // Отправить email уведомление
        this.sendNicknameChangeEmail(oldUsername, newNickname);
        
        this.showNotification('Никнейм изменен!', 'На ваш email отправлено письмо с подтверждением', 'success');
    }
    
    // Отправка email при смене никнейма
    sendNicknameChangeEmail(oldNickname, newNickname) {
        console.log(`Отправка письма о смене никнейма с ${oldNickname} на ${newNickname}`);
        // В реальном приложении здесь будет запрос к API отправки email
    }
    
    // Смена пароля
    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Ошибка', 'Заполните все поля', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            this.showNotification('Ошибка', 'Новые пароли не совпадают', 'error');
            document.getElementById('confirmPassword').classList.add('error-shake');
            setTimeout(() => {
                document.getElementById('confirmPassword').classList.remove('error-shake');
            }, 500);
            return;
        }
        
        if (!this.isPasswordStrong(newPassword)) {
            this.showNotification('Ошибка', 'Новый пароль слишком слабый', 'error');
            return;
        }
        
        if (this.isCommonPassword(newPassword)) {
            this.showNotification('Ошибка', 'Новый пароль слишком простой', 'error');
            return;
        }
        
        if (!AppState.user) {
            this.showNotification('Ошибка', 'Сначала войдите в аккаунт', 'error');
            return;
        }
        
        // Проверка текущего пароля
        const users = JSON.parse(localStorage.getItem('bb_registered_users') || '[]');
        const userIndex = users.findIndex(u => u.username === AppState.user.username);
        
        if (userIndex === -1 || users[userIndex].password !== currentPassword) {
            this.showNotification('Ошибка', 'Неверный текущий пароль', 'error');
            document.getElementById('currentPassword').classList.add('error-shake');
            setTimeout(() => {
                document.getElementById('currentPassword').classList.remove('error-shake');
            }, 500);
            return;
        }
        
        // Обновление пароля
        users[userIndex].password = newPassword;
        localStorage.setItem('bb_registered_users', JSON.stringify(users));
        
        this.hideModal('passwordModal');
        
        // Очистить поля
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        
        this.showNotification('Пароль изменен!', 'Ваш пароль успешно обновлен', 'success');
    }
    
    // Генерация календаря бонусов
    generateBonusCalendar() {
        if (!DOM.bonusCalendar) return;
        
        DOM.bonusCalendar.innerHTML = '';
        
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentDate = today.getDate();
        
        // Заголовки дней недели
        const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.style.fontWeight = 'bold';
            dayElement.style.color = 'var(--gold)';
            DOM.bonusCalendar.appendChild(dayElement);
        });
        
        // Дни месяца
        const daysInMonth = new Date(today.getFullYear(), currentMonth + 1, 0).getDate();
        const firstDay = new Date(today.getFullYear(), currentMonth, 1).getDay();
        
        // Пустые дни в начале
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            DOM.bonusCalendar.appendChild(emptyDay);
        }
        
        // Дни месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Проверить, получен ли бонус за этот день
            const bonusHistory = JSON.parse(localStorage.getItem('bb_bonus_history') || '[]');
            const claimedDate = bonusHistory.find(b => {
                const bonusDate = new Date(b.date);
                return bonusDate.getDate() === day && 
                       bonusDate.getMonth() === currentMonth &&
                       bonusDate.getFullYear() === today.getFullYear();
            });
            
            if (claimedDate) {
                dayElement.classList.add('claimed');
                dayElement.title = `Получен: ${claimedDate.prize}`;
            }
            
            // Сегодняшний день
            if (day === currentDate) {
                dayElement.classList.add('today');
                dayElement.title = 'Сегодня - получите бонус!';
                
                if (!claimedDate) {
                    dayElement.classList.add('available');
                    dayElement.addEventListener('click', () => {
                        this.navigateTo('bonus');
                    });
                }
            }
            
            DOM.bonusCalendar.appendChild(dayElement);
        }
    }
    
    // Проверка ежедневного бонуса
    checkDailyBonus() {
        const lastClaim = localStorage.getItem('bb_daily_bonus');
        const today = new Date().toDateString();
        
        AppState.dailyBonusClaimed = lastClaim && new Date(lastClaim).toDateString() === today;
        
        if (DOM.claimBonusBtn) {
            if (AppState.dailyBonusClaimed) {
                DOM.claimBonusBtn.disabled = true;
                DOM.claimBonusBtn.innerHTML = '<i class="fas fa-check"></i> Бонус уже получен';
            } else {
                DOM.claimBonusBtn.disabled = false;
                DOM.claimBonusBtn.innerHTML = '<i class="fas fa-gift"></i> Получить бонус';
            }
        }
    }
    
    // Получение ежедневного бонуса
    claimDailyBonus() {
        if (!AppState.isAuthenticated) {
            this.showNotification('Ошибка', 'Сначала войдите в аккаунт', 'error');
            this.navigateTo('profile');
            return;
        }
        
        if (AppState.dailyBonusClaimed) {
            this.showNotification('Уже получено', 'Вы уже получили бонус сегодня', 'warning');
            return;
        }
        
        this.showLoading();
        
        // Имитация получения бонуса
        setTimeout(() => {
            const bonusType = Math.random() < 0.5 ? 'vip' : 'promo';
            let prize = '';
            let description = '';
            
            if (bonusType === 'vip') {
                // VIP на 10-30 минут
                const random = Math.random();
                let vipDuration = 10;
                let chance = '50%';
                
                if (random < 0.15) {
                    vipDuration = 30;
                    chance = '15%';
                } else if (random < 0.40) {
                    vipDuration = 20;
                    chance = '25%';
                }
                
                prize = `VIP на ${vipDuration} минут`;
                description = `Шанс: ${chance}`;
                
                // Добавить VIP
                this.addVipTime(vipDuration);
                
            } else {
                // Промокод на скидку 10-40%
                const random = Math.random();
                let discount = 10;
                let chance = '70%';
                
                if (random < 0.01) {
                    discount = 40;
                    chance = '1%';
                } else if (random < 0.06) {
                    discount = 30;
                    chance = '5%';
                } else if (random < 0.26) {
                    discount = 20;
                    chance = '20%';
                }
                
                prize = `Промокод на скидку ${discount}%`;
                description = `Шанс: ${chance}`;
                
                // Создать промокод
                const promoCode = this.generatePromoCode();
                const newPromo = {
                    code: promoCode,
                    type: 'discount',
                    discount: discount,
                    description: `Ежедневный бонус - скидка ${discount}%`,
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                };
                
                // Активировать промокод
                this.activatePromoCodeObject(newPromo);
            }
            
            // Сохранить историю
            const bonusHistory = JSON.parse(localStorage.getItem('bb_bonus_history') || '[]');
            bonusHistory.push({
                date: new Date().toISOString(),
                prize: prize,
                description: description
            });
            
            localStorage.setItem('bb_bonus_history', JSON.stringify(bonusHistory));
            localStorage.setItem('bb_daily_bonus', new Date().toISOString());
            
            AppState.dailyBonusClaimed = true;
            
            this.hideLoading();
            this.checkDailyBonus();
            this.generateBonusCalendar();
            this.updateBonusHistory();
            
            this.showNotification(
                'Бонус получен!',
                `${prize} (${description})`,
                'success'
            );
            
            // Отправить email уведомление
            this.sendBonusEmail(prize);
            
        }, 2000);
    }
    
    // Добавление VIP времени
    addVipTime(minutes) {
        const now = new Date();
        const currentVIP = AppState.vipUntil ? new Date(AppState.vipUntil) : now;
        
        if (currentVIP < now) {
            currentVIP.setTime(now.getTime());
        }
        
        currentVIP.setMinutes(currentVIP.getMinutes() + minutes);
        AppState.vipUntil = currentVIP;
        
        localStorage.setItem('bb_vip_until', currentVIP.toISOString());
        
        this.showNotification(
            'VIP продлен!',
            `Ваш VIP активен до ${currentVIP.toLocaleString('ru-RU')}`,
            'success'
        );
    }
    
    // Генерация промокода
    generatePromoCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return `BONUS-${code}`;
    }
    
    // Активация промокода из объекта
    activatePromoCodeObject(promo) {
        if (!AppState.isAuthenticated) {
            this.showNotification('Ошибка', 'Сначала войдите в аккаунт', 'error');
            return false;
        }
        
        // Проверить, не активирован ли уже
        const alreadyActivated = AppState.activatedPromoCodes.find(p => p.code === promo.code);
        if (alreadyActivated) {
            this.showNotification('Уже активирован', 'Этот промокод уже был использован', 'warning');
            return false;
        }
        
        // Проверить срок действия
        const today = new Date();
        const expires = new Date(promo.expires);
        
        if (expires < today) {
            this.showNotification('Просрочен', 'Срок действия промокода истек', 'error');
            return false;
        }
        
        // Применить промокод
        AppState.activatedPromoCodes.push({
            ...promo,
            activatedAt: new Date().toISOString()
        });
        
        localStorage.setItem('bb_activated_promos', JSON.stringify(AppState.activatedPromoCodes));
        
        // Применить скидку если это промокод на скидку
        if (promo.type === 'discount' && promo.discount > AppState.userDiscount) {
            AppState.userDiscount = promo.discount;
            localStorage.setItem('bb_user_discount', AppState.userDiscount.toString());
            
            this.showNotification(
                'Промокод активирован!',
                `Ваша скидка увеличена до ${promo.discount}%`,
                'success'
            );
        } else if (promo.type === 'vip') {
            this.addVipTime(promo.duration * 24 * 60); // дни в минуты
        } else {
            this.showNotification(
                'Промокод активирован!',
                promo.description,
                'success'
            );
        }
        
        this.updateActivatedPromoCodes();
        return true;
    }
    
    // Активация промокода из поля ввода
    activatePromoCode() {
        const code = DOM.promocodeInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showNotification('Ошибка', 'Введите промокод', 'error');
            return;
        }
        
        if (!AppState.isAuthenticated) {
            this.showNotification('Ошибка', 'Сначала войдите в аккаунт', 'error');
            return;
        }
        
        // Поиск промокода
        const promo = PROMO_CODES.find(p => p.code.toUpperCase() === code);
        
        if (!promo) {
            this.showNotification('Не найден', 'Промокод не существует', 'error');
            DOM.promocodeInput.classList.add('error-shake');
            setTimeout(() => {
                DOM.promocodeInput.classList.remove('error-shake');
            }, 500);
            return;
        }
        
        // Активация
        const activated = this.activatePromoCodeObject(promo);
        
        if (activated) {
            DOM.promocodeInput.value = '';
            DOM.promocodeInput.classList.add('success-bounce');
            setTimeout(() => {
                DOM.promocodeInput.classList.remove('success-bounce');
            }, 500);
        }
    }
    
    // Обновление истории бонусов
    updateBonusHistory() {
        if (!DOM.bonusHistory) return;
        
        const bonusHistory = JSON.parse(localStorage.getItem('bb_bonus_history') || '[]');
        
        DOM.bonusHistory.innerHTML = '';
        
        if (bonusHistory.length === 0) {
            DOM.bonusHistory.innerHTML = '<div class="history-empty">История бонусов пуста</div>';
            return;
        }
        
        // Показать последние 10 бонусов
        bonusHistory.slice(-10).reverse().forEach(bonus => {
            const date = new Date(bonus.date);
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-date">${date.toLocaleDateString('ru-RU')}</div>
                <div class="history-prize">${bonus.prize}</div>
            `;
            DOM.bonusHistory.appendChild(historyItem);
        });
    }
    
    // Отображение доступных промокодов
    renderPromoCodes() {
        if (!DOM.promocodesList) return;
        
        DOM.promocodesList.innerHTML = '';
        
        PROMO_CODES.forEach(promo => {
            const promoItem = document.createElement('div');
            promoItem.className = 'promocode-item';
            
            // Проверить активирован ли уже
            const isActivated = AppState.activatedPromoCodes.find(p => p.code === promo.code);
            
            promoItem.innerHTML = `
                <div class="promocode-header">
                    <div class="promocode-code">${promo.code}</div>
                    <div class="promocode-type">${promo.type === 'discount' ? 'СКИДКА' : promo.type === 'vip' ? 'VIP' : 'БОНУС'}</div>
                </div>
                <div class="promocode-discount">
                    ${promo.type === 'discount' ? `-${promo.discount}%` : 
                      promo.type === 'vip' ? `VIP ${promo.duration} дней` : 
                      promo.bonus === 'extra_daily' ? 'Доп. бонус' : 'Двойной опыт'}
                </div>
                <div class="promocode-description">${promo.description}</div>
                <div class="promocode-expires">
                    <i class="far fa-clock"></i>
                    Действует до: ${promo.expires}
                </div>
                ${isActivated ? '<div class="promocode-activated">✓ Активирован</div>' : ''}
            `;
            
            if (!isActivated) {
                promoItem.addEventListener('click', () => {
                    DOM.promocodeInput.value = promo.code;
                    this.activatePromoCode();
                });
                promoItem.style.cursor = 'pointer';
            }
            
            DOM.promocodesList.appendChild(promoItem);
        });
    }
    
    // Обновление списка активированных промокодов
    updateActivatedPromoCodes() {
        if (!DOM.activatedPromocodes) return;
        
        DOM.activatedPromocodes.innerHTML = '';
        
        if (AppState.activatedPromoCodes.length === 0) {
            DOM.activatedPromocodes.innerHTML = '<div class="history-empty">Нет активированных промокодов</div>';
            return;
        }
        
        AppState.activatedPromoCodes.forEach(promo => {
            const activatedItem = document.createElement('div');
            activatedItem.className = 'activated-item';
            
            const activatedDate = new Date(promo.activatedAt);
            
            activatedItem.innerHTML = `
                <div class="activated-info">
                    <div class="activated-code">${promo.code}</div>
                    <div class="activated-date">Активирован: ${activatedDate.toLocaleDateString('ru-RU')}</div>
                </div>
                <div class="activated-discount">
                    ${promo.type === 'discount' ? `-${promo.discount}%` : 
                      promo.type === 'vip' ? `VIP ${promo.duration}д` : 
                      'БОНУС'}
                </div>
            `;
            
            DOM.activatedPromocodes.appendChild(activatedItem);
        });
    }
    
    // Выбор донат-пакета
    selectPackage(packageType) {
        if (!AppState.isAuthenticated) {
            this.showNotification('Ошибка', 'Сначала войдите в аккаунт', 'error');
            this.navigateTo('profile');
            return;
        }
        
        let price = 0;
        let packageName = '';
        
        switch(packageType) {
            case 'basic':
                price = 199;
                packageName = 'BASIC';
                break;
            case 'premium':
                price = 499;
                packageName = 'PREMIUM';
                break;
            case 'ultimate':
                price = 999;
                packageName = 'ULTIMATE';
                break;
        }
        
        // Применить скидку
        if (AppState.userDiscount > 0) {
            const discountAmount = price * AppState.userDiscount / 100;
            price = price - discountAmount;
            
            this.showNotification(
                'Скидка применена!',
                `Ваша скидка ${AppState.userDiscount}% сохранена. Итоговая цена: ${Math.round(price)}₽`,
                'info'
            );
        }
        
        const confirmPurchase = confirm(
            `Вы выбрали пакет ${packageName}\n` +
            `Цена: ${Math.round(price)}₽\n` +
            `Ваша скидка: ${AppState.userDiscount}%\n\n` +
            `Перейти к оплате?`
        );
        
        if (confirmPurchase) {
            this.redirectToTelegram();
        }
    }
    
    // Перенаправление в Telegram
    redirectToTelegram() {
        // Имитация перенаправления
        this.showLoading();
        
        setTimeout(() => {
            this.hideLoading();
            
            // В реальном приложении здесь будет window.location.href = 'tg://...'
            this.showNotification(
                'Перенаправление...',
                'В реальном приложении здесь будет переход в Telegram',
                'info'
            );
            
            // Для демо - покажем модальное окно
            alert('В реальном приложении вы были бы перенаправлены в Telegram-бота для оплаты\n\nTelegram бот: @BloodyBatterflyDonateBot');
        }, 1000);
    }
    
    // Отправка запроса в поддержку
    submitSupportRequest() {
        const topic = document.getElementById('supportTopic').value;
        const message = document.getElementById('supportMessage').value.trim();
        
        if (!message) {
            this.showNotification('Ошибка', 'Введите сообщение', 'error');
            return;
        }
        
        this.showLoading();
        
        // Имитация отправки
        setTimeout(() => {
            this.hideLoading();
            
            // Очистить форму
            document.getElementById('supportMessage').value = '';
            
            this.showNotification(
                'Сообщение отправлено!',
                'Наша поддержка ответит вам в течение 24 часов',
                'success'
            );
            
            // Имитация отправки email
            console.log(`Новый запрос в поддержку: ${topic}\nСообщение: ${message}`);
        }, 1500);
    }
    
    // Показать категорию правил
    showRulesCategory(categoryName) {
        // Обновить активную категорию
        document.querySelectorAll('.category').forEach(cat => {
            cat.classList.remove('active');
            if (cat.getAttribute('data-category') === categoryName) {
                cat.classList.add('active');
            }
        });
        
        // Показать выбранный раздел
        document.querySelectorAll('.rules-section').forEach(section => {
            section.classList.remove('active');
            if (section.id === `${categoryName}Rules`) {
                section.classList.add('active');
            }
        });
    }
    
    // Инициализация Деда Мороза
    initSanta() {
        // Проверить, показывался ли уже промокод сегодня
        const lastSantaShow = localStorage.getItem('bb_santa_last_show');
        const today = new Date().toDateString();
        
        if (lastSantaShow === today) {
            return; // Уже показывали сегодня
        }
        
        // Добавить обработчик клика
        DOM.santa?.addEventListener('click', () => {
            this.showSantaModal();
            localStorage.setItem('bb_santa_last_show', today);
        });
    }
    
    // Показать модальное окно Деда Мороза
    showSantaModal() {
        // Генерация случайного промокода
        const santaPromo = `SANTA-${Math.random().toString(36).substring(2, 10).toUpperCase()}-2026`;
        DOM.santaPromoCode.textContent = santaPromo;
        
        this.showModal('santaModal');
    }
    
    // Копирование промокода от Деда Мороза
    copySantaPromo() {
        const text = DOM.santaPromoCode.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Скопировано!', 'Промокод скопирован в буфер обмена', 'success');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            this.showNotification('Ошибка', 'Не удалось скопировать промокод', 'error');
        });
    }
    
    // Отправка email о получении бонуса
    sendBonusEmail(prize) {
        if (!AppState.user || !AppState.user.email) return;
        
        console.log(`Отправка письма о получении бонуса на ${AppState.user.email}`);
        console.log(`Бонус: ${prize}`);
        
        // В реальном приложении здесь будет запрос к API отправки email
    }
    
    // Отправка ежедневного напоминания
    sendDailyReminder() {
        if (!AppState.user || !AppState.user.email) return;
        
        // Проверить, отправлялось ли уже сегодня
        const lastReminder = localStorage.getItem('bb_last_reminder');
        const today = new Date().toDateString();
        
        if (lastReminder === today) return;
        
        console.log(`Отправка ежедневного напоминания на ${AppState.user.email}`);
        localStorage.setItem('bb_last_reminder', today);
        
        // В реальном приложении здесь будет запрос к API отправки email
    }
    
    // Таймер нового года
    startNewYearCountdown() {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = NEW_YEAR_DATE - now;
            
            if (distance < 0) {
                // Новый год наступил!
                DOM.daysEl.textContent = '00';
                DOM.hoursEl.textContent = '00';
                DOM.minutesEl.textContent = '00';
                DOM.secondsEl.textContent = '00';
                
                clearInterval(countdownInterval);
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            DOM.daysEl.textContent = days.toString().padStart(2, '0');
            DOM.hoursEl.textContent = hours.toString().padStart(2, '0');
            DOM.minutesEl.textContent = minutes.toString().padStart(2, '0');
            DOM.secondsEl.textContent = seconds.toString().padStart(2, '0');
        };
        
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    // Обновление даты и времени
    updateDateTime() {
        const updateTime = () => {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            const dateTimeString = now.toLocaleDateString('ru-RU', options);
            document.getElementById('currentDateTime').textContent = dateTimeString;
        };
        
        updateTime();
        setInterval(updateTime, 60000); // Обновлять каждую минуту
    }
    
    // Запуск анимаций
    startAnimations() {
        // Анимация частиц
        this.animateParticles();
        
        // Анимация снега
        this.animateSnow();
        
        // Анимация гирлянд
        this.animateLights();
    }
    
    // Анимация частиц
    animateParticles() {
        const particlesContainer = document.querySelector('.particles-container');
        if (!particlesContainer) return;
        
        // Создать частицы
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Случайные свойства
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            const color = i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#c62828' : '#4fc3f7';
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                opacity: ${Math.random() * 0.5 + 0.3};
                animation: floatParticle ${duration}s infinite linear ${delay}s;
            `;
            
            particlesContainer.appendChild(particle);
        }
        
        // Добавить стили анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0.3;
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                    opacity: 0.8;
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                    opacity: 0.3;
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                    opacity: 0.8;
                }
                100% {
                    transform: translate(0, 0) rotate(360deg);
                    opacity: 0.3;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Анимация снега
    animateSnow() {
        // Уже реализовано в CSS
    }
    
    // Анимация гирлянд
    animateLights() {
        const lights = document.querySelector('.christmas-lights');
        if (!lights) return;
        
        setInterval(() => {
            lights.style.backgroundPosition = `${Math.random() * 100}px 0`;
        }, 100);
    }
    
    // Показать модальное окно
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Скрыть модальное окно
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Показать загрузку
    showLoading() {
        DOM.loadingOverlay?.classList.add('active');
    }
    
    // Скрыть загрузку
    hideLoading() {
        DOM.loadingOverlay?.classList.remove('active');
    }
    
    // Показать уведомление
    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'check-circle' :
                     type === 'error' ? 'exclamation-circle' :
                     type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <p class="notification-message">${message}</p>
            </div>
        `;
        
        DOM.notificationContainer.appendChild(notification);
        
        // Удалить уведомление через 3 секунды
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationFadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }
    
    // Настройка переходов между страницами
    setupPageTransitions() {
        // Добавить анимацию при переходе
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.classList?.contains('page')) {
                            node.classList.add('page-transition');
                        }
                    });
                }
            });
        });
        
        observer.observe(DOM.mainContent, { childList: true });
    }
    
    // Настройка валидации пароля
    setupPasswordValidation() {
        const setupInput = (inputId, strengthBarSelector, strengthTextSelector) => {
            const input = document.getElementById(inputId);
            if (!input) return;
            
            input.addEventListener('input', (e) => {
                const password = e.target.value;
                const strengthBar = document.querySelector(strengthBarSelector);
                const strengthText = document.querySelector(strengthTextSelector);
                
                if (!strengthBar || !strengthText) return;
                
                let strength = 0;
                let color = '#f44336';
                let text = 'Слабый';
                
                if (password.length >= 8) strength += 25;
                if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 25;
                if (/\d/.test(password)) strength += 25;
                if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
                
                strengthBar.style.width = `${strength}%`;
                
                if (strength >= 75) {
                    color = '#4caf50';
                    text = 'Сильный';
                } else if (strength >= 50) {
                    color = '#ff9800';
                    text = 'Средний';
                }
                
                strengthBar.style.background = color;
                strengthText.textContent = text;
                strengthText.style.color = color;
            });
        };
        
        setupInput('regPassword', '#regPassword + .password-strength .strength-bar', '#regPassword + .password-strength .strength-text');
        setupInput('newPassword', '#newPassword + .password-strength .strength-bar', '#newPassword + .password-strength .strength-text');
    }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BloodyBatterflyApp();
    
    // Отправить ежедневное напоминание
    setTimeout(() => {
        if (app && AppState.isAuthenticated) {
            app.sendDailyReminder();
        }
    }, 5000);
    
    // Обновлять онлайн игроков
    setInterval(() => {
        const onlinePlayers = document.getElementById('onlinePlayers');
        if (onlinePlayers) {
            // Имитация изменения количества игроков
            const current = onlinePlayers.textContent.split('/')[0];
            const max = onlinePlayers.textContent.split('/')[1];
            const newOnline = Math.max(100, Math.min(parseInt(max), 
                parseInt(current) + Math.floor(Math.random() * 10) - 5));
            onlinePlayers.textContent = `${newOnline}/${max}`;
        }
    }, 30000);
});

// Глобальные вспомогательные функции
function formatDate(date) {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(date) {
    return new Date(date).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Экспорт для глобального использования
window.BloodyBatterfly = {
    AppState,
    DOM,
    formatDate,
    formatDateTime
};
