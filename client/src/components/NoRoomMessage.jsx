import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Filter, 
  RefreshCw, 
  MapPin, 
  Clock, 
  DollarSign,
  Lightbulb,
  ChevronRight 
} from 'lucide-react';

const NoRoomsMessage = ({
  title,
  subtitle,
  hasFilters = false,
  onClearFilters,
  onRefresh,
  showSuggestions = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Animate icon periodically
    const iconTimer = setInterval(() => {
      setAnimateIcon(true);
      setTimeout(() => setAnimateIcon(false), 1000);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(iconTimer);
    };
  }, []);

  // Choose icon based on context
  const MainIcon = hasFilters ? Search : Home;
  const iconColor = hasFilters ? 'text-blue-600' : 'text-gray-600';
  const gradientFrom = hasFilters ? 'from-blue-100' : 'from-gray-100';
  const gradientTo = hasFilters ? 'to-indigo-200' : 'to-gray-200';

  return (
    <div className={`w-full text-center mt-20 flex flex-col items-center justify-center px-4 transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      
      {/* Animated Icon Container */}
      <div className="relative mb-8">
        {/* Main icon circle */}
        <div className={`relative w-24 h-24 md:w-32 md:h-32 mx-auto bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
          animateIcon ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
        }`}>
          <MainIcon className={`w-10 h-10 md:w-12 md:h-12 ${iconColor} transition-all duration-300`} />
          
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-20"></div>
          <div className="absolute inset-2 rounded-full border border-blue-400 animate-pulse opacity-30"></div>
        </div>

        {/* Filter badge for filtered results */}
        {hasFilters && (
          <div className={`absolute -top-1 -right-1 md:-top-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-700 ${
            isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <Filter className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
        )}

        {/* Floating decorative dots */}
        <div className="absolute -top-3 -left-3 w-4 h-4 bg-blue-200 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute -bottom-2 -right-4 w-3 h-3 bg-purple-200 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 -left-6 w-2 h-2 bg-indigo-200 rounded-full animate-pulse opacity-50"></div>
      </div>
      
      {/* Title and Subtitle */}
      <div className={`transition-all duration-700 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">{title}</h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base max-w-md leading-relaxed">{subtitle}</p>
      </div>

      {/* Action Buttons */}
      <div className={`mt-6 flex flex-wrap gap-4 justify-center transition-all duration-700 delay-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="group px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            Clear Filters
          </button>
        )}
        <button
          onClick={onRefresh}
          className="group px-6 py-3 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          Refresh
        </button>
      </div>


      {/* Browse All Rooms Link */}
      {!hasFilters && (
        <div className={`mt-6 transition-all duration-700 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <button className="group text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors duration-300">
            <MapPin className="w-4 h-4" />
            Browse all available properties
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* Background decorative elements */}
      <div className="fixed top-20 left-10 w-16 h-16 bg-blue-100 rounded-full opacity-10 -z-10 animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-20 h-20 bg-indigo-100 rounded-full opacity-10 -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/3 right-20 w-12 h-12 bg-purple-100 rounded-full opacity-10 -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default NoRoomsMessage;