import React, { useState, useEffect } from 'react';
import { Home, Search, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnimatedNumbers = () => {
  const [glitchText, setGlitchText] = useState('404');
  
  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const originalText = '404';
    
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        const randomIndex = Math.floor(Math.random() * originalText.length);
        const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        const newText = originalText.split('').map((char, index) => 
          index === randomIndex ? randomChar : char
        ).join('');
        setGlitchText(newText);
        
        setTimeout(() => setGlitchText(originalText), 100);
      }
    }, 200);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  return (
    <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 animate-pulse">
      {glitchText}
    </div>
  );
};

const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 2,
  }));
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const InteractiveButton = ({ icon: Icon, children, onClick, variant = 'primary' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseClasses = "flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 shadow-md hover:shadow-lg",
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon 
        size={20} 
        className={`transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`}
      />
      {children}
    </button>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
    </div>
  );
};

const RobotIllustration = () => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = document.getElementById('robot-eyes')?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) / 20;
        const y = (e.clientY - centerY) / 20;
        setEyePosition({ x: Math.max(-3, Math.min(3, x)), y: Math.max(-3, Math.min(3, y)) });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div className="mb-8 relative">
      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
        <div className="absolute inset-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg">
          <div id="robot-eyes" className="flex justify-center items-center h-full gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full relative overflow-hidden">
              <div 
                className="w-2 h-2 bg-red-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
                style={{
                  transform: `translate(${eyePosition.x - 50}%, ${eyePosition.y - 50}%)`
                }}
              />
            </div>
            <div className="w-4 h-4 bg-red-500 rounded-full relative overflow-hidden">
              <div 
                className="w-2 h-2 bg-red-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
                style={{
                  transform: `translate(${eyePosition.x - 50}%, ${eyePosition.y - 50}%)`
                }}
              />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-600 rounded-full"></div>
      </div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-2 h-6 bg-gray-600 rounded-full animate-bounce"></div>
    </div>
  );
};

export default function NotFound() {

    const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleGoBack = () => {
    alert('Going back to previous page...');
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <FloatingParticles />
      
      <div className="text-center relative z-10 max-w-2xl mx-auto">
        <RobotIllustration />
        
        <div className="mb-8">
          <AnimatedNumbers />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fadeInUp">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-fadeInUp animation-delay-500">
            The page you're looking for seems to have vanished into the digital void. 
            But don't worry, we'll help you find your way back!
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center animate-fadeInUp animation-delay-1000">
          <InteractiveButton icon={Home} onClick={handleGoHome}>
            Go Home
          </InteractiveButton>
          <InteractiveButton icon={RefreshCw} onClick={handleRefresh} variant="secondary">
            Refresh
          </InteractiveButton>
        </div>
        
        <div className="mt-12 text-gray-500 text-sm animate-fadeInUp animation-delay-1500">
          <p>Error Code: 404 • Page Not Found</p>
          <p className="mt-2">If you believe this is a mistake, please contact support.</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}