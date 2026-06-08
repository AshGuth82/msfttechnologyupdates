import React from "react";

interface AppLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10 pb-0.5",
    lg: "w-16 h-16"
  };

  const selectedSizeClass = sizeClasses[size] || className;

  return (
    <div 
      className={`${selectedSizeClass} ${className} relative rounded-[22%] p-[1.5px] bg-gradient-to-br from-[#dfc264] via-[#916b1e] to-[#fffbc4] shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-hidden shrink-0 select-none`}
      style={{
        boxShadow: "0 4px 14px -2px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4)"
      }}
    >
      {/* Metallic Inner Ridge Accent */}
      <div className="w-full h-full rounded-[20%] p-[1px] bg-gradient-to-br from-[#805e19] via-[#ecd89b] to-[#513909]">
        
        {/* Dark Bezel Separator Ring */}
        <div className="w-full h-full rounded-[18%] p-[1.5px] bg-[#070b13]">
          
          {/* Main Simulated Blue Leather Inner Canvas */}
          <div 
            className="relative w-full h-full rounded-[16%] bg-gradient-to-b from-[#0e2136] via-[#091625] to-[#04080e] overflow-hidden flex items-end justify-between px-[16%] py-[18%]"
            style={{
              backgroundImage: "radial-gradient(ellipse at 50% 10%, #15314f 0%, #06101c 80%)"
            }}
          >
            {/* Fine texture overlay simulating executive leather/canvas fabric */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:4px_4px]"></div>
            
            {/* 5 Neon-Cyan-Glowing Rising Bars */}
            <div 
              className="w-[12%] h-[24%] bg-gradient-to-t from-[#0ea5e9] to-[#22d3ee] rounded-sm transition-all duration-300"
              style={{
                boxShadow: "0 0 10px rgba(34, 211, 238, 0.95), 0 0 4px rgba(6, 182, 212, 0.4)",
                filter: "brightness(1.1) contrast(1.1)"
              }}
            ></div>
            <div 
              className="w-[12%] h-[40%] bg-gradient-to-t from-[#0ea5e9] to-[#22d3ee] rounded-sm transition-all duration-300"
              style={{
                boxShadow: "0 0 10px rgba(34, 211, 238, 0.95), 0 0 4px rgba(6, 182, 212, 0.4)",
                filter: "brightness(1.1) contrast(1.1)"
              }}
            ></div>
            <div 
              className="w-[12%] h-[56%] bg-gradient-to-t from-[#0ea5e9] to-[#22d3ee] rounded-sm transition-all duration-300"
              style={{
                boxShadow: "0 0 10px rgba(34, 211, 238, 0.95), 0 0 4px rgba(6, 182, 212, 0.4)",
                filter: "brightness(1.1) contrast(1.1)"
              }}
            ></div>
            <div 
              className="w-[12%] h-[72%] bg-gradient-to-t from-[#0ea5e9] to-[#22d3ee] rounded-sm transition-all duration-300"
              style={{
                boxShadow: "0 0 10px rgba(34, 211, 238, 0.95), 0 0 4px rgba(6, 182, 212, 0.4)",
                filter: "brightness(1.1) contrast(1.1)"
              }}
            ></div>
            <div 
              className="w-[12%] h-[90%] bg-gradient-to-t from-[#0ea5e9] to-[#22d3ee] rounded-sm transition-all duration-300"
              style={{
                boxShadow: "0 0 12px rgba(34, 211, 238, 1), 0 0 5px rgba(6, 182, 212, 0.5)",
                filter: "brightness(1.15) contrast(1.15)"
              }}
            ></div>

            {/* Glossy sheen overlay reflection */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/[0.04] to-transparent transform -skew-x-12 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
