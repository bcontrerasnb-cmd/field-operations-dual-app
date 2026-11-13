export type EstadoOrden = 'Pendiente' | 'EnRuta' | 'EnProceso' | 'Completado';
export type PrioridadOrden = 'Baja' | 'Media' | 'Alta' | 'Critica';

export interface WorkOrder {
  id: number;
  cliente: string;
  direccion: string;
  servicio: string;
  estado: EstadoOrden;
  prioridad: PrioridadOrden;
  tecnicoAsignado: string;
  fechaProgramada: string;
}