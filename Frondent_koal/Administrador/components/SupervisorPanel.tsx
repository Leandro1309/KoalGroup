import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Dashboard } from './Dashboard';
import { ProjectList } from './ProjectList';
import { ProjectForm } from './ProjectForm';
import { PersonnelList } from './PersonnelList';
import { Reports } from './Reports';
import { ProductionView } from './ProductionView';
import {
  HelpCircleIcon,
  LogOutIcon,
  HouseIcon,
  FolderCheckIcon,
  User2Icon,
  LibraryBigIcon,
  PickaxeIcon,
  XIcon // Icono para cerrar en móvil
} from 'lucide-react';

export const SupervisorPanel = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [showHelp, setShowHelp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    // Aquí iría la lógica de cierre de sesión
    console.log('Cerrando sesión...');
    setIsMobileMenuOpen(false);
  };

  const handleNavigationClick = (view: string) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectList />;
      case 'personnel':
        return <PersonnelList />;
      case 'reports':
        return <Reports />;
      case 'production':
        return <ProductionView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar onNavigate={handleNavigationClick} />
      <main className="flex flex-1 overflow-hidden">
        <button
          className="lg:hidden fixed top-4 left-4 z-20 bg-gray-800 text-white p-2 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <XIcon size={24} /> : <span>☰</span>}
        </button>
        <div
          className={`
            w-64 bg-gray-800 text-white flex-shrink-0
            ${isMobileMenuOpen ? 'flex flex-col' : 'hidden'}
            lg:flex lg:flex-col lg:w-64
            z-10 lg:z-auto
          `}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 font-medium flex-1 overflow-y-auto">
              <button onClick={() => handleNavigationClick('dashboard')} className={`w-full text-left py-2 px-4 rounded flex items-center gap-2 ${activeView === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <HouseIcon size={20} />
                <span>Panel Principal</span>
              </button>
              <button onClick={() => handleNavigationClick('projects')} className={`w-full text-left py-2 px-4 rounded flex items-center gap-2 ${activeView === 'projects' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <FolderCheckIcon size={20} />
                <span>Proyectos</span>
              </button>
              <button onClick={() => handleNavigationClick('personnel')} className={`w-full text-left py-2 px-4 rounded flex items-center gap-2 ${activeView === 'personnel' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <User2Icon size={20} />
                <span>Personal</span>
              </button>
              <button onClick={() => handleNavigationClick('reports')} className={`w-full text-left py-2 px-4 rounded flex items-center gap-2 ${activeView === 'reports' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <LibraryBigIcon size={20} />
                <span>Informes</span>
              </button>
              <button onClick={() => handleNavigationClick('production')} className={`w-full text-left py-2 px-4 rounded flex items-center gap-2 ${activeView === 'production' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <PickaxeIcon size={20} />
                <span>Producción</span>
              </button>
            </div>
            <div className="p-4 border-t border-gray-700 flex-shrink-0">
              <button onClick={() => { setShowHelp(true); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2">
                <HelpCircleIcon size={20} />
                <span>Ayuda</span>
              </button>
              <button onClick={handleSignOut} className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex items-center gap-2 text-red-400">
                <LogOutIcon size={20} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {renderView()}
          {showHelp && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
                 <button
                    onClick={() => setShowHelp(false)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                    aria-label="Close help modal"
                 >
                    <XIcon size={20} />
                 </button>
                <h2 className="text-xl font-bold mb-4">Centro de Ayuda</h2>
                <p className="text-gray-600 mb-4">
                  Para obtener ayuda sobre cómo usar el sistema, puede:
                </p>
                <ul className="list-disc pl-5 mb-4 text-gray-600">
                  <li>Consultar el manual de usuario</li>
                  <li>Contactar al soporte técnico</li>
                  <li>Ver los videos tutoriales</li>
                  <li>Leer las preguntas frecuentes</li>
                </ul>
                <button onClick={() => setShowHelp(false)} className="mt-4 w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700">
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}; 