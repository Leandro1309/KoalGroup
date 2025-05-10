import React from 'react';
import { BellIcon, UserIcon, HomeIcon, LogOutIcon } from 'lucide-react'; // Añadido LogOutIcon

interface NavbarProps {
  onNavigate: (view: string) => void;
  userName?: string; // Para mostrar el nombre del usuario logueado
  onLogout?: () => void; // Función para manejar el logout
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, userName = "Administrador", onLogout }) => {
  return (
    <header className="bg-gray-900 text-white border-b border-gray-700 p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-4">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 hover:text-gray-300 transition-colors">
          <HomeIcon size={24} />
          <h1 className="text-xl font-semibold">Koal Group</h1>
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button title="Notificaciones" className="p-2 rounded-full hover:bg-gray-700 transition-colors">
          <BellIcon size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ring-2 ring-gray-500">
            <UserIcon size={18} />
          </div>
          <span className="text-sm font-medium">{userName}</span>
        </div>
        {onLogout && (
          <button onClick={onLogout} title="Cerrar Sesión" className="p-2 rounded-full hover:bg-gray-700 transition-colors flex items-center gap-1">
            <LogOutIcon size={18} />
            {/* <span className="text-sm hidden md:inline">Salir</span> */}
          </button>
        )}
      </div>
    </header>
  );
};