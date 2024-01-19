"use client";
import { Card, CardHeader, Spinner, Avatar, CardBody, CardFooter, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react'

import CameraIcon from '../../../components/icons/CameraIcon'

function formatDate(dateTimeString) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC'
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString(undefined, options);
}


export default function Page() {
    const [mascotas, setMascotas] = useState([])
    const [citasActualizadas, setCitasActualizadas] = useState([])
    const [estado, setEstado] = useState('Pendiente');


    // Estado para controlar el spinner de carga
    const [cargando, setCargando] = useState(true);

    /* OBTENER DATOS API */
    const obtenerCitas = async () => {
        try {
            setCargando(true);

            const respuestaCitas = await fetch('/api/citas')
            const citasData = await respuestaCitas.json()

            // Obtener los datos de la mascota
            const fetchPetData = async ({ pet_id }) => {
                const mascotaRespuesta = await fetch(`/api/mascotas/${pet_id}`)
                if (!mascotaRespuesta.ok) throw new Error('No se pudo obtener la mascota')
                const mascotaData = await mascotaRespuesta.json()

                return {
                    pet_id,
                    nombre: mascotaData.name,
                    raza: mascotaData.race,
                    color: mascotaData.color,
                    edad: mascotaData.age,
                    propietario: mascotaData.property,
                    tipo: mascotaData.type
                }
            }

            const mascotas = await Promise.all(citasData.map(fetchPetData));

            const citasActualizadas = citasData.map((cita, index) => {
                const mascotaData = mascotas.find(m => m.pet_id === cita.pet_id);
                return { ...cita, ...mascotaData };
            });

            setCitasActualizadas(citasActualizadas)
            setCargando(false);
        } catch (error) {
            console.error('Error al obtener las citas:', error);
            setCargando(false);
        }
    }

    useEffect(() => {
        obtenerCitas()
    }, [])

    return (
        <div className="flex flex-col justify-start min-h-[calc(100vh-5rem)] w-4/5 mx-auto mt-8">
            <h1 className="text-slate-200 font-bold text-4xl mb-4">Citas</h1>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {cargando ? (
                    <>
                        <div className="flex justify-center items-center col-span-full mb-8">
                            <Spinner color="primary" size="lg" />
                        </div>
                    </>
                ) : (
                    <>
                        {citasActualizadas.map((cita, index) => (
                            <Card key={index} className="max-w-[300px]">
                                <CardHeader className="justify-between">
                                    <div className="flex gap-5">
                                        <Avatar showFallback src='https://images.unsplash.com/broken' fallback={
                                            <CameraIcon className="animate-pulse w-6 h-6 text-default-500" fill="currentColor" size={20} />
                                        } />
                                        <div className="flex flex-col gap-1 items-start justify-center">
                                            <h4 className="text-small font-semibold leading-none text-default-600">
                                                De {cita.nombre}
                                            </h4>
                                            <h5 className="text-small tracking-tight text-default-400">
                                                {cita.raza}
                                            </h5>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardBody className="gap-3 px-3 py-0 text-small text-default-400">
                                    <div className="flex gap-2">
                                        <Select
                                            label="Pendiente"
                                            value={estado}
                                            onChange={(value) => setEstado(value)}
                                            className="w-full">

                                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                                            <SelectItem value="Atendida">Atendida</SelectItem>
                                        </Select>
                                    </div>

                                    <div>
                                        <p className="text-default-400 text-small">{formatDate(cita.date)}</p>
                                    </div>

                                </CardBody>
                                <CardFooter></CardFooter>
                            </Card>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}