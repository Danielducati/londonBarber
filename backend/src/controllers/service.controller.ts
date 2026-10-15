//backend\src\controllers\service.controller.ts


import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.servicio.findMany({
      where: { activo: true },
      orderBy: { precio: 'asc' },
    });

    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};