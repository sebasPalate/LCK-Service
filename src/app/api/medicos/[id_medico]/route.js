import { NextResponse } from "next/server";
import prisma from "../../../../libs/db"

export async function GET(require, { params }) {

    const medico = await prisma.user.findUnique({
        where: {
            id: Number(params.id_medico)
        }
    });

    return NextResponse.json(medico);
}

export async function PUT(require, { params }) {
    const data = await require.json();
    const medicoActualizado = await prisma.user.update({
        where: {
            id: Number(params.id_medico)
        },
        data: data
    });
    return NextResponse.json({ messaje: "Medico Actualizado" });
}

export async function DELETE(require, { params }) {

    try {
        const medicoEliminado = await prisma.user.delete({
            where: {
                id: Number(params.id_medico)
            }
        });
        return NextResponse.json("Medico Eliminado");
    } catch (error) {
        return NextResponse.json(error.message);
    }

}