import { NextResponse } from "next/server";
import db from "../../../../libs/db"

export async function POST(request) {
    try {
        const data = await request.json();
        console.log("DATA:", data);

        const usuarioEncontrado = await db.user.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.email }
                ]
            }
        })

        if (usuarioEncontrado) {
            let message = 'El usuario ya existe';
            if (usuarioEncontrado.email === data.email) {
                message = 'El correo ya existe';
            }
            return NextResponse.json({
                message: message
            }, {
                status: 400
            })
        }

        const newUser = await db.user.create({ data })

        // Retornar todos los valores menos el password
        const { password, ...user } = newUser;
        return NextResponse.json(user)

    } catch (error) {
        return NextResponse.json({
            message: error.message
        }, {
            status: 500
        })
    }
}