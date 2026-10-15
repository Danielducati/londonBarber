import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando carga de datos iniciales...');

  // 1. Limpiar datos previos
  await prisma.cita.deleteMany();
  await prisma.colaEspera.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.barbero.deleteMany();
  await prisma.cliente.deleteMany();

  // 2. Crear Servicios
  const corte = await prisma.servicio.create({
    data: { nombre: 'Corte', precio: 18000, duracion: 30 },
  });

  const corteBarba = await prisma.servicio.create({
    data: { nombre: 'Corte + barba', precio: 20000, duracion: 30 },
  });

  const completo = await prisma.servicio.create({
    data: { nombre: 'Corte + barba + cejas', precio: 22000, duracion: 30 },
  });

  // 3. Crear Barberos
  const carlos = await prisma.barbero.create({
    data: { nombre: 'Carlos', telefono: '573001112233' },
  });

  const pedro = await prisma.barbero.create({
    data: { nombre: 'Pedro', telefono: '573002223344' },
  });

  const andres = await prisma.barbero.create({
    data: { nombre: 'Andrés', telefono: '573003334455' },
  });

  // 4. Asignar Horarios (Lunes a Sábado = 1 a 6, Domingo = 0)
  // Carlos: Lunes a Sábado (10:00 a 20:00), Domingo (10:00 a 17:00)
  for (let dia = 1; dia <= 6; dia++) {
    await prisma.horario.create({
      data: { barberoId: carlos.id, diaSemana: dia, horaInicio: '10:00', horaFin: '20:00' },
    });
  }
  await prisma.horario.create({
    data: { barberoId: carlos.id, diaSemana: 0, horaInicio: '10:00', horaFin: '17:00' },
  });

  // Pedro: Lunes a Sábado (14:00 a 20:00), Domingo (10:00 a 17:00)
  for (let dia = 1; dia <= 6; dia++) {
    await prisma.horario.create({
      data: { barberoId: pedro.id, diaSemana: dia, horaInicio: '14:00', horaFin: '20:00' },
    });
  }
  await prisma.horario.create({
    data: { barberoId: pedro.id, diaSemana: 0, horaInicio: '10:00', horaFin: '17:00' },
  });

  // Andrés: Domingo (10:00 a 17:00)
  await prisma.horario.create({
    data: { barberoId: andres.id, diaSemana: 0, horaInicio: '10:00', horaFin: '17:00' },
  });

  console.log('¡Datos iniciales cargados con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });