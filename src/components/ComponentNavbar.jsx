import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from "../app/api/auth/[...nextauth]/route";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, User, Avatar } from "@nextui-org/react";


export default async function ComponentNavbar() {
    const sesion = await getServerSession(authOptions)

    return (
        <Navbar isBordered>


            {!sesion?.user ? (
                <>
                    <NavbarBrand className="w-full">
                        <p className="font-bold text-inherit">LCK CODE</p>
                    </NavbarBrand>

                    <NavbarContent className="hidden sm:flex gap-4" justify="center">
                        <NavbarItem>
                            <Link href="/">
                                Home
                            </Link>
                        </NavbarItem>
                    </NavbarContent>

                    <NavbarContent justify="end">
                        <NavbarItem isActive>
                            <Link href="/auth/login">
                                Inicio de Sesión
                            </Link>
                        </NavbarItem>
                        {/* <NavbarItem>
                                <Link href="/auth/register">
                                    Registro
                                </Link>
                            </NavbarItem> */}
                    </NavbarContent>
                </>
            ) : (
                <>
                    <NavbarBrand className="w-full">
                        <User
                            name={sesion?.user?.name}
                            description={sesion?.user?.email}
                        />
                    </NavbarBrand>

                    <NavbarContent className="hidden sm:flex gap-4" justify="center">
                        <NavbarItem>
                            <Link href="/dashboard/citas">
                                Citas
                            </Link>
                        </NavbarItem>
                        <NavbarItem isActive>
                            <Link href="/dashboard/historiasClinicas">
                                Historias Clínicas
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link href="/dashboard/medicos">
                                Médicos
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link href="/dashboard/mascotas">
                                Mascotas
                            </Link>
                        </NavbarItem>
                        <NavbarItem className="hidden lg:flex">
                            <Link href="/dashboard">Dashboard</Link>
                        </NavbarItem>
                    </NavbarContent>

                    <NavbarContent justify="end">
                        <Button color="primary" href="/api/auth/signout" as={Link}>
                            Cerrar Sesión
                        </Button>
                    </NavbarContent>
                </>
            )}
        </Navbar>
    )
}