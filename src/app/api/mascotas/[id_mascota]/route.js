import { NextResponse } from "next/server";
import prisma from "../../../../libs/db"

export async function GET(require, { params }) {

    const mascota = await prisma.pet.findUnique({
        where: {
            id: Number(params.id_mascota)
        }
    });

    return NextResponse.json(mascota);
}

export async function PUT(require, { params }) {
    const data = await require.json();
    const mascotaActualizada = await prisma.pet.update({
        where: {
            id: Number(params.id_mascota)
        },
        data: data
    });
    return NextResponse.json({ messaje: "Mascota Actualizada" });
}

export async function DELETE(require, { params }) {

    try {
        const mascotaEliminada = await prisma.pet.delete({
            where: {
                id: Number(params.id_mascota)
            }
        });
        return NextResponse.json("Mascota Eliminado");
    } catch (error) {
        return NextResponse.json(error.message);
    }

}