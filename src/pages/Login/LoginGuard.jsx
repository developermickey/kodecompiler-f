import React from 'react';
import { useSelector } from 'react-redux';
import Login from '../Login';

// Added props for title and message so we can customize the "Wall" text
const LoginGuard = ({ children, title = "Access Restricted", message = "Please sign in to view this content." }) => {
  const user = useSelector((state) => state.auth.user);

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      
      {/* Background (Blurred content) */}
      <div 
        className="absolute inset-0 filter blur-md opacity-40 pointer-events-none select-none bg-gray-100" 
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Modal Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-500">
        <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
           
           {/* Pass the dynamic title and message to the Login component */}
           <Login 
             isModal={true} 
             wallTitle={title}
             wallMessage={message}
           />
           
        </div>
      </div>
    </div>
  );
};

export default LoginGuard;