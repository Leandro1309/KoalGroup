// Servicio para simular el escaneo de huella dactilar

export const scanFingerprint = async (): Promise<{ token: string }> => {
  // Simulación de espera y generación de un token único
  await new Promise(resolve => setTimeout(resolve, 1200));
  return { token: 'huella_' + Math.random().toString(36).substring(2, 10) };
}; 