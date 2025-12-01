// Обновляем только функции, связанные с анимациями и стилем

class BloodyBatterflyApp {
    // ... остальной код остается без изменений ...

    // Запуск анимаций для сакурового стиля
    startAnimations() {
        this.animateSakuraPetals();
        this.animateButterflies();
        this.animateParticles();
        this.setupSakuraModal();
        this.setupScrollAnimations();
    }

    // Анимация лепестков сакуры
    animateSakuraPetals() {
        const petalsContainer = document.querySelector('.sakura-petals');
        if (!petalsContainer) return;

        // Создаем дополнительные лепестки
        for (let i = 0; i < 30; i++) {
            const petal = document.createElement('div');
            petal.className = 'sakura-petal-animated';
            
            // Случайные свойства
            const size = Math.random() * 20 + 10;
            const startX = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            const color = i % 3 === 0 ? 'var(--sakura-pink)' : 
                         i % 3 === 1 ? 'var(--blood-red)' : 'var(--butterfly-blue)';
            
            petal.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50% 50% 0 50%;
                left: ${startX}%;
                top: -50px;
                opacity: ${Math.random() * 0.5 + 0.3};
                transform: rotate(${Math.random() * 360}deg);
                animation: sakuraFallSingle ${duration}s linear infinite ${delay}s;
                filter: blur(${Math.random() * 2}px);
                z-index: -1;
            `;
            
            petalsContainer.appendChild(petal);
        }

        // Добавляем стили анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sakuraFallSingle {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: ${Math.random() * 0.5 + 0.3};
                }
                90% {
                    opacity: ${Math.random() * 0.5 + 0.3};
                }
                100% {
                    transform: translate(${Math.random() * 200 - 100}px, 100vh) rotate(${Math.random() * 720}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Анимация бабочек
    animateButterflies() {
        const butterfliesContainer = document.querySelector('.bloody-butterflies');
        if (!butterfliesContainer) return;

        // Создаем дополнительных бабочек
        for (let i = 0; i < 10; i++) {
            const butterfly = document.createElement('div');
            butterfly.className = 'butterfly-animated';
            
            const size = Math.random() * 40 + 20;
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const duration = Math.random() * 30 + 20;
            const delay = Math.random() * 10;
            
            butterfly.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${startX}%;
                top: ${startY}%;
                background: 
                    radial-gradient(circle at 30% 30%, var(--blood-red) 0%, transparent 70%),
                    radial-gradient(circle at 70% 30%, var(--blood-red) 0%, transparent 70%);
                border-radius: 50%;
                filter: blur(3px);
                opacity: 0.2;
                animation: butterflyFly ${duration}s infinite linear ${delay}s;
                z-index: -1;
            `;
            
            butterfliesContainer.appendChild(butterfly);
        }

        // Стили анимации для бабочек
        const style = document.createElement('style');
        style.textContent = `
            @keyframes butterflyFly {
                0%, 100% {
                    transform: translate(0, 0) rotate(0deg) scale(1);
                    filter: blur(3px) hue-rotate(0deg);
                }
                25% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 100 - 50}px) rotate(90deg) scale(1.1);
                    filter: blur(2px) hue-rotate(90deg);
                }
                50% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 100 - 50}px) rotate(180deg) scale(0.9);
                    filter: blur(4px) hue-rotate(180deg);
                }
                75% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 100 - 50}px) rotate(270deg) scale(1.05);
                    filter: blur(3px) hue-rotate(270deg);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Анимация частиц
    animateParticles() {
        const particlesContainer = document.querySelector('.japan-particles');
        if (!particlesContainer) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'japan-particle';
            
            const size = Math.random() * 8 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const duration = Math.random() * 30 + 20;
            const delay = Math.random() * 5;
            const color = i % 4 === 0 ? 'var(--sakura-pink)' : 
                         i % 4 === 1 ? 'var(--blood-red)' : 
                         i % 4 === 2 ? 'var(--butterfly-blue)' : 'var(--wisteria-purple)';
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${posX}%;
                top: ${posY}%;
                opacity: ${Math.random() * 0.2 + 0.1};
                animation: particleFloat ${duration}s infinite linear ${delay}s;
                filter: blur(${Math.random() * 2}px);
                z-index: -2;
            `;
            
            particlesContainer.appendChild(particle);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0.1;
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
                    opacity: 0.3;
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
                    opacity: 0.1;
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
                    opacity: 0.3;
                }
                100% {
                    transform: translate(0, 0) rotate(360deg);
                    opacity: 0.1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Настройка сакурового модального окна
    setupSakuraModal() {
        const sakuraTrigger = document.querySelector('.sakura-trigger');
        if (sakuraTrigger) {
            sakuraTrigger.addEventListener('click', () => this.showSakuraModal());
        }

        // Показывать модальное окно при клике на определенные элементы
        document.querySelectorAll('.sakura-bonus').forEach(element => {
            element.addEventListener('click', () => this.showSakuraModal());
        });

        // Закрытие модального окна
        document.querySelector('.close-sakura-modal')?.addEventListener('click', () => {
            this.hideModal('sakuraModal');
        });
    }

    // Показать сакуровое модальное окно
    showSakuraModal() {
        // Генерация уникального промокода
        const sakuraPromo = `SAKURA-${Math.random().toString(36).substring(2, 10).toUpperCase()}-2026`;
        document.getElementById('sakuraPromoCode').textContent = sakuraPromo;
        
        this.showModal('sakuraModal');
        
        // Сохранить, что промокод уже показывался сегодня
        const today = new Date().toDateString();
        localStorage.setItem('bb_sakura_last_show', today);
    }

    // Копирование сакурового промокода
    copySakuraPromo() {
        const text = document.getElementById('sakuraPromoCode').textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Скопировано!', 'Сакуровый промокод скопирован', 'success');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            this.showNotification('Ошибка', 'Не удалось скопировать промокод', 'error');
        });
    }

    // Настройка анимаций при прокрутке
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        // Наблюдаем за элементами для анимации при прокрутке
        document.querySelectorAll('.scroll-reveal').forEach(element => {
            observer.observe(element);
        });

        // Добавляем класс при скролле для некоторых эффектов
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Обновляем функцию инициализации
    init() {
        this.initEventListeners();
        this.loadUserState();
        this.startAnimations(); // Обновленная функция
        this.updateDateTime();
        this.startNewYearCountdown();
        this.setupSakuraModal(); // Новая функция
        this.generateBonusCalendar();
        this.renderPromoCodes();
        this.checkDailyBonus();
        this.setupPasswordValidation();
        this.setupPageTransitions();
        this.setupScrollAnimations(); // Новая функция
        
        // Показать уведомление о загрузке
        this.showNotification('Добро пожаловать на BloodyBatterfly!', 'Сакуровая версия 2026', 'info');
        
        // Автоматически показывать ежедневный бонус если не забран
        setTimeout(() => {
            if (!AppState.dailyBonusClaimed && AppState.isAuthenticated) {
                this.showNotification('Не забудьте получить ежедневный бонус!', 'Доступно в разделе "Ежедневный бонус"', 'info');
            }
        }, 3000);

        // Показывать сакуровое модальное окно при первом посещении
        this.showSakuraModalOnFirstVisit();
    }

    // Показывать сакуровое модальное окно при первом посещении
    showSakuraModalOnFirstVisit() {
        const firstVisit = !localStorage.getItem('bb_first_visit');
        const lastSakuraShow = localStorage.getItem('bb_sakura_last_show');
        const today = new Date().toDateString();
        
        if (firstVisit || lastSakuraShow !== today) {
            setTimeout(() => {
                this.showSakuraModal();
                localStorage.setItem('bb_first_visit', 'true');
            }, 2000);
        }
    }
}

