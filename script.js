// Инициализация
emailjs.init("JsxWtGcXMxJ8S65qy"); 

document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.getElementById('phone');
  
  if (phoneInput) {
    phoneInput.addEventListener('input', formatPhone);
    phoneInput.addEventListener('focus', onPhoneFocus);
    phoneInput.addEventListener('keyup', onPhoneKeyup); // ← ДОБАВИЛИ
    phoneInput.addEventListener('keydown', onPhoneKeydown);
  }
});

function formatPhone(e) {
  const input = e.target;
  let value = input.value.replace(/\D/g, ''); // Только цифры
  
  // 8 → 7
  if (value.startsWith('8')) value = '7' + value.slice(1);
  
  // ✅ ИСПРАВЛЕННОЕ форматирование (все 11 цифр)
  let formatted = '+7 ';
  if (value.length > 1) formatted += '(' + value.slice(1,4) + ') ';
  if (value.length > 4) formatted += value.slice(4,7) + '-';
  if (value.length > 7) formatted += value.slice(7,9) + '-';
  if (value.length > 9) formatted += value.slice(9,11); // ← Было slice(9) = ошибка!
  
  input.value = formatted.slice(0, 18); // ← 18 символов
}

function onPhoneFocus(e) {
  const input = e.target;
  if (!input.value.trim()) {
    input.value = '+7 ';
  }
  setTimeout(() => setCursor(input, 4), 0); // После +7(
}

function onPhoneKeyup(e) { // ← НОВЫЙ обработчик
  if (e.key === 'Backspace' || e.key === 'Delete') {
    setTimeout(() => {
      const cursorPos = e.target.selectionStart;
      setCursor(e.target, Math.max(0, cursorPos - 1));
    }, 0);
  }
}


function setCursor(input, pos) {
  requestAnimationFrame(() => {
    input.setSelectionRange(pos, pos);
  });
}

// Авто-@ для Telegram
document.getElementById('tg').addEventListener('input', function(e) {
  if (e.target.value && !e.target.value.startsWith('@')) {
    e.target.value = '@' + e.target.value.replace('@', '');
  }
});

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const status = document.querySelector('.form-status');
    const formData = new FormData(this);

    status.textContent = 'Отправляем...';
    status.className = 'form-status';

    emailjs.send('service_7wlxtbr', 'template_yk0wws3', {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        tg: formData.get('tg'),
        object: formData.get('object') || '',
        message: formData.get('message') || ''
    })
        .then(function () {
            status.textContent = '✅ Заявка отправлена!';
            status.className = 'form-status success';
            this.reset();
        }, function (error) {
            status.textContent = '❌ Ошибка отправки. Попробуйте еще раз.';
            status.className = 'form-status error';
            console.error('EmailJS error:', error);
        });
});