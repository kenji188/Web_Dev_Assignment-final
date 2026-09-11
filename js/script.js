window.addEventListener('DOMContentLoaded', () => {
    // home page btn logic

    const buyButtons = document.querySelectorAll('.buy-btn');

    buyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const bookCard = button.closest('.book-card');

            if (bookCard) {
                const title = bookCard.querySelector('.title').innerText;
                const author = bookCard.querySelector('.author').innerText;
                const price = bookCard.querySelector('.price').innerText;

                const imgElement = bookCard.querySelector('.book-img img');
                const imgSrc = imgElement ? imgElement.getAttribute('src') : '';

                sessionStorage.setItem('checkoutTitle', title);
                sessionStorage.setItem('checkoutAuthor', author);
                sessionStorage.setItem('checkoutPrice', price);
                sessionStorage.setItem('checkoutImage', imgSrc);

                window.location.href = 'pay.html';
            }
        });
    });

    const themeToggleBtn = document.querySelector('button[aria-label="Toggle dark mode"]');

    if (themeToggleBtn) {
        const body = document.body;

        if (localStorage.getItem('theme') === 'dark') {
            body.classList.add('dark-mode');
        }

        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    function showError(message) {
        const errorBox = document.querySelector('.error-message');
        if (errorBox) {
            errorBox.textContent = message;
            errorBox.style.display = 'block';
        } else {
            console.error(message);
        }
    }

    // payment page logic
    if (document.querySelector('.payment-page')) {
        const savedTitle = sessionStorage.getItem('checkoutTitle');
        const savedAuthor = sessionStorage.getItem('checkoutAuthor');
        const savedPrice = sessionStorage.getItem('checkoutPrice');
        const savedImage = sessionStorage.getItem('checkoutImage');

        if (savedTitle) {
            document.getElementById('checkout-title').textContent = savedTitle;
            document.getElementById('checkout-author').textContent = savedAuthor;
            document.getElementById('checkout-price').textContent = savedPrice;
            document.getElementById('total-price').textContent = savedPrice;
        }

        const imgElement = document.getElementById('summary-img');
        if (imgElement && savedImage) {
            imgElement.src = savedImage;
        }

        const payButton = document.querySelector('.pay-btn');
        if (payButton) {
            payButton.addEventListener('click', (event) => {
                event.preventDefault();

                const rawCard = document.getElementById('card-number').value || '';
                const cardNumber = rawCard.replace(/\s+/g, '');

                const cardRegex = /^5[1-5]\d{14}$/;
                if (!cardRegex.test(cardNumber)) {
                    showError('Invalid card. Must be a 16 digit MasterCard that begins with 51-55.');
                    return;
                }

                const expiryVal = (document.getElementById('expiry-date') && document.getElementById('expiry-date').value) || '';
                const [monthStr, yearStr] = expiryVal.split('/');
                if (!monthStr || !yearStr || monthStr.length !== 2 || yearStr.length !== 2) {
                    showError('Invalid expiry date format.');
                    return;
                }

                const monthNum = parseInt(monthStr, 10);
                const yearNum = parseInt('20' + yearStr, 10);
                const now = new Date();
                const currentMonth = now.getMonth() + 1;
                const currentYear = now.getFullYear();

                if (monthNum < 1 || monthNum > 12 || yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
                    showError('Your card has expired or the date is invalid');
                    return;
                }

                const cvv = (document.getElementById('cvv') && document.getElementById('cvv').value) || '';
                const cvvRegex = /^\d{3,4}$/;
                if (!cvvRegex.test(cvv)) {
                    showError('Invalid CVV. Must be 3 or ');
                    return;
                }

                const errorBox = document.querySelector('.error-message');
                if (errorBox) {
                    errorBox.style.display = 'none';
                }

                const paymentData = {
                    master_card: parseInt(cardNumber, 10),
                    exp_year: yearNum,
                    exp_month: monthNum,
                    cvv_code: cvv
                };

                fetch('https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(paymentData)
                })
                    .then(response => {
                        if (response.ok) return response.json();
                        throw new Error('Payment request failed.');
                    })
                    .then(data => {
                        const lastFour = cardNumber.slice(-4);
                        sessionStorage.setItem('lastFourDigits', lastFour);
                        window.location.href = 'success.html';
                    })
                    .catch(() => {
                        showError('Payment failed. Please check your details and try again.');
                    });
            });
        }

        function showError(message){
            const errorBox = document.getElementById('error-message');
            if (errorBox){
            errorBox.textContent = message;
            errorBox.style.display = 'block';
        }
    }
}

    if (document.querySelector('.success-page')) {
        const endingDigit = sessionStorage.getItem('lastFourDigits');
        if (endingDigit) {
            const cardEndingElement = document.getElementById('card-ending');
            if (cardEndingElement) {
                cardEndingElement.textContent = endingDigit;
            }
        }
    }

    // search bar logic
    const searchInput = document.querySelector('.search-container input');

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            const allBookCards = document.querySelectorAll('.book-card');

            allBookCards.forEach(card => {
                const title = card.querySelector('.title').innerText.toLowerCase();
                const author = card.querySelector('.author').innerText.toLowerCase();

                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // formatting automation
    const cardInput = document.getElementById('card-number');
    if (cardInput) {
        cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }

    const expiryInput = document.getElementById('expiry-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 3) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
});