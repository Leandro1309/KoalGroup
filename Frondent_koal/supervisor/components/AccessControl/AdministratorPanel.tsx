import React, { useState } from 'react';
import { DashboardLayout } from '../../srcl/components/Layout/DashboardLayout';
import { AccessControlPanel } from '../../srcl/components/AccessControl/AccessControlPanel';
import { InventoryPanel } from '../../srcl/components/Inventory/InventoryPanel';
import { GasRegistryPanel } from '../../srcl/components/GasRegistry/GasRegistryPanel';
import { WorkFrontsPanel } from '../../srcl/components/WorkFronts/WorkFrontsPanel';
import { InventarioHerramientasPanel } from '../../srcl/components/InventarioHerramientas/InventarioHerramientasPanel';

export const AdministratorPanel = () => {
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
}; 