 

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { 
  FaCode, 
  FaUsers, 
  FaShare, 
  FaTerminal, 
  FaGithub, 
  FaLinkedin, 
  FaInstagram,
  FaArrowDown,
  FaRocket,
  FaLightbulb,
  FaCog,
  FaPlay,
  FaPause
} from "react-icons/fa"
import "./MainHome22.css"

const HomePage = () => {
  const [currentWord, setCurrentWord] = useState(0)
  const [isVisible, setIsVisible] = useState({})
  const [activeDemo, setActiveDemo] = useState("chat")
  const [isScrolling, setIsScrolling] = useState(false)
  const navigate=useNavigate();
  
  const words = ["Innovative", "Efficient", "Cutting-Edge", "Revolutionary"]
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const demoRef = useRef(null)

  // Typewriter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }))
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Smooth scroll handler
  const scrollToSection = (ref) => {
    setIsScrolling(true)
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => setIsScrolling(false), 1000)
  }

  const features = [
    {
      id: "chat",
      title: "1v1 Real-Time Chat",
      description: "Connect instantly with developers worldwide through our lightning-fast messaging system.",
      icon: <FaCode />,
      color: "from-blue-500 to-cyan-500",
      details: "End-to-end encrypted messaging with file sharing, code snippets, and video calls."
    },
    {
      id: "community",
      title: "Group Chat Communities",
      description: "Join vibrant communities of developers sharing knowledge and collaborating on projects.",
      icon: <FaUsers />,
      color: "from-purple-500 to-pink-500",
      details: "Create channels, share resources, and build lasting connections with like-minded developers."
    },
    {
      id: "sharing",
      title: "Post Sharing",
      description: "Share your projects, insights, and achievements with the developer community.",
      icon: <FaShare />,
      color: "from-green-500 to-teal-500",
      details: "Rich media posts with syntax highlighting, interactive demos, and community engagement."
    },
    {
      id: "compiler",
      title: "Online Compiler",
      description: "Code, compile, and run your programs directly in the browser with our powerful IDE.",
      icon: <FaTerminal />,
      color: "from-orange-500 to-red-500",
      details: "Support for 20+ languages with real-time collaboration and debugging tools."
    }
  ]

  const techStack = [
    "Node.js", "Express", "MongoDB", "Socket.io", "Postman", 
    "JWT", "ReactJS", "Redux"
  ]

  const benefits = [
    { icon: <FaRocket />, text: "Lightning Fast" },
    { icon: <FaLightbulb />, text: "Open Source" },
    { icon: <FaUsers />, text: "Collaborative" },
    { icon: <FaCog />, text: "Real-Time" }
  ]

  return (
    <div className="homepage">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-text">🚀 Welcome to the Future of Development</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-main">DevSphere</span>
            <span className="title-subtitle">
              Where Development Meets{" "}
              <span className="typewriter-word" key={currentWord}>
                {words[currentWord]}
              </span>
            </span>
          </h1>
          
          <p className="hero-description">
            Join developers in the most advanced collaborative platform. 
            Code together, learn together, grow together.
          </p>
          
          <div className="hero-actions">
            <button className="cta-button primary"   onClick={()=>navigate('/login')} >
              <span>Explore the Platform</span>
              <div className="button-glow"></div>
            </button>

          </div>
        </div>
        
        <div className="scroll-indicator" onClick={() => scrollToSection(featuresRef)}>
          <div className="scroll-arrow">
            <FaArrowDown />
          </div>
          <span>Discover More</span>
        </div>
      </section>

      {/* Interactive Feature Showcase */}
      <section ref={featuresRef} className="features-section" id="features" data-animate>
        <div className="section-header">
          <h2 className={`section-title ${isVisible.features ? 'animate-in' : ''}`}>
            Powerful Features for Modern Developers
          </h2>
          <p className={`section-subtitle ${isVisible.features ? 'animate-in delay-1' : ''}`}>
            Everything you need to collaborate, create, and innovate
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`feature-card ${isVisible.features ? 'animate-in' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div className={`feature-icon bg-gradient-to-r ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div className="card-hover-indicator">
                    <span>Hover to explore</span>
                  </div>
                </div>
                <div className="card-back">
                  <div className={`feature-icon bg-gradient-to-r ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-details">{feature.details}</p>
                  <button className="feature-cta"  onClick={()=>navigate('/login')} >
                    Try Now
                    <FaArrowDown className="cta-arrow" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Demo Section */}
      <section ref={demoRef} className="demo-section" id="demo" data-animate>
        <div className="section-header">
          <h2 className={`section-title ${isVisible.demo ? 'animate-in' : ''}`}>
            See DevSphere in Action
          </h2>
          <p className={`section-subtitle ${isVisible.demo ? 'animate-in delay-1' : ''}`}>
            Interactive previews of our core features
          </p>
        </div>
        
        <div className="demo-container">
          <div className="demo-tabs">
            {features.map((feature) => (
              <button
                key={feature.id}
                className={`demo-tab ${activeDemo === feature.id ? 'active' : ''}`}
                onClick={() => setActiveDemo(feature.id)}
              >
                <span className="tab-icon">{feature.icon}</span>
                <span className="tab-text">{feature.title}</span>
              </button>
            ))}
          </div>
          
          <div className="demo-preview">
            <div className="demo-window">
              <div className="window-header">
                <div className="window-controls">
                  <span className="control close"></span>
                  <span className="control minimize"></span>
                  <span className="control maximize"></span>
                </div>
                <span className="window-title">DevSphere - {features.find(f => f.id === activeDemo)?.title}</span>
              </div>
              <div className="window-content">
                {activeDemo === "chat" && (
                  <div className="demo-chat">
                    <div className="chat-sidebar">
                      <div className="user-item active">
                        <div className="user-avatar"></div>
                        <span>Alex Chen</span>
                        <div className="status online"></div>
                      </div>
                      <div className="user-item">
                        <div className="user-avatar"></div>
                        <span>Sarah Kim</span>
                        <div className="status away"></div>
                      </div>
                    </div>
                    <div className="chat-main">
                      <div className="message received">
                        <span>Hey! Want to collaborate on that React project?</span>
                      </div>
                      <div className="message sent">
                        <span>Let me share my screen</span>
                      </div>
                      <div className="typing-indicator">
                        <span>Alex is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeDemo === "community" && (
                  <div className="demo-community">
                    <div className="channel-list">
                      <div className="channel active"># react-help</div>
                      <div className="channel"># javascript-tips</div>
                      <div className="channel"># career-advice</div>
                    </div>
                    <div className="community-feed">
                      <div className="post">
                        <div className="post-author">@developer_mike</div>
                        <div className="post-content">Just deployed my first Next.js app! 🚀</div>
                        <div className="post-reactions">❤️ 12 💬 5</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeDemo === "sharing" && (
                  <div className="demo-sharing">
                    <div className="community-feed">
                      <div className="post">
                        <div className="post-author">@coder_jane</div>
                        <div className="post-content">Just shipped a new feature for our team project! Check out this cool UI component! 🎉</div>
                        <div className="post-reactions">❤️ 15 💬 8</div>
                      </div>
                    </div>
                  </div>
                )}
                {activeDemo === "compiler" && (
                  <div className="demo-compiler">
                    <div className="editor-tabs">
                      <div className="tab active">main.js</div>
                      <div className="tab">package.json</div>
                    </div>
                    <div className="editor-content">
                      <div className="line-numbers">1<br/>2<br/>3<br/>4</div>
                      <div className="code-content">
                        <span className="keyword">function</span> <span className="function">fibonacci</span>(<span className="param">n</span>) {`{`}<br/>
                        &nbsp;&nbsp;<span className="keyword">return</span> n &lt; 2 ? n : fibonacci(n-1) + fibonacci(n-2);<br/>
                        {`}`}<br/>
                        <span className="function">console.log</span>(fibonacci(10));
                      </div>
                    </div>
                    <div className="output-panel">
                      <div className="output-header">Output</div>
                      <div className="output-content">55</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Strip */}
      <section className="tech-section">
        <div className="tech-header">
          <h3>Built with Modern Technologies</h3>
        </div>
        <div className="tech-strip">
          <div className="tech-track">
            {[...techStack, ...techStack].map((tech, index) => (
              <div key={index} className="tech-item">
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="benefits-strip">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <div className="benefit-icon">{benefit.icon}</div>
              <span className="benefit-text">{benefit.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Development Experience?</h2>
          <p className="cta-description">
            Join developers building the future with DevSphere
          </p>
          <div className="cta-actions">
            <button className="cta-button primary large"  onClick={()=>navigate('/login')} >
              <span>Get Started Free</span>
              <div className="button-glow"></div>
            </button>
            <a className="cta-button secondary large" href="https://github.com/Himanshu25Sahu/DevSphere" target="_blank" >
              <FaGithub />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <h3 className="brand-name">DevSphere</h3>
              <p className="brand-description">
                The ultimate platform for developers to connect, collaborate, and create amazing things together.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <FaGithub />
                </a>
                <a href="#" className="social-link">
                  <FaLinkedin />
                </a>
                <a href="#" className="social-link">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 DevSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage