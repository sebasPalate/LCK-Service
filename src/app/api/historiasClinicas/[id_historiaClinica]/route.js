import { NextResponse } from "next/server";
import prisma from "../../../../libs/db";

// Obtener las observaciones de una historia clinica
export async function GET(require, { params }) {
    const observaciones = await prisma.observations.findMany({
        where: {
            clinicHistory_id: Number(params.id_historiaClinica)
        }
    });
    return NextResponse.json(observaciones);
}

// Ingresar una observacion a una historia clinica

export async function POST(request, { params }) {
    try {
        const data = await request.json();
        console.log("DATA POST:", data);

        const nuevaObservacion = await prisma.observations.create({
            data: {
                clinicHistory_id: Number(params.id_historiaClinica),
                medic_id: data.medic_id,
                observations: data.observations,
            }
        });
        console.log("NUEVA OBSERVACION:", nuevaObservacion);
        return NextResponse.json(nuevaObservacion);
    } catch (error) {
        console.log(error);
        return NextResponse.error(500, 'Ha ocurrido un error en el servidor');
    }
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