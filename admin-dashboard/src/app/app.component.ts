import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkOrderService } from './services/work-order.service';
import { WorkOrder, EstadoOrden } from './models/work-order.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid px-4">
        <a class="navbar-brand fw-bold" href="#">
          <i class="bi bi-diagram-3-fill me-2"></i>Central de Despacho & Terreno | Angular Admin
        </a>
      </div>
    </nav>

    <div class="container-fluid p-4" style="background-color: #f8f9fa; min-height: 92vh;">
      <div class="row g-4">
        
        <!-- Métrica de Resumen -->
        <div class="col-12">
          <div class="row g-3">
            <div class="col-md-3" *ngFor="let state of estados">
              <div class="card border-0 shadow-sm p-3">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <span class="text-muted small fw-bold text-uppercase">{{ state }}</span>
                    <h3 class="fw-bold mb-0">{{ contarPorEstado(state) }}</h3>
                  </div>
                  <span class="badge rounded-pill p-3" [ngClass]="getBadgeClass(state)">
                    <i class="bi fs-4" [ngClass]="getIconClass(state)"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Consola de Monitoreo -->
        <div class="col-12">
          <div class="card border-0 shadow-sm p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold mb-0 text-secondary">
                <i class="bi bi-broadcast me-2"></i>Órdenes de Trabajo Activas
              </h5>
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Cliente / Dirección</th>
                    <th>Servicio Solicíto</th>
                    <th>Prioridad</th>
                    <th>Estado Operativo</th>
                    <th>Técnico Asignado</th>
                    <th class="text-end">Acciones de Despacho</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let o of ordenes">
                    <td class="fw-bold text-secondary">#{{ o.id }}</td>
                    <td>
                      <div class="fw-bold">{{ o.cliente }}</div>
                      <div class="small text-muted">{{ o.direccion }}</div>
                    </td>
                    <td>{{ o.servicio }}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'bg-success': o.prioridad === 'Baja',
                        'bg-info text-dark': o.prioridad === 'Media',
                        'bg-warning text-dark': o.prioridad === 'Alta',
                        'bg-danger': o.prioridad === 'Critica'
                      }">{{ o.prioridad }}</span>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="getBadgeClass(o.estado)">
                        {{ o.estado }}
                      </span>
                    </td>
                    <td class="fw-semibold text-dark">{{ o.tecnicoAsignado }}</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" (click)="asignarTecnico(o.id)" *ngIf="o.estado === 'Pendiente'">
                          Despachar N2
                        </button>
                        <button class="btn btn-outline-success" (click)="marcarCompletado(o.id)" *ngIf="o.estado !== 'Completado'">
                          Finalizar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  ordenes: WorkOrder[] = [];
  estados: EstadoOrden[] = ['Pendiente', 'EnRuta', 'EnProceso', 'Completado'];

  constructor(private workOrderService: WorkOrderService) {}

  ngOnInit(): void {
    this.workOrderService.orders$.subscribe(data => {
      this.ordenes = data;
    });
  }

  contarPorEstado(estado: EstadoOrden): number {
    return this.ordenes.filter(o => o.estado === estado).length;
  }

  getBadgeClass(estado: EstadoOrden): string {
    switch (estado) {
      case 'Pendiente': return 'bg-secondary';
      case 'EnRuta': return 'bg-warning text-dark';
      case 'EnProceso': return 'bg-primary';
      case 'Completado': return 'bg-success';
    }
  }

  getIconClass(estado: EstadoOrden): string {
    switch (estado) {
      case 'Pendiente': return 'bi-clock-history';
      case 'EnRuta': return 'bi-truck';
      case 'EnProceso': return 'bi-gear-wide-connected';
      case 'Completado': return 'bi-check-circle';
    }
  }

  asignarTecnico(id: number): void {
    const tecnico = prompt('Nombre del técnico a despachar:', 'Bastian Contreras');
    if (tecnico) {
      this.workOrderService.cambiarEstado(id, 'EnRuta', tecnico);
    }
  }

  marcarCompletado(id: number): void {
    this.workOrderService.cambiarEstado(id, 'Completado');
  }
}