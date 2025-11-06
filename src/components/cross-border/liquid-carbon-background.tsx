export const LiquidCarbonBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* Liquid graphite flow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-[#0a0a0a] animate-[flow_20s_ease-in-out_infinite_alternate]" 
           style={{ 
             backgroundSize: '400% 400%',
             animation: 'flow 20s ease-in-out infinite alternate'
           }} 
      />
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Magnetic field particles - subtle */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#BFBFBF] opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      <style>{`
        @keyframes flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px); }
        }
      `}</style>
    </div>
  );
};