// Добавляем глобальные функции для работы с сакурой
window.copySakuraPromo = function() {
    if (window.app) {
        window.app.copySakuraPromo();
    }
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BloodyBatterflyApp();
    
    // Добавляем эффекты для интерактивных элементов
    document.querySelectorAll('.anime-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.classList.add('anime-hover');
        });
        
        btn.addEventListener('mouseleave', function() {
            this.classList.remove('anime-hover');
        });
    });

    // Добавляем эффект для важных элементов
    document.querySelectorAll('.important').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'sparkle 0.5s ease';
        });
        
        element.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });

    // Обновляем онлайн игроков с сакуровым эффектом
    setInterval(() => {
        const onlinePlayers = document.getElementById('onlinePlayers');
        if (onlinePlayers) {
            // Имитация изменения количества игроков с эффектом
            const current = parseInt(onlinePlayers.textContent.split('/')[0]);
            const max = parseInt(onlinePlayers.textContent.split('/')[1]);
            const change = Math.floor(Math.random() * 10) - 5;
            const newOnline = Math.max(100, Math.min(max, current + change));
            
            // Добавляем эффект при изменении
            if (newOnline !== current) {
                onlinePlayers.style.color = newOnline > current ? 'var(--sakura-pink)' : 'var(--blood-red)';
                onlinePlayers.style.transition = 'color 0.3s ease';
                
                setTimeout(() => {
                    onlinePlayers.style.color = '';
                }, 1000);
            }
            
            onlinePlayers.textContent = `${newOnline}/${max}`;
        }
    }, 30000);
});

