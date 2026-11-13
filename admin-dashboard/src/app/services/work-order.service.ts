import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkOrder, EstadoOrden } from '../models/work-order.model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private initialOrders: WorkOrder[] = [
    {
      id: 101,
      cliente: 'Empresa Logística S.A.',
      direccion: 'Av. Central 456, Santiago',
      servicio: 'Mantenimiento Preventivo de Servidor',
      estado: 'EnRuta',
      prioridad: 'Alta',
      tecnicoAsignado: 'Bastian Contreras',
      fechaProgramada: new Date().toISOString()
    },
    {
      id: 102,
      cliente: 'Distribuidora Maule',
      direccion: 'Calle Comercio 123, Linares',
      servicio: 'Instalación Punto de Red IoT',
      estado: 'Pendiente',
      prioridad: 'Media',
      tecnicoAsignado: 'Sin Asignar',
      fechaProgramada: new Date().toISOString()
    },
    {
      id: 103,
      cliente: 'Clínica San Gabriel',
      direccion: 'Av. Brasil 789, Santiago',
      servicio: 'Revisión Enlace Móvil N2',
      estado: 'EnProceso',
      prioridad: 'Critica',
      tecnicoAsignado: 'Carlos Mendoza',
      fechaProgramada: new Date().toISOString()
    }
  ];

  private ordersSubject = new BehaviorSubject<WorkOrder[]>(this.initialOrders);
  orders$: Observable<WorkOrder[]> = this.ordersSubject.asObservable();

  getOrders(): WorkOrder[] {
    return this.ordersSubject.getValue();
  }

  cambiarEstado(id: number, nuevoEstado: EstadoOrden, nuevoTecnico?: string): void {
    const currentOrders = this.getOrders().map(order => {
      if (order.id === id) {
        return {
          ...order,
          estado: nuevoEstado,
          tecnicoAsignado: nuevoTecnico || order.tecnicoAsignado
        };
      }
      return order;
    });
    this.ordersSubject.next(currentOrders);
  }

  agregarOrden(nuevaOrden: Omit<WorkOrder, 'id'>): void {
    const orders = this.getOrders();
    const nextId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 101;
    const item: WorkOrder = { ...nuevaOrden, id: nextId };
    this.ordersSubject.next([...orders, item]);
  }
}