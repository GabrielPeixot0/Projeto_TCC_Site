const progressCircle = document.querySelector(".autoplay-progress");
const progressContent = document.querySelector(".autoplay-progress");
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 120, centeredSlides: true, autoplay: {
        delay: 5000, disableOnInteraction: false
    }, pagination: {
        el: ".swiper-pagination", clickable: true
    }, navigation: {
        nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev"
    },
    on: {
        autoplayTimeLeft(s, time, progress) {
            progressCircle.style.setProperty("--progress", 1 - progress);
        }
    }
});