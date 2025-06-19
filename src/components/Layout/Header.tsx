import React from 'react';
import { MenuIcon } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isMaximized: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          className="p-2 text-gray-600 hover:text-gray-900"
          onClick={toggleSidebar}
        >
          <MenuIcon size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Panel de Control</h1>
      </div>
      <div>
        {/* Aquí puedes agregar elementos como un perfil de usuario o notificaciones */}
      </div>
    </header>
  );
};
