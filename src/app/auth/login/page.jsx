"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();

    const onSubmit = handleSubmit(async (data) => {
        console.log(data);
        const res = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        })

        console.log(res);
        if (!res.ok) {
            alert(res.error)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    });

    return (
        <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
            <form onSubmit={onSubmit} className="w-1/4">
                <h1 className="text-slate-200 font-bold text-4xl mb-4">Inicio de Sesión</h1>

                <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
                    Correo:
                </label>
                <input
                    type="email"
                    {...register("email", {
                        required: {
                            value: true,
                            message: "El correo es necesario",
                        },
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="Ingrese su Correo"
                />

                {errors.email && (
                    <span className="text-red-500 text-xs">
                        {errors.email.message}
                    </span>
                )}


                <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
                    Contraseña:
                </label>
                <input
                    type="password"
                    {...register("password", {
                        required: {
                            value: true,
                            message: "La contraseña es necesaria",
                        },
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="Ingrese su Contraseña"
                />

                {errors.password && (
                    <span className="text-red-500 text-xs">
                        {errors.password.message}
                    </span>
                )}

                <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
                    Iniciar Sesión
                </button>

            </form>
        </div>
    );
}