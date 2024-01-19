const { NextResponse } = require("next/server");
import prisma from "../../../libs/db";


// Los usuarios van a ser médicos
export async function GET() {
    const medicos = await prisma.user.findMany();
    return NextResponse.json(medicos);
}

export async function POST(request) {
    const data = await request.json();
    console.log(data);
    const nuevoMedico = await prisma.user.create({
        data: {
            email: data.email,
            username: data.username,
            firstname: data.firstname,
            lastname: data.lastname,
            password: data.password
        }
    });
    return NextResponse.json(nuevoMedico);
}