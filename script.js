$(document).ready(function() {
    // Переключение между вкладками навигации
    $('.nav-link').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        
        $('.content-section').removeClass('active');
        $(target).addClass('active');
        
        // Плавная прокрутка
        $('html, body').animate({
            scrollTop: $(target).offset().top - 100
        }, 500);
    });

    // Переключение между вкладками авторизации
    $('.auth-tab').click(function() {
        const tab = $(this).data('tab');
        
        $('.auth-tab').removeClass('active');
        $(this).addClass('active');
        
        $('.auth-form').removeClass('active');
        $(`#${tab}Form`).addClass('active');
    });

    // Обработка промокодов
    $('#checkPromo').click(function() {
        const promo = $('#promoInput').val().trim().toUpperCase();
        const promoCodes = {
            'NEWYEAR2026': { discount: 10, chance: 70 },
            'BUTTERFLY25': { discount: 20, chance: 20 },
            'BLOODYVIP': { discount: 30, chance: 10 },
            'LEGEND2026': { discount: 40, chance: 5 }
        };
        
        if (promo in promoCodes) {
            const data = promoCodes[promo];
            const result = Math.random() * 100 < data.chance ? 'УСПЕХ' : 'НЕУДАЧА';
            
            if (result === 'УСПЕХ') {
                $('#promoResult').html(`
                    <div class="promo-success">
                        <i class="fas fa-check-circle"></i> 
                        Промокод активирован! Скидка ${data.discount}% применена.
                    </div>
                `);
                toastr.success(`Промокод "${promo}" даёт скидку ${data.discount}%!`);
            } else {
                $('#promoResult').html(`
                    <div class="promo-error">
                        <i class="fas fa-times-circle"></i> 
                        Вам не повезло. Попробуйте другой промокод.
                    </div>
                `);
                toastr.error('Не повезло с шансом! Попробуйте ещё.');
            }
        } else {
            $('#promoResult').html(`
                <div class="promo-error">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Неверный промокод.
                </div>
            `);
            toastr.warning('Промокод не найден!');
        }
    });

    // Валидация регистрации
    $('#registerForm').submit(function(e) {
        e.preventDefault();
        
        const password = $('#regPassword').val();
        const confirm = $('#regConfirm').val();
        
        if (password !== confirm) {
            toastr.error('Пароли не совпадают!');
            return;
        }
        
        // Проверка сложности пароля
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!regex.test(password)) {
            toastr.error('Пароль слишком простой! Используйте буквы, цифры и спецсимволы.');
            return;
        }
        
        toastr.success('Регистрация прошла успешно! Проверьте Email для подтверждения.');
        $('#registerForm')[0].reset();
    });

    // Восстановление пароля
    $('#forgotForm').submit(function(e) {
        e.preventDefault();
        toastr.info('Инструкция по восстановлению пароля отправлена на Email.');
        $('#forgotForm')[0].reset();
    });

    // Случайный онлайн
    function updateOnline() {
        const base = 300 + Math.floor(Math.random() * 200);
        $('.online-count').text(base);
    }
    setInterval(updateOnline, 10000);
    updateOnline();

    // Новогодний эффект
    const year = new Date().getFullYear();
    if (year >= 2026) {
        $('.new-year-badge').text('V34 ' + year);
    }

    // Имитация получения ежедневного бонуса
    $('.bonus-day.today').click(function() {
        if (!$(this).hasClass('claimed')) {
            $(this).removeClass('today').addClass('claimed');
            toastr.success('Ежедневный бонус получен! Зайдите на сервер для награды.');
        }
    });

    // CSS для уведомлений
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "5000"
    };
});
