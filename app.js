// Obed Mateo Méndez Castaño

// ===== TASAS DE CAMBIO =====
const rates = {
    USD: 1,           // Dólar Estadounidense (base)
    EUR: 0.95,        // Euro
    GBP: 0.82,        // Libra Esterlina
    JPY: 149.30,      // Yen Japonés
    CNY: 7.24,        // Yuan Chino
    CAD: 1.36,        // Dólar Canadiense
    AUD: 1.54,        // Dólar Australiano
    CHF: 0.89,        // Franco Suizo
    MXN: 17.85,       // Peso Mexicano
    BRL: 5.12,        // Real Brasileño
    KRW: 1337.50,     // Won Surcoreano
    INR: 83.25,       // Rupia India
    RUB: 92.50,       // Rublo Ruso
    ARS: 850.00,      // Peso Argentino
    CLP: 925.00,      // Peso Chileno
    COP: 4120.00,     // Peso Colombiano
    SEK: 10.75,       // Corona Sueca
    NOK: 10.95,       // Corona Noruega
    ZAR: 18.65,       // Rand Sudafricano
    TRY: 32.50        // Lira Turca
};

// Obed

// Símbolos de monedas
const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'Fr',
    MXN: '$',
    BRL: 'R$',
    KRW: '₩',
    INR: '₹',
    RUB: '₽',
    ARS: '$',
    CLP: '$',
    COP: '$',
    SEK: 'kr',
    NOK: 'kr',
    ZAR: 'R',
    TRY: '₺'
};

// ===== ELEMENTOS DOM =====
const form = document.getElementById('converterForm');
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const swapBtn = document.getElementById('swapBtn');
const resultContainer = document.getElementById('resultContainer');
const resultAmount = document.getElementById('resultAmount');
const resultDetail = document.getElementById('resultDetail');
const conversionRate = document.getElementById('conversionRate');
const datetimeElement = document.getElementById('datetime');

// ===== FUNCIONES =====

// Función para actualizar fecha y hora
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const formattedDate = now.toLocaleDateString('es-ES', options);
    datetimeElement.textContent = formattedDate;
}

// Función para convertir moneda
function convertCurrency(amount, fromCurrency, toCurrency) {
    // Validar que el monto sea válido
    if (isNaN(amount) || amount <= 0) {
        return null;
    }

    // Obtener las tasas de cambio
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    // Fórmula: resultado = (monto / tasaOrigen) * tasaDestino
    const result = (amount / fromRate) * toRate;

    return result;
}

// Función para formatear el número con separadores de miles
function formatNumber(num) {
    return num.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Función para obtener el símbolo de la moneda
function getCurrencySymbol(currency) {
    return currencySymbols[currency] || '';
}

// Función para mostrar el resultado
function displayResult(amount, fromCurrency, toCurrency, result) {
    // Formatear los montos
    const formattedAmount = formatNumber(amount);
    const formattedResult = formatNumber(result);

    // Obtener símbolos
    const fromSymbol = getCurrencySymbol(fromCurrency);
    const toSymbol = getCurrencySymbol(toCurrency);

    // Actualizar el DOM
    resultAmount.textContent = `${toSymbol}${formattedResult} ${toCurrency}`;
    resultDetail.textContent = `${fromSymbol}${formattedAmount} ${fromCurrency} equivale a`;

    // Calcular y mostrar la tasa de cambio
    const exchangeRate = (result / amount).toFixed(4);
    conversionRate.textContent = `Tasa de cambio: 1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`;

    // Mostrar el contenedor con animación
    resultContainer.classList.add('show');
}

// Función para validar el formulario
function validateForm() {
    const amount = parseFloat(amountInput.value);

    // Validar que el monto no esté vacío
    if (!amountInput.value) {
        alert('⚠️ Por favor, ingresa un monto');
        amountInput.focus();
        return false;
    }

    // Validar que el monto sea un número válido
    if (isNaN(amount)) {
        alert('⚠️ Por favor, ingresa un número válido');
        amountInput.focus();
        return false;
    }

    // Validar que el monto sea positivo
    if (amount <= 0) {
        alert('⚠️ El monto debe ser mayor a 0');
        amountInput.focus();
        return false;
    }

    // Validar que las monedas sean diferentes
    if (fromCurrencySelect.value === toCurrencySelect.value) {
        alert('⚠️ Por favor, selecciona monedas diferentes');
        return false;
    }

    return true;
}

// ===== EVENT LISTENERS =====

// Evento para enviar el formulario
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validar el formulario
    if (!validateForm()) {
        return;
    }

    // Obtener los valores
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    // Realizar la conversión
    const result = convertCurrency(amount, fromCurrency, toCurrency);

    if (result !== null) {
        // Mostrar el resultado
        displayResult(amount, fromCurrency, toCurrency, result);
    } else {
        alert('⚠️ Error al realizar la conversión');
    }
});

// Evento para intercambiar monedas
swapBtn.addEventListener('click', function() {
    // Intercambiar los valores de los select
    const tempValue = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = tempValue;

    // Si hay un resultado mostrado, recalcular
    if (resultContainer.classList.contains('show') && amountInput.value) {
        form.dispatchEvent(new Event('submit'));
    }
});

// Evento para convertir al presionar Enter en el input de monto
amountInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});

// Evento para recalcular automáticamente cuando cambian las monedas
fromCurrencySelect.addEventListener('change', function() {
    if (resultContainer.classList.contains('show') && amountInput.value) {
        form.dispatchEvent(new Event('submit'));
    }
});

toCurrencySelect.addEventListener('change', function() {
    if (resultContainer.classList.contains('show') && amountInput.value) {
        form.dispatchEvent(new Event('submit'));
    }
});

// ===== NAVEGACIÓN SUAVE =====
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Remover clase active de todos los links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Agregar clase active al link clickeado
        this.classList.add('active');
    });
});

// ===== INICIALIZACIÓN =====
// Actualizar la fecha y hora al cargar la página
updateDateTime();

// Actualizar la fecha y hora cada minuto
setInterval(updateDateTime, 60000);

// Enfocar el input de monto al cargar la página
window.addEventListener('load', function() {
    amountInput.focus();
});
// Obed Mateo Méndez Castaño