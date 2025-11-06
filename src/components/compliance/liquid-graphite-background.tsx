export const LiquidGraphiteBackground = () => {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-[#0B0B0C]" />
      <div 
        className="fixed inset-0 -z-10 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(26, 26, 26, 0.8) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(38, 38, 40, 0.6) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(28, 28, 30, 0.7) 0%, transparent 50%)
          `,
          animation: 'liquidFlow 25s ease-in-out infinite alternate',
        }}
      />
      <style>{`
        @keyframes liquidFlow {
          0% {
            background-position: 0% 50%, 100% 50%, 50% 100%;
          }
          50% {
            background-position: 100% 50%, 0% 50%, 50% 0%;
          }
          100% {
            background-position: 0% 50%, 100% 50%, 50% 100%;
          }
        }
      `}</style>
    </>
  );
};