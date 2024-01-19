const { NextResponse } = require("next/server");
import prisma from "../../../libs/db";


// Los usuarios van a ser mascotas
export async function GET() {
    const mascotas = await prisma.pet.findMany();
    return NextResponse.json(mascotas);
}

export async function POST(request) {
    const data = await request.json();
    console.log(data);
    const nuevaMascota = await prisma.pet.create({
        data: {
            name: data.name,
            type: data.type,
            race: data.race,
            property: data.property,
            color: data.color,
            age: data.age
        }
    });
    return NextResponse.json(nuevaMascota);
}