const { NextResponse } = require("next/server");
import prisma from "../../../libs/db";


// Los historias van a ser historias

export async function GET() {
    const historias = await prisma.clinicHistory.findMany();
    return NextResponse.json(historias);
}

// Al momento de crear una historia clinica, no debe repetirse el numero de la mascota, ya que solo puede existir una historia clinica por mascota

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("DATA POST:", data);

        // Verificar si ya existe una historia clínica para la mascota
        const existingHistory = await prisma.clinicHistory.findFirst({
            where: {
                pet_id: data.pet_id,
            },
        });

        if (existingHistory) {
            // Si ya existe una historia clínica para la mascota, devolver un error
            return NextResponse.error(400, 'Ya existe una historia clínica para esta mascota');
        }

        const nuevaHistoria = await prisma.clinicHistory.create({
            data: {
                pet_id: data.pet_id,
            }
        });
        return NextResponse.json(nuevaHistoria);
    } catch (error) {
        console.log("ERROR:", error);
        return NextResponse.error(500, 'Ha ocurrido un error en el servidor');
    }
}

export async function PUT(request) {
    const data = await request.json();
    const historia = await prisma.clinicHistory.update({
        where: {
            id: data.id
        },
        data: {
            pet_id: data.pet_id,
        }
    });
    return NextResponse.json(historia);
}

export async function DELETE(request) {
    const data = await request.json();
    const historia = await prisma.clinicHistory.delete({
        where: {
            id: data.id
        }
    });
    return NextResponse.json(historia);
}