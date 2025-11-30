// Инициализация снега
function initSnow() {
    const container = document.getElementById('snowflakes');
    const snowflakeCount = 50;
    const snowflakes = ['❄', '❅', '❆', '•', '✦'];
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        // Случайная позиция
        snowflake.style.left = Math.random() * 100 + 'vw';
        
        // Случайная задержка и длительность
        const delay = Math.random() * 15;
        const duration = 8 + Math.random() * 12;
        snowflake.style.animationDelay = delay + 's';
        snowflake.style.animationDuration = duration + 's';
        
        // Случайный размер
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
        
        // Случайная позиция
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        
        // Случайная задержка анимации
        particle.style.animationDelay = Math.random() * 20 + 's';
        
        // Случайный размер
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Случайный цвет
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
}

// Копирование IP адреса
function copyIP() {
    const ip = 'connect bloody-butterfly.com:27015';
    navigator.clipboard.writeText(ip).then(() => {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #00ff00;
            color: black;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = '✅ IP скопирован в буфер обмена!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }).catch(() => {
        alert('Ошибка копирования');
    });
}

// Перенаправление в Telegram
function redirectToTelegram(type) {
    const telegramUrl = 'https://t.me/bloody_butterfly_cs2';
    
    // Можно добавить разные ссылки для разных типов
    const links = {
        'basic': telegramUrl,
        'advanced': telegramUrl,
        'premium': telegramUrl,
        'join': telegramUrl,
        'chat': telegramUrl,
        'news': telegramUrl,
        'support': telegramUrl,
        'rules': telegramUrl,
        'faq': telegramUrl,
        'bugs': telegramUrl,
        'suggestions': telegramUrl,
        'appeal': telegramUrl,
        'main': telegramUrl,
        'admin': telegramUrl
    };
    
    window.open(links[type] || telegramUrl, '_blank');
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initSnow();
    initParticles();
    initNavigation();
    
    // Запуск таймера
    updateDailyTimer();
    setInterval(updateDailyTimer, 1000);
    
    // Добавляем эффект параллакса для ёлок
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
`;
document.head.appendChild(style);
