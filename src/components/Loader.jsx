const Loader = () => (
  <div className="text-center py-16">
    <style>{`
      @keyframes pop {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 1; }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes typing {
        from { width: 0; }
        to { width: 100%; }
      }
      .animate-pop {
        animation: pop 1s ease-in-out infinite;
      }
      .animate-blink {
        animation: blink 1s step-end infinite;
      }
     
    `}</style>

    <div className="relative inline-flex items-center justify-center font-mono">
      <div className="absolute w-16 h-16 bg-blue-200 rounded-full animate-ping opacity-75"></div>
      <div className="relative flex items-center gap-1 text-5xl font-bold text-blue-600">
        <span className="animate-pop" style={{ animationDelay: '0s' }}>{'<'}</span>
        <span className="text-2xl text-yellow-500 animate-blink">|</span>
        <span className="animate-pop" style={{ animationDelay: '0.2s' }}>{'>'}</span>
      </div>
    </div>

    <p className="mt-6 text-blue-800 font-semibold text-sm">
      <span className="text-gray-500"></span>{' '}
      <span >Something Is Coming......</span>
    </p>
  </div>
);

export default Loader;