"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const router = useRouter();

    const onSubmit = handleSubmit(async (data) => {
        console.log("DATA HANDLE:", data);
        try {
            if (data.password !== data.confirmPassword) {
                return alert("Las contraseñas no coinciden");
            }

            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    username: data.username,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    password: data.password,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("RES:", res);

            if (res.ok) {
                router.push("/auth/login");
            } else {
                const data = await res.json();
                console.log("DATA:", data.message);
                alert(data.message);
            }

        } catch (error) {
            console.log("Error:", error);
        }
    });


    return (
        <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
            <form onSubmit={onSubmit} className="w-1/4">
                <h1 className="text-slate-200 font-bold text-4xl mb-4">Register</h1>

                <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
                    Usuario:
                </label>
                <input
                    type="text"
                    {...register("username", {
                        required: {
                            value: true,
                            message: "Username is required",
                        },
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="Ingrese su Usuario"
                />

                {errors.username && (
                    <span className="text-red-500 text-xs">
                        {errors.username.message}
                    </span>
                )}

                <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
                    Nombre:
                </label>
                <input
                    type="text"
                    {...register("firstname", {
                        required: {
                            value: true,
                            message: "El nombre es necesario",
                        },
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="Ingrese su Nombre"
                />

                {errors.firstname && (
                    <span className="text-red-500 text-xs">
                        {errors.firstname.message}
                    </span>
                )}

                <label htmlFor="username" className="text-slate-500 mb-2 block text-sm">
                    Apellido:
                </label>
                <input
                    type="text"
                    {...register("lastname", {
                        required: {
                            value: true,
                            message: "El apellido es necesario",
                        },
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="Ingrese su Apellido"
                />

                {errors.lastname && (
                    <span className="text-red-500 text-xs">
                        {errors.lastname.message}
                    </span>
                )}

                <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
                    Email:
                </label>
                <input
                    type="email"
                    {...register("email", {
                        required: {
                            value: true,
                            message: "Email is required",
                        },
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder="Ingrese su Email"
                />
                {errors.email && (
                    <span className="text-red-500 text-xs">{errors.email.message}</span>
                )}

                <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
                    Contraseña:
                </label>
                <input
                    type="password"
                    {...register("password", {
                        required: {
                            value: true,
                            message: "Password is required",
                        },
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder=""
                />
                {errors.password && (
                    <span className="text-red-500 text-sm">
                        {errors.password.message}
                    </span>
                )}

                <label
                    htmlFor="confirmPassword"
                    className="text-slate-500 mb-2 block text-sm"
                >
                    Confirmar Contraseña:
                </label>
                <input
                    type="password"
                    {...register("confirmPassword", {
                        required: {
                            value: true,
                            message: "Confirm Password is required",
                        },
                    })}
                    className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
                    placeholder=""
                />
                {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">
                        {errors.confirmPassword.message}
                    </span>
                )}

                <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
                    Register
                </button>
            </form>
        </div>
    );
}
