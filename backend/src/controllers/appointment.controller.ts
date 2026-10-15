import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { getAvailableSlots } from '../services/availability.service';

// GET /api/appointments/availability?barberId=...&date=YYYY-MM-DD
export const getAvailability = async (req: Request, res: Response) => {
    try {
        const { barberId, date } = req.query;

        if (!barberId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Parámetros requeridos: barberId y date (YYYY-MM-DD)',
            });
        }

        const availableSlots = await getAvailableSlots(
            barberId as string,
            date as string
        );

        return res.json({
            success: true,
            date,
            barberId,
            availableSlots,
        });
    } catch (error) {
        console.error('Error al calcular disponibilidad:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

// POST /api/appointments
export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { clienteNombre, clienteTelefono, barberoId, servicioId, fecha, horaInicio } = req.body;

        if (!clienteNombre || !clienteTelefono || !barberoId || !servicioId || !fecha || !horaInicio) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios: clienteNombre, clienteTelefono, barberoId, servicioId, fecha, horaInicio',
            });
        }

        // 1. Validar si el horario solicitado está realmente libre
        const slotsDisponibles = await getAvailableSlots(barberoId, fecha);
        if (!slotsDisponibles.includes(horaInicio)) {
            return res.status(409).json({
                success: false,
                message: 'El horario seleccionado ya no está disponible. Por favor elige otro.',
            });
        }

        // 2. Calcular horaFin sumando 30 minutos
        const [horas, mins] = horaInicio.split(':').map(Number);
        const finEnMinutos = horas * 60 + mins + 30;
        const horaFin = `${Math.floor(finEnMinutos / 60).toString().padStart(2, '0')}:${(finEnMinutos % 60).toString().padStart(2, '0')}`;

        // 3. Obtener o crear al cliente por teléfono
        const cliente = await prisma.cliente.upsert({
            where: { telefono: clienteTelefono },
            update: { nombre: clienteNombre },
            create: {
                nombre: clienteNombre,
                telefono: clienteTelefono,
            },
        });

        const dateParts = fecha.split('-').map(Number);
        const fechaObj = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));

        // 4. Crear la cita
        const nuevaCita = await prisma.cita.create({
            data: {
                clienteId: cliente.id,
                barberoId,
                servicioId,
                fecha: fechaObj,
                horaInicio,
                horaFin,
                estado: 'CONFIRMADA',
            },
            include: {
                cliente: true,
                barbero: true,
                servicio: true,
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Cita reservada con éxito',
            data: nuevaCita,
        });
    } catch (error) {
        console.error('Error al crear la cita:', error);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};