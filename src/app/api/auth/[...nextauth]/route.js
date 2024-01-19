import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "../../../../libs/db";

const authOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log(credentials);

                const usuarioEncontrado = await db.user.findUnique({
                    where: {
                        email: credentials.email,
                    }
                })

                if (!usuarioEncontrado) throw new Error("Usuario no encontrado");
                console.log("Usuario Encontrado: ", usuarioEncontrado);

                // Comparar constraseñas sin usar bycrypt, ya que la contraseña no se encriptocd
                if (credentials.password != usuarioEncontrado.password) throw new Error("Contraseña incorrecta");

                return {
                    id: usuarioEncontrado.id,
                    name: usuarioEncontrado.username,
                    /* firstName: usuarioEncontrado.firstname,
                    lastName: usuarioEncontrado.lastname, */
                    email: usuarioEncontrado.email,
                }
            }
        })
    ],
    pages: {
        signIn: "/auth/login",
    }
}


NextAuth(authOptions)

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST };
export default authOptions
