import React from 'react';

const SimpleSpinner = ({ 
  size = 'md', 
  message = '', 
  variant = 'primary'
}) => {
  const sizes = {
    sm: { 
      container: 'w-12 h-12', 
      dot: 'w-2 h-2',
      text: 'text-sm'
    },
    md: { 
      container: 'w-16 h-16', 
      dot: 'w-2.5 h-2.5',
      text: 'text-base'
    },
    lg: { 
      container: 'w-20 h-20', 
      dot: 'w-3 h-3',
      text: 'text-lg'
    }
  };

  const variants = {
    primary: {
      dots: [
        'bg-blue-500 shadow-lg shadow-blue-500/40',
        'bg-indigo-500 shadow-lg shadow-indigo-500/40', 
        'bg-purple-500 shadow-lg shadow-purple-500/40',
        'bg-pink-500 shadow-lg shadow-pink-500/40'
      ],
      glow: 'from-blue-400/30 to-purple-400/30'
    },
    success: {
      dots: [
        'bg-emerald-500 shadow-lg shadow-emerald-500/40',
        'bg-teal-500 shadow-lg shadow-teal-500/40',
        'bg-green-500 shadow-lg shadow-green-500/40',
        'bg-lime-500 shadow-lg shadow-lime-500/40'
      ],
      glow: 'from-emerald-400/30 to-green-400/30'
    },
    warning: {
      dots: [
        'bg-amber-500 shadow-lg shadow-amber-500/40',
        'bg-orange-500 shadow-lg shadow-orange-500/40',
        'bg-yellow-500 shadow-lg shadow-yellow-500/40',
        'bg-red-500 shadow-lg shadow-red-500/40'
      ],
      glow: 'from-amber-400/30 to-orange-400/30'
    },
    elegant: {
      dots: [
        'bg-gray-700 shadow-lg shadow-gray-700/40',
        'bg-slate-600 shadow-lg shadow-slate-600/40',
        'bg-zinc-600 shadow-lg shadow-zinc-600/40',
        'bg-neutral-700 shadow-lg shadow-neutral-700/40'
      ],
      glow: 'from-gray-400/20 to-slate-400/20'
    },
    black: {
      dots: [
        'bg-black shadow-lg shadow-black/50',
        'bg-gray-900 shadow-lg shadow-gray-900/50',
        'bg-gray-800 shadow-lg shadow-gray-800/50',
        'bg-slate-900 shadow-lg shadow-slate-900/50'
      ],
      glow: 'from-black/30 to-gray-800/30'
    }
  };

  const currentSize = sizes[size];
  const currentVariant = variants[variant];

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className={`relative ${currentSize.container}`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${currentVariant.glow} rounded-full blur-xl animate-pulse`}></div>
        
        <div 
          className={`relative ${currentSize.container} animate-spin`}
          style={{ animationDuration: '1.2s' }}
        >
          {currentVariant.dots.map((dotClass, index) => {
            const positions = [
              { top: '0', left: '50%', transform: 'translateX(-50%)' },
              { top: '50%', right: '0', transform: 'translateY(-50%)' },
              { bottom: '0', left: '50%', transform: 'translateX(-50%)' },
              { top: '50%', left: '0', transform: 'translateY(-50%)' }
            ];
            
            return (
              <div
                key={index}
                className={`absolute ${currentSize.dot} ${dotClass} rounded-full animate-pulse`}
                style={{
                  ...positions[index],
                  animationDelay: `${index * 0.15}s`,
                  animationDuration: '0.8s'
                }}
              />
            );
          })}
          
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-1.5 h-1.5' : 'w-1 h-1'
          } ${currentVariant.dots[0]} rounded-full animate-ping`}></div>
        </div>
      </div>

      {message && (
        <div className="mt-4 text-center">
          <p className={`text-gray-700 font-medium ${currentSize.text} animate-pulse`}>
            {message}
          </p>
          <div className="flex justify-center mt-1 space-x-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Spinner = () => {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <SimpleSpinner variant="black" size="md" message="Loading..." />
    </div>
  );
};

export default Spinner;
