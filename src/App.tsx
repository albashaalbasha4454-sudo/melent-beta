import { useState } from 'react';
import { UserRole } from './types';
import { LoginPortal } from './components/LoginPortal';
import { LandingPage } from './components/public/LandingPage';
import { TravelDashboard } from './components/TravelDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';

import { HelpFab } from './components/HelpFab';

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>(() => {
    const role = localStorage.getItem('melent_role');
    return role ? 'dashboard' : 'landing';
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('melent_role') as UserRole) || null;
  });

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('melent_role', role || '');
    setView('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('melent_role');
    setView('landing');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingPage onLoginClick={() => setView('login')} />
          </motion.div>
        ) : view === 'login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="relative">
               <button 
                 onClick={() => setView('landing')}
                 className="absolute top-8 left-8 z-[60] px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-all shadow-sm"
               >
                 Back to Site
               </button>
               <LoginPortal onLogin={handleLogin} />
            </div>
          </motion.div>
        ) : userRole === 'travel' ? (
          <motion.div
            key="travel"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <TravelDashboard onLogout={handleLogout} />
          </motion.div>
        ) : (
          <motion.div
            key="admin"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <AdminDashboard onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
      <HelpFab />
    </div>
  );
}
