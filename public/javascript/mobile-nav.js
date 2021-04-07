const hamburger = document.getElementById('ham-menu');
const sideNav = document.getElementById('side-nav');

function openNav() {
    hamburger.classList.toggle('ham-menu-x');
    sideNav.classList.toggle('side-nav-slide')
};

hamburger.addEventListener('click', openNav);