// Select the SVG icon
const menuIcon = document.querySelector('svg');

// Create a menu container
const menu = document.createElement('div');
menu.id = 'menu';
menu.style.position = 'absolute';
menu.style.top = '70px';
menu.style.left = '30px';
menu.style.background = '#222';
menu.style.border = '1px solid #444';
menu.style.borderRadius = '5px';
menu.style.display = 'none'; // hidden at start
menu.style.flexDirection = 'column';
menu.style.minWidth = '120px';
menu.style.zIndex = '1000';

// Add menu items
const pages = ['Home', 'Login', 'Details', 'About Us'];
pages.forEach(page => {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = page;
    link.style.padding = '10px';
    link.style.color = 'white';
    link.style.textDecoration = 'none';
    link.style.display = 'block';
    link.style.background = '#333';
    link.style.transition = 'background 0.3s';
    
    link.addEventListener('mouseover', () => {
        link.style.background = '#555';
    });
    link.addEventListener('mouseout', () => {
        link.style.background = '#333';
    });

    menu.appendChild(link);
});

// Add the menu to the body
document.body.appendChild(menu);

// Toggle menu when clicking the icon
menuIcon.addEventListener('click', () => {
    if (menu.style.display === 'none') {
        menu.style.display = 'flex';
    } else {
        menu.style.display = 'none';
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== menuIcon) {
        menu.style.display = 'none';
    }
});
