import React, { useState } from 'react';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { AccessControlPanel } from './components/AccessControl/AccessControlPanel';
import { InventoryPanel } from './components/Inventory/InventoryPanel';
import { GasRegistryPanel } from './components/GasRegistry/GasRegistryPanel';
import { WorkFrontsPanel } from './components/WorkFronts/WorkFrontsPanel';
import { InventarioHerramientasPanel } from './components/InventarioHerramientas/InventarioHerramientasPanel';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'access-control':
        return <AccessControlPanel />;
      case 'inventory':
        return <InventoryPanel />;
      case 'gas-registry':
        return <GasRegistryPanel />;
      case 'work-fronts':
        return <WorkFrontsPanel />;
      case 'inventario-herramientas':
        return <InventarioHerramientasPanel />;
      default:
        return <AccessControlPanel />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}