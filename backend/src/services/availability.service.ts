import { prisma } from '../lib/prisma';

// Convierte "10:30" a minutos (630) para operar fácilmente
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convierte minutos (630) de vuelta a "10:30"
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export async function getAvailableSlots(barberoId: string, fechaStr: string) {
  // fechaStr formato: "YYYY-MM-DD"
  const dateParts = fechaStr.split('-').map(Number);
  // Mes en JS es base 0 (0 = Enero, 8 = Septiembre)
  const dateObj = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
  const diaSemana = dateObj.getUTCDay(); // 0 = Domingo, 1 = Lunes...

  // 1. Obtener horario laboral del barbero para este día
  const horario = await prisma.horario.findFirst({
    where: {
      barberoId,
      diaSemana,
      activo: true,
    },
  });

  if (!horario) {
    return []; // El barbero no trabaja este día
  }

  // 2. Generar todos los bloques posibles de 30 min
  const inicioMinutos = timeToMinutes(horario.horaInicio);
  const finMinutos = timeToMinutes(horario.horaFin);
  const todosLosSlots: string[] = [];

  for (let min = inicioMinutos; min + 30 <= finMinutos; min += 30) {
    todosLosSlots.push(minutesToTime(min));
  }

  // 3. Buscar citas ya reservadas (que no estén canceladas)
  const citasOcupadas = await prisma.cita.findMany({
    where: {
      barberoId,
      fecha: dateObj,
      estado: {
        notIn: ['CANCELADA'],
      },
    },
    select: {
      horaInicio: true,
    },
  });

  const horasOcupadas = new Set(citasOcupadas.map((c) => c.horaInicio));

  // 4. Filtrar los disponibles
  return todosLosSlots.filter((slot) => !horasOcupadas.has(slot));
}