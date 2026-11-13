import 'package:flutter/material.dart';

void main() {
  runApp(const FieldOpsApp());
}

class FieldOpsApp extends StatelessWidget {
  const FieldOpsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Operaciones en Terreno',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1E293B),
          primary: const Color(0xFF2563EB),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      home: const WorkOrdersScreen(),
    );
  }
}

// Modelo de datos alineado con Angular Admin
class WorkOrder {
  final int id;
  final String cliente;
  final String direccion;
  final String servicio;
  String estado; // Pendiente, EnRuta, EnProceso, Completado
  final String prioridad;
  final String tecnicoAsignado;

  WorkOrder({
    required this.id,
    required this.cliente,
    required this.direccion,
    required this.servicio,
    required this.estado,
    required this.prioridad,
    required this.tecnicoAsignado,
  });
}

class WorkOrdersScreen extends StatefulWidget {
  const WorkOrdersScreen({super.key});

  @override
  State<WorkOrdersScreen> createState() => _WorkOrdersScreenState();
}

class _WorkOrdersScreenState extends State<WorkOrdersScreen> {
  // Lista inicial de órdenes asignadas al técnico
  final List<WorkOrder> _ordenes = [
    WorkOrder(
      id: 101,
      cliente: 'Empresa Logística S.A.',
      direccion: 'Av. Central 456, Santiago',
      servicio: 'Mantenimiento Preventivo de Servidor',
      estado: 'EnRuta',
      prioridad: 'Alta',
      tecnicoAsignado: 'Bastian Contreras',
    ),
    WorkOrder(
      id: 103,
      cliente: 'Clínica San Gabriel',
      direccion: 'Av. Brasil 789, Santiago',
      servicio: 'Revisión Enlace Móvil N2',
      estado: 'EnProceso',
      prioridad: 'Crítica',
      tecnicoAsignado: 'Bastian Contreras',
    ),
    WorkOrder(
      id: 104,
      cliente: 'Supermercado Central',
      direccion: 'Calle Comercio 88, Linares',
      servicio: 'Reemplazo de Balanza POS',
      estado: 'Pendiente',
      prioridad: 'Media',
      tecnicoAsignado: 'Bastian Contreras',
    ),
  ];

  void _avanzarEstado(WorkOrder orden) {
    setState(() {
      if (orden.estado == 'Pendiente') {
        orden.estado = 'EnRuta';
      } else if (orden.estado == 'EnRuta') {
        orden.estado = 'EnProceso';
      } else if (orden.estado == 'EnProceso') {
        orden.estado = 'Completado';
      }
    });
  }

  Color _getColorPrioridad(String prioridad) {
    switch (prioridad) {
      case 'Crítica':
        return Colors.red;
      case 'Alta':
        return Colors.orange;
      case 'Media':
        return Colors.amber.shade700;
      default:
        return Colors.green;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Field Ops Mobile', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            Text('Técnico: Bastian Contreras', style: TextStyle(fontSize: 12, color: Colors.white70)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => setState(() {}),
          )
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _ordenes.length,
        itemBuilder: (context, index) {
          final o = _ordenes[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            elevation: 2,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('#${o.id}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                      Chip(
                        label: Text(o.prioridad, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                        backgroundColor: _getColorPrioridad(o.prioridad),
                        padding: EdgeInsets.zero,
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(o.cliente, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on, size: 14, color: Colors.grey),
                      const SizedBox(width: 4),
                      Expanded(child: Text(o.direccion, style: const TextStyle(fontSize: 13, color: Colors.grey))),
                    ],
                  ),
                  const Divider(height: 24),
                  Text(o.servicio, style: const TextStyle(fontWeight: FontWeight.w500)),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade50,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          'Estado: ${o.estado}',
                          style: TextStyle(color: Colors.blue.shade900, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                      if (o.estado != 'Completado')
                        ElevatedButton.icon(
                          onPressed: () => _avanzarEstado(o),
                          icon: const Icon(Icons.play_arrow, size: 16),
                          label: Text(
                            o.estado == 'Pendiente'
                                ? 'Iniciar Ruta'
                                : o.estado == 'EnRuta'
                                    ? 'Iniciar Trabajo'
                                    : 'Finalizar',
                          ),
                        )
                      else
                        const Row(
                          children: [
                            Icon(Icons.check_circle, color: Colors.green, size: 18),
                            SizedBox(width: 4),
                            Text('Completado', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
                          ],
                        ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}