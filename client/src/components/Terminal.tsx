import { useEffect, useRef, useState } from "react";

// Define terminal code with proper Python indentation and syntax highlighting
const terminalCode = [
  `<span class="python-keyword">class</span> <span class="python-class">FullStackDeveloper</span>:`,
  `    <span class="python-keyword">def</span> <span class="python-function">__init__</span>(self, name, skills):`,
  `        self.name = name`,
  `        self.skills = skills`,
  `        self.projects_completed = 0`,
  `        self.passion = <span class="python-string">"Creating beautiful web experiences"</span>`,
  ``,
  `    <span class="python-keyword">def</span> <span class="python-function">build_project</span>(self, project_name, technologies):`,
  `        <span class="python-comment"># Create amazing digital experiences</span>`,
  `        project = self._design_architecture(project_name)`,
  `        self._develop_frontend(project, technologies)`,
  `        self._develop_backend(project, technologies)`,
  `        self._test_and_deploy(project)`,
  `        self.projects_completed += 1`,
  `        <span class="python-keyword">return</span> project`,
  ``,
  `    <span class="python-keyword">def</span> <span class="python-function">get_skills</span>(self):`,
  `        <span class="python-keyword">return</span> {`,
  `            <span class="python-string">"Frontend"</span>: [<span class="python-string">"React"</span>, <span class="python-string">"Next.js"</span>, <span class="python-string">"TypeScript"</span>, <span class="python-string">"Tailwind CSS"</span>],`,
  `            <span class="python-string">"Backend"</span>: [<span class="python-string">"Node.js"</span>, <span class="python-string">"Express"</span>, <span class="python-string">"Python"</span>, <span class="python-string">"Django"</span>],`,
  `            <span class="python-string">"Database"</span>: [<span class="python-string">"PostgreSQL"</span>, <span class="python-string">"MongoDB"</span>, <span class="python-string">"Redis"</span>]`,
  `        }`,
  ``,
  `<span class="python-comment"># Initialize developer profile</span>`,
  `developer = FullStackDeveloper(<span class="python-string">"Nub Coder"</span>, [<span class="python-string">"JavaScript"</span>, <span class="python-string">"React"</span>, <span class="python-string">"Node.js"</span>, <span class="python-string">"Python"</span>])`,
  `portfolio = developer.build_project(<span class="python-string">"Portfolio Website"</span>, [<span class="python-string">"React"</span>, <span class="python-string">"TypeScript"</span>, <span class="python-string">"Tailwind"</span>])`
];

export default function Terminal() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Observe when terminal comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (!hasAnimated) {
              startTerminalAnimation();
              setHasAnimated(true);
            }
          }
        });
      },
      { threshold: 0.05 } // Even lower threshold for earlier animation trigger
    );

    if (terminalRef.current) {
      observer.observe(terminalRef.current);
    }

    return () => {
      if (terminalRef.current) {
        observer.unobserve(terminalRef.current);
      }
    };
  }, [hasAnimated]);

  // Optimized and faster letter-by-letter animation
  const startTerminalAnimation = () => {
    const codeContainer = document.getElementById("codeContainer");
    if (!codeContainer) return;

    // Pre-create all line elements first for better performance
    terminalCode.forEach((line, index) => {
      const lineDiv = codeContainer.children[index];
      if (!lineDiv) return;
      
      const codeContent = lineDiv.querySelector(".code-content");
      if (!codeContent) return;
      
      // Clear any existing content
      codeContent.innerHTML = '';
    });

    let lineIndex = 0;
    let charIndex = 0;
    let isInTag = false;
    let currentTag = "";
    const TYPING_SPEED = 1.5; // Speed multiplier - higher value = faster typing

    // Type character by character with improved speed
    function typeCharacter() {
      if (!codeContainer || lineIndex >= terminalCode.length) {
        return; // Animation completed or container not found
      }

      const lineDiv = codeContainer.children[lineIndex];
      if (!lineDiv) return;
      
      const codeContent = lineDiv.querySelector(".code-content");
      if (!codeContent) return;

      const rawCurrentLine = terminalCode[lineIndex];

      // Process multiple characters per frame for faster animation
      const charsPerFrame = Math.floor(3 * TYPING_SPEED);
      for (let i = 0; i < charsPerFrame; i++) {
        if (charIndex >= rawCurrentLine.length) break;
        
        const char = rawCurrentLine[charIndex];

        if (char === "<" && !isInTag) {
          isInTag = true;
          currentTag += char;
        } else if (char === ">" && isInTag) {
          isInTag = false;
          currentTag += char;
          
          // Add the tag directly to the content
          const tagSpan = document.createElement("span");
          tagSpan.innerHTML = currentTag;
          codeContent.appendChild(tagSpan);
          
          currentTag = "";
        } else if (isInTag) {
          currentTag += char;
        } else {
          // Create a single character span for animation
          const charSpan = document.createElement("span");
          charSpan.className = "typed-character";
          // Much faster animation delay
          charSpan.style.animationDelay = `${charIndex * 0.001}s`;
          charSpan.innerText = char;
          codeContent.appendChild(charSpan);
        }

        charIndex++;
      }

      // Check if we should move to the next line
      if (charIndex >= rawCurrentLine.length) {
        lineIndex++;
        charIndex = 0;
        currentTag = "";
        isInTag = false;
        
        // Shorter delay between lines
        setTimeout(typeCharacter, 20); 
      } else {
        // Process the next batch of characters
        // Skip delay completely for tags, use minimal delay for visible text
        const nextDelay = isInTag ? 0 : Math.min(10 / TYPING_SPEED, 5);
        setTimeout(typeCharacter, nextDelay);
      }
    }

    // Start the typing animation
    typeCharacter();
  };

  // Optional: Add a way to replay the animation
  const replayAnimation = () => {
    const codeContainer = document.getElementById("codeContainer");
    if (codeContainer) {
      // Clear all content
      Array.from(codeContainer.children).forEach(line => {
        const codeContent = line.querySelector(".code-content");
        if (codeContent) codeContent.innerHTML = '';
      });
      
      // Restart animation
      startTerminalAnimation();
    }
  };

  return (
    <div className="terminal-container w-full max-w-3xl mx-auto" ref={terminalRef}>
      <div className="terminal-header flex items-center px-4 py-2 bg-gray-800 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="terminal-btn terminal-btn-red h-3 w-3 rounded-full bg-red-500"></div>
          <div className="terminal-btn terminal-btn-yellow h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="terminal-btn terminal-btn-green h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="terminal-title font-mono text-gray-300 mx-auto">main.py - Python</div>
        {isVisible && hasAnimated && (
          <button 
            onClick={replayAnimation} 
            className="text-gray-400 hover:text-white text-xs"
          >
            Replay
          </button>
        )}
      </div>
      <div className="terminal-content p-4 bg-gray-900 rounded-b-lg text-gray-200" id="codeContainer">
        {terminalCode.map((_, index) => (
          <div key={index} className="flex mb-1">
            <div className="text-gray-500 text-right pr-4 min-w-[40px] select-none border-r border-primary/10 mr-4 font-mono">
              {index + 1}
            </div>
            <div className="code-content font-mono"></div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .typed-character {
          display: inline-block;
          opacity: 0;
          animation: fadeIn 0.01s forwards;
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        
        .python-keyword { color: #ff79c6; }
        .python-class { color: #8be9fd; }
        .python-function { color: #50fa7b; }
        .python-string { color: #f1fa8c; }
        .python-comment { color: #6272a4; }
      `}</style>
    </div>
  );
}
