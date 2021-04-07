const hamburger = document.getElementById('ham-menu');

function openNav() {
    hamburger.classList.toggle('ham-menu-x');
};

hamburger.addEventListener('click', openNav);