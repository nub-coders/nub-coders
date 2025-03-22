// Terminal Animation
const terminalCode = [
    `<span class="python-keyword">class</span> <span class="python-class">Terminal</span>:`,
    `    <span class="python-keyword">def</span> <span class="python-function">__init__</span>(self):`,
    `        self.commands = []`,
    `        self.history = []`,
    ``,
    `    <span class="python-keyword">def</span> <span class="python-function">execute</span>(self, command):`,
    `        self.history.append(command)`,
    `        <span class="python-keyword">if</span> command == <span class="python-string">'clear'</span>:`,
    `            self.clear_screen()`,
    `        <span class="python-keyword">elif</span> command == <span class="python-string">'exit'</span>:`,
    `            <span class="python-keyword">return</span> <span class="python-keyword">False</span>`,
    `        <span class="python-keyword">return</span> <span class="python-keyword">True</span>`,
    ``,
    `terminal = Terminal()`,
    `terminal.execute(<span class="python-string">'clear'</span>)`
];

const codeContainer = document.getElementById('codeContainer');
let hasAnimated = false;

// Initialize code lines
terminalCode.forEach((_, index) => {
    const line = document.createElement('div');
    line.className = 'code-line';
    
    const lineNumber = document.createElement('div');
    lineNumber.className = 'line-number';
    lineNumber.textContent = (index + 1).toString();
    
    const codeContent = document.createElement('div');
    codeContent.className = 'code-content';
    
    line.appendChild(lineNumber);
    line.appendChild(codeContent);
    codeContainer.appendChild(line);
});

function startTerminalAnimation() {
    if (hasAnimated) return;
    hasAnimated = true;
    
    let lineIndex = 0;
    
    function typeLine() {
        if (lineIndex < terminalCode.length) {
            const codeContent = codeContainer.children[lineIndex].querySelector('.code-content');
            codeContent.innerHTML = terminalCode[lineIndex];
            
            lineIndex++;
            setTimeout(typeLine, 100);
        } else {
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            codeContainer.lastElementChild.querySelector('.code-content').appendChild(cursor);
        }
    }
    
    typeLine();
}

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startTerminalAnimation();
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
});

observer.observe(document.getElementById('terminalContainer'));

// Toggle menu with overlay effect
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('overlay');
    
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    } else {
        navLinks.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable scrolling when menu is open
    }
}

// Close menu and overlay when clicking outside the menu
document.getElementById('overlay').addEventListener('click', function() {
    toggleMenu();
});

// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    scrollProgress.style.width = scrollPercent + '%';
});

// Back to Top Button
const backToTopButton = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Close mobile menu on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('navLinks').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
});
