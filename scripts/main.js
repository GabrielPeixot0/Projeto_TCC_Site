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

const loginicon = document.querySelector('.login-icon');
const menuMain = document.querySelector('.menu');
const mobileMenu = document.querySelector('.mobile-menu');
const bars = document.querySelector('.fa-bars');
const pizzariaCardapio = document.querySelector('.btn-pizzaria');

pizzariaCardapio.addEventListener('click', () => {window.location.href = '../cardapios/pizzaria/pizzariaAdmin.html';});


loginicon.addEventListener('click', () => {window.location.href = './login/login.html';});
menuMain.addEventListener('click', () => {
    mobileMenu.classList.toggle('mobile-menu-active');
    if (bars.classList.contains('fa-bars')) {
        bars.classList.remove('fa-bars');
        bars.classList.add('fa-xmark');
    } else {
        bars.classList.remove('fa-xmark');
        bars.classList.add('fa-bars');
    }
});