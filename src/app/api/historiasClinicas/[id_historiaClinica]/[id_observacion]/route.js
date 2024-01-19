import { NextResponse } from "next/server";
import prisma from "../../../../../libs/db";

// Mostrar solo una observacion
export async function GET(request, { params }) {
    const observacion = await prisma.observations.findUnique({
        where: {
            id: Number(params.id_observacion)
        }
    });
    return NextResponse.json(observacion);
}

// Actualizar una observacion
export async function PUT(request, { params }) {
    const data = await request.json();
    const observacion = await prisma.observations.update({
        where: {
            id: Number(params.id_observacion)
        },
        data: {
            medic_id: data.medic_id,
            observations: data.observations,
        }
    });
    return NextResponse.json(observacion);
}

// Eliminar una observacion
export async function DELETE(request, { params }) {
    const observacion = await prisma.observations.delete({
        where: {
            id: Number(params.id_observacion)
        }
    });
    return NextResponse.json(observacion);
}