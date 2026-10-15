//backend\src\controllers\barber.controller.ts

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getBarbers = async (req: Request, res: Response) => {
  try {
    const barbers = await prisma.barbero.findMany({
      where: { activo: true },
      include: {
        horarios: {
          where: { activo: true },
          select: {
            diaSemana: true,
            horaInicio: true,
            horaFin: true,
          },
        },
      },
    });

    res.json({ success: true, data: barbers });
  } catch (error) {
    console.error('Error al obtener barberos:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};