// Добавляем вспомогательные функции для сакурового стиля
function createSakuraPetal(x, y) {
    const petal = document.createElement('div');
    petal.className = 'sakura-petal-instance';
    petal.style.cssText = `
        position: fixed;
        width: 15px;
        height: 15px;
        background: var(--sakura-pink);
        border-radius: 50% 50% 0 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 9999;
        transform: rotate(45deg);
        animation: petalFall 2s linear forwards;
    `;
    
    document.body.appendChild(petal);
    
    // Удаляем после анимации
    setTimeout(() => {
        petal.remove();
    }, 2000);
}

// Добавляем стили для падающих лепестков
const sakuraStyle = document.createElement('style');
sakuraStyle.textContent = `
    @keyframes petalFall {
        0% {
            transform: rotate(45deg) translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: rotate(45deg) translate(${Math.random() * 100 - 50}px, 100vh) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(sakuraStyle);

// Добавляем эффект лепестков при клике на определенные элементы
document.addEventListener('click', function(e) {
    if (e.target.closest('.sakura-effect')) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createSakuraPetal(e.clientX, e.clientY);
            }, i * 100);
        }
    }
});

// Функция для создания эффекта бабочки
function createButterflyEffect(x, y) {
    const butterfly = document.createElement('div');
    butterfly.className = 'butterfly-effect';
    butterfly.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 9999;
        background: 
            radial-gradient(circle at 30% 30%, var(--blood-red) 0%, transparent 70%),
            radial-gradient(circle at 70% 30%, var(--blood-red) 0%, transparent 70%);
        border-radius: 50%;
        filter: blur(3px);
        opacity: 0.7;
        animation: butterflyEffect 1.5s ease-out forwards;
    `;
    
    document.body.appendChild(butterfly);
    
    setTimeout(() => {
        butterfly.remove();
    }, 1500);
}

// Стили для эффекта бабочки
const butterflyStyle = document.createElement('style');
butterflyStyle.textContent = `
    @keyframes butterflyEffect {
        0% {
            transform: scale(0.5) rotate(0deg);
            opacity: 0.7;
            filter: blur(3px) hue-rotate(0deg);
        }
        50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.9;
            filter: blur(5px) hue-rotate(180deg);
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
            filter: blur(8px) hue-rotate(360deg);
        }
    }
`;
document.head.appendChild(butterflyStyle);

// Добавляем эффект бабочек при определенных действиях
document.addEventListener('DOMContentLoaded', function() {
    // При успешной регистрации
    const registerBtn = document.getElementById('submitRegisterBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            setTimeout(() => {
                if (AppState.isAuthenticated) {
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            const x = Math.random() * window.innerWidth;
                            const y = Math.random() * window.innerHeight;
                            createButterflyEffect(x, y);
                        }, i * 200);
                    }
                }
            }, 1500);
        });
    }

    // При получении бонуса
    const claimBonusBtn = document.getElementById('claimBonusBtn');
    if (claimBonusBtn) {
        claimBonusBtn.addEventListener('click', function() {
            setTimeout(() => {
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        const x = Math.random() * window.innerWidth;
                        const y = Math.random() * window.innerHeight;
                        createSakuraPetal(x, y);
                    }, i * 100);
                }
            }, 1000);
        });
    }
});
