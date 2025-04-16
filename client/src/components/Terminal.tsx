import { useEffect, useRef, useState } from "react";

// Define terminal code with syntax highlighting
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
  `developer = FullStackDeveloper(<span class="python-string">"Your Name"</span>, [<span class="python-string">"JavaScript"</span>, <span class="python-string">"React"</span>, <span class="python-string">"Node.js"</span>, <span class="python-string">"Python"</span>])`,
  `portfolio = developer.build_project(<span class="python-string">"Portfolio Website"</span>, [<span class="python-string">"React"</span>, <span class="python-string">"TypeScript"</span>, <span class="python-string">"Tailwind"</span>])`
];

export default function Terminal() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Observe when terminal comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            startTerminalAnimation();
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
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

  // Letter-by-letter animation function
  const startTerminalAnimation = () => {
    const codeContainer = document.getElementById("codeContainer");
    if (!codeContainer) return;

    let lineIndex = 0;
    let charIndex = 0;
    let currentLine = "";
    let rawCurrentLine = "";
    let isInTag = false;
    let currentTag = "";

    // Type character by character
    function typeCharacter() {
      if (!codeContainer || lineIndex >= terminalCode.length) {
        // Animation completed or container not found
        return;
      }

      const codeContent = codeContainer.children[lineIndex]?.querySelector(".code-content") as HTMLElement;
      if (!codeContent) return;

      // If we're at the start of a new line
      if (charIndex === 0) {
        rawCurrentLine = terminalCode[lineIndex];
        codeContent.innerHTML = '';
      }

      // Handle HTML tags and render character by character
      if (charIndex < rawCurrentLine.length) {
        const char = rawCurrentLine[charIndex];

        if (char === "<" && !isInTag) {
          isInTag = true;
          currentTag += char;
        } else if (char === ">" && isInTag) {
          isInTag = false;
          currentTag += char;
          currentLine += currentTag;
          
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
          charSpan.style.animationDelay = `${charIndex * 0.015}s`;
          charSpan.innerText = char;
          codeContent.appendChild(charSpan);
        }

        charIndex++;
        // Type faster if inside tag, slower if printing visible characters
        setTimeout(typeCharacter, isInTag ? 0 : Math.random() * 30 + 20);
      } else {
        // Line completed, move to next line
        lineIndex++;
        charIndex = 0;
        currentLine = "";
        setTimeout(typeCharacter, 200); // Small pause between lines
      }
    }

    // Start the typing animation
    typeCharacter();
  };

  return (
    <div className="terminal-container w-full max-w-3xl mx-auto" ref={terminalRef}>
      <div className="terminal-header">
        <div className="flex items-center gap-2">
          <div className="terminal-btn terminal-btn-red"></div>
          <div className="terminal-btn terminal-btn-yellow"></div>
          <div className="terminal-btn terminal-btn-green"></div>
        </div>
        <div className="terminal-title font-mono">main.py - Python</div>
        <div className="flex-1"></div>
      </div>
      <div className="terminal-content" id="codeContainer">
        {terminalCode.map((_, index) => (
          <div key={index} className="flex mb-1">
            <div className="text-gray-500 text-right pr-4 min-w-[40px] select-none border-r border-primary/10 mr-4 font-mono">
              {index + 1}
            </div>
            <div className="code-content font-mono"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
