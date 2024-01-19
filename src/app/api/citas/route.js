import { NextResponse } from "next/server";

// Mostrar Citas
export async function GET() {
    const citas = await prisma.appointments.findMany();
    return NextResponse.json(citas);
}

// Crear Cita
export async function POST(request) {
    const data = await request.json();
    console.log(data);
    const nuevaCita = await prisma.appointments.create({
        data: {
            pet_id: data.pet_id,
            date: data.date,
        }
    });
    return NextResponse.json(nuevaCita);
}