
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const activeClass = 'text-brand-blue';
  const inactiveClass = 'text-gray-400 hover:text-white';
  
  return (
    <NavLink to={to} className={({ isActive }) => `${isActive ? activeClass : inactiveClass} flex flex-col items-center justify-center w-1/4 transition-colors duration-200`}>
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </NavLink>
  );
};

const FooterNav: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900 border-t border-gray-700/50 shadow-lg z-50">
      <nav className="flex items-center justify-around h-full">
        <NavItem to="/explore" label="Explore" icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.25278C12 6.25278 6.75 3 4.5 3C2.25 3 1.5 4.5 1.5 6.75C1.5 11.25 12 21 12 21C12 21 22.5 11.25 22.5 6.75C22.5 4.5 21.75 3 19.5 3C17.25 3 12 6.25278 12 6.25278Z" /></svg>
        }/>
        <NavItem to="/marketplace" label="Market" icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
        }/>
        <NavItem to="/mint" label="Mint" icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        }/>
        <NavItem to="/wallet" label="Wallet" icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        }/>
      </nav>
    </footer>
  );
};

export default FooterNav;
