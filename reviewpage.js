window.onload = function () {
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px; overflow-y:hidden;");
        tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + "px";
    }

    const stars = document.querySelectorAll('.star');
    let rating = 0;

    stars.forEach((star) => {
        star.addEventListener('mouseover', function () {
            highlightStars(this.dataset.rating);
        });

        star.addEventListener('mouseout', function () {
            highlightStars(rating);
        });

        star.addEventListener('click', function () {
            rating = this.dataset.rating;
            highlightStars(rating);
        });
    });

    function highlightStars(count) {
        stars.forEach((star) => {
            star.classList.remove('active');
        });

        for (let i = 0; i < count; i++) {
            stars[i].classList.add('active');
        }
    }

    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', () => {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('review').value = '';
        rating = 0;
        highlightStars(rating);
    });

    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const review = document.getElementById('review').value;
        
        alert('Review submitted successfully with ' + rating + ' stars!\nName: ' + name + '\nEmail: ' + email + '\nReview: ' + review);
        window.location.href = "index.html";
    });
};
