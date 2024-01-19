"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { CardBody, CardFooter, Avatar } from "@nextui-org/react";
import { Tabs, Tab, ScrollShadow, Textarea, Input } from "@nextui-org/react";
import { Button, Card, CardHeader, Divider, Image } from "@nextui-org/react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

import { PlusIcon } from "../../../components/icons/PlusIcon"
import { EditIcon } from "../../../components/icons/EditIcon"
import { DeleteIcon } from "../../../components/icons/DeleteIcon"


export default function HistoriasClinicasPage() {
    const [historiasClinicas, setHistoriasClinicas] = useState([])
    const [observaciones, setObservaciones] = useState([])
    const [mascotas, setMascotas] = useState([])
    const [mascotasEnHistoriasClinicas, setMascotasEnHistoriasClinicas] = useState([])
    const [medicos, setMedicos] = useState([])

    const [historiasClinicasActualizadas, setHistoriasClinicasActualizadas] = useState([])
    const [observacionesActualizadas, setObservacionesActualizadas] = useState([])

    const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null)
    const [observacionSeleccionada, setObservacionSeleccionada] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mascotasSinHistorias, setMascotasSinHistorias] = useState([]);

    // Estado para controlar la visibilidad del modal de confirmación
    const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);

    const [mostrarModalCita, setMostrarModalCita] = useState(false);

    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    // Estado para controlar el mensaje de alerta
    const [alerta, setAlerta] = useState({ visible: false, mensaje: "" });

    // Estado para controlar el spinner de carga
    const [cargando, setCargando] = useState(true);


    /* OBTENER DATOS DE API */
    const obtenerMedicos = async () => {
        try {
            const respuesta = await fetch('/api/medicos')
            const medicosData = await respuesta.json()
            setMedicos(medicosData)
        } catch (error) {
            console.error('Error al obtener los medicos:', error);
        }
    }

    // Obtener las historias clinicas de la mascota
    const obtenerHistoriasClinicas = async () => {
        try {
            setCargando(true);
            /* MASCOTAS CON HISTORIAS */

            const respuestaHistoriasClinicas = await fetch('/api/historiasClinicas')
            const historiasClinicasData = await respuestaHistoriasClinicas.json()
            setHistoriasClinicas(historiasClinicasData)

            console.log("Historias Clinicas:", historiasClinicasData);

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

            const mascotas = await Promise.all(historiasClinicasData.map(fetchPetData));
            setMascotasEnHistoriasClinicas(mascotas)

            const historiasClinicasActualizadas = historiasClinicasData.map((historia, index) => {
                const mascotaData = mascotas.find(m => m.pet_id === historia.pet_id);
                return { ...historia, ...mascotaData };
            });

            setHistoriasClinicasActualizadas(historiasClinicasActualizadas);
            console.log("Historias Clinicas Con Mascota:", historiasClinicasActualizadas);
            setCargando(false);

        } catch (error) {
            console.error('Error al obtener las historias clinicas:', error);
            setCargando(false);

        }
    }

    const obtenerObservaciones = async ({ clinicHistory_id }) => {
        try {
            setCargando(true);

            /* MEDICOS CON OBSERVACIONES */

            const respuestaObservaciones = await fetch(`/api/historiasClinicas/${clinicHistory_id}`)
            const observacionesData = await respuestaObservaciones.json()
            setObservaciones(observacionesData)

            console.log("Observaciones:", observacionesData);

            const fetchMedicData = async ({ medic_id }) => {
                const medicoRespuesta = await fetch(`/api/medicos/${medic_id}`)

                if (!medicoRespuesta.ok) throw new Error('No se pudo obtener el médico')
                const medicoData = await medicoRespuesta.json()

                return {
                    medic_id,
                    nombre: medicoData.firstname,
                    apellido: medicoData.lastname,
                }
            }

            const medicos = await Promise.all(observacionesData.map(fetchMedicData));
            /* console.log("Medicos:", medicos);
            setMedicos(medicos) */

            const observacionesActualizadas = observacionesData.map((observacion, index) => {
                const medicoData = medicos.find(m => m.medic_id === observacion.medic_id);
                return { ...observacion, ...medicoData };
            });

            setObservacionesActualizadas(observacionesActualizadas);
            console.log("Observaciones Con Medico:", observacionesActualizadas);
            setCargando(false);
        } catch (error) {
            console.error('Error al obtener las observaciones:', error);
            setCargando(false);
        }
    }

    const obtenerMascotas = async () => {
        try {
            const respuesta = await fetch('/api/mascotas')
            const mascotasData = await respuesta.json()
            setMascotas(mascotasData)
            console.log("Mascotas:", mascotasData);
        } catch (error) {
            console.error('Error al obtener las mascotas:', error);
        }
    }

    const registrarCita = async (cita) => {
        try {
            console.log("Registrando Cita:", cita);
            const respuesta = await fetch('/api/citas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cita)
            })

            if (!respuesta.ok) throw new Error('No se pudo registrar la cita')

            mostrarAlerta("¡Cita Registrada Correctamente!");

        } catch (error) {
            console.error('Error al registrar la cita:', error);
        }
    }

    /* ACTUALIZAR DATOS DE API */
    const registrarHistoriaClinica = async (historiaClinica) => {
        try {
            console.log("Registrando Historia Clinica:", historiaClinica);
            const respuesta = await fetch('/api/historiasClinicas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(historiaClinica)
            })

            if (!respuesta.ok) throw new Error('No se pudo registrar la historia clinica')

            mostrarAlerta("¡Historia Clinica Registrada Correctamente!");
            obtenerHistoriasClinicas()

        } catch (error) {
            console.error('Error al registrar la historia clinica:', error);
        }
    }

    const registrarObservacion = async (observacion, clinicHistory_id) => {
        try {
            const respuesta = await fetch(`/api/historiasClinicas/${clinicHistory_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(observacion)
            })

            if (!respuesta.ok) throw new Error('No se pudo registrar la observacion')

            mostrarAlerta("¡Observacion Registrada Correctamente!");
            obtenerObservaciones({ clinicHistory_id: historiaSeleccionada.id })

        } catch (error) {
            console.error('Error al registrar la observacion:', error);
        }
    }

    const actualizarObservacion = async (observacion, clinicHistory_id, observation_id) => {
        try {
            const respuesta = await fetch(`/api/historiasClinicas/${clinicHistory_id}/${observation_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(observacion)
            })

            if (!respuesta.ok) throw new Error('No se pudo actualizar la observacion')

            mostrarAlerta("¡Observacion Actualizada Correctamente!");
            obtenerObservaciones({ clinicHistory_id: historiaSeleccionada.id })

        } catch (error) {
            console.error('Error al actualizar la observacion:', error);
        }
    }

    const eliminarObservacion = async (observacion) => {
        try {
            const respuesta = await fetch(`/api/historiasClinicas/${historiaSeleccionada.id}/${observacion.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(observacion)
            })

            if (!respuesta.ok) throw new Error('No se pudo eliminar la observacion')

            mostrarAlerta("¡Observacion Eliminada Correctamente!");
            obtenerObservaciones({ clinicHistory_id: historiaSeleccionada.id })

        } catch (error) {
            console.error('Error al eliminar la observacion:', error);
        }
    }

    useEffect(() => {
        obtenerMascotas()
        obtenerMedicos()
        obtenerHistoriasClinicas()
    }, [])

    const handleNuevo = () => {
        setHistoriaSeleccionada({});
        setMostrarModal(true);
    }

    const handleMostrarHistoriaClinica = (historiaClinicaActualizada) => {
        setHistoriaSeleccionada(historiaClinicaActualizada);

        // Obtener observaciones al seleccionar una historia clínica
        console.log("Historia Clinica Seleccionada:", historiaClinicaActualizada.id);
        obtenerObservaciones({ clinicHistory_id: historiaClinicaActualizada.id });
        setMostrarModal(true);
    }

    const handleSelectChange = (event) => {
        console.log("Evento:", event);

        const mascotaSeleccionadaID = parseInt(event.target.value, 10);

        console.log("Mascota SeleccionadaID:", mascotaSeleccionadaID);
        setHistoriaSeleccionada((prevHistoriaSeleccionada) => ({
            ...prevHistoriaSeleccionada,
            pet_id: mascotaSeleccionadaID,
        }));
    };

    const handleSelectMedicoChange = (event) => {
        const medicoSeleccionadoID = parseInt(event.target.value, 10);
        console.log("Medico Seleccionado:", medicoSeleccionadoID);
        setObservacionSeleccionada((prevObservacionSeleccionada) => ({
            ...prevObservacionSeleccionada,
            medic_id: medicoSeleccionadoID,
        }));
    };

    const handleGuardarHistoria = (historiaClinica) => {
        if (historiaSeleccionada.id) {
            // Aquí es donde enviarías la solicitud PUT o PATCH a tu API para actualizar los detalles de una mascota
            //console.log("Actualizando Historia:", historiaClinica);
            //actualizarHistoriaClinica(historiaClinica);
        } else {
            // Aquí es donde enviarías la solicitud POST a tu API para agregar un nuevo mascota
            console.log("Registrando Historia:", historiaClinica);
            registrarHistoriaClinica(historiaClinica);
        }
        setMostrarModal(false);
    };

    const handleGuardarObservacion = (observacion, clinicHistory_id) => {
        console.log("Observacion:", observacion);
        console.log("clinicHistory_id:", clinicHistory_id);
        if (observacion.id && clinicHistory_id) {
            // Aquí es donde enviarías la solicitud PUT o PATCH a tu API para actualizar los detalles de una mascota
            console.log("Actualizando Observacion:", observacion);
            actualizarObservacion(observacion, clinicHistory_id, observacionSeleccionada.id);
        } else {
            // Aquí es donde enviarías la solicitud POST a tu API para agregar un nuevo mascota
            console.log("Registrando Observacion:", observacion);
            registrarObservacion(observacion, clinicHistory_id,);
        }
        setMostrarModal(false);
    };

    const handleEditarObservacion = (observacion) => {
        console.log("Observacion Seleccionada:", observacion);
        setObservacionSeleccionada(observacion);
        // Establecer la observación seleccionada y cambiar a la pestaña "Añadir"
        setObservacionSeleccionada(observacion);
        setMostrarModal(true);
    }

    const handleEliminarObservacion = (observacion) => {
        console.log("Observacion Seleccionada:", observacion);
        setObservacionSeleccionada(observacion);
        setMostrarModalConfirmacion(true); // Mostrar el modal de confirmación
    }

    const handleMostrarCita = () => {
        // Mostrar modal para agendar cita
        setMostrarModalCita(true);
    }

    const handleGuardarCita = (fecha, hora) => {

        const date = new Date(`${fecha} ${hora}`);

        const cita = {
            pet_id: historiaSeleccionada.id,
            date: date,
        }

        console.log("Cita:", cita);

        registrarCita(cita);

        // Guardar cita
        setMostrarModalCita(false);
    }

    // Función para confirmar la eliminación de un mascota
    const confirmarEliminacion = () => {
        //console.log("Mascota eliminado:", mascotaSeleccionada);
        eliminarObservacion(observacionSeleccionada); // Eliminar el médico seleccionado
        setMostrarModalConfirmacion(false); // Cerrar el modal de confirmación
    };

    const mostrarAlerta = (mensaje) => {
        setAlerta({ visible: true, mensaje });
        setTimeout(() => setAlerta({ visible: false, mensaje: "" }), 3000); // Desaparece después de 3 segundos
    };

    // HANDLE TEXT AREA CHANGE
    const handleTextAreaChange = (event) => {
        // Extraer el id y el valor del elemento del formulario/modal que a cambiado
        const { id, value } = event.target;

        // Si hay un mascota seleccionado (modo edicion), actualizar la mascota seleccionada
        setObservacionSeleccionada((prevObservacionSeleccionada) => ({
            ...prevObservacionSeleccionada,
            [id]: value,
        }));
    }

    return (
        <div className="flex flex-col justify-start min-h-[calc(100vh-5rem)] w-4/5 mx-auto mt-8">

            <h1 className="text-slate-200 font-bold text-4xl mb-4">Historias Clinicas</h1>

            <div className="flex justify-end items-center mb-4">
                <div className="flex gap-2">
                    <Button
                        color="primary" endContent={<PlusIcon />} onClick={handleNuevo}>
                        Nueva Historia
                    </Button>
                </div>
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">


                {cargando ? (
                    <>
                        <div className="flex justify-center items-center col-span-full mb-8">
                            <Spinner color="primary" size="lg" />
                        </div>
                    </>
                ) : (
                    <>
                        {historiasClinicasActualizadas.map((historiaClinicaActualizada, index) => (
                            <Card
                                key={index}
                                className="max-w-[300px]"
                                isPressable onPress={() => handleMostrarHistoriaClinica(historiaClinicaActualizada)}>

                                <CardHeader className="flex gap-5">
                                    <Image
                                        height={40}
                                        width={40}
                                        src={historiaClinicaActualizada.tipo === "Canina" ? "/icons/canina.png" : "/icons/felina.png"}
                                    />

                                    <div className="flex flex-col items-start">
                                        <p className="font-bold text-lg">{historiaClinicaActualizada.nombre}</p>
                                        <p className="text-small text-default-500">{historiaClinicaActualizada.raza}</p>
                                        <p className="text-small text-default-500">{historiaClinicaActualizada.color}</p>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </>
                )}

                {/* Modal de Historias Clinicas */}
                <Modal isOpen={mostrarModal} onOpenChange={() => setMostrarModal(!mostrarModal)} backdrop="blur" size="xl">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    {historiaSeleccionada.id ? `Historia de ${historiaSeleccionada.nombre}` : 'Nueva Historia'}
                                </ModalHeader>

                                <ModalBody>
                                    {historiaSeleccionada.id ? (
                                        <>
                                            <div className="flex h-5 items-center space-x-3 text-small">
                                                <div>{historiaSeleccionada.tipo}</div>
                                                <Divider orientation="vertical" />
                                                <div>{historiaSeleccionada.raza}</div>
                                                <Divider orientation="vertical" />
                                                <div>{historiaSeleccionada.color}</div>
                                                <Divider orientation="vertical" />

                                                <div className="flex-grow" />

                                                <Button onClick={handleMostrarCita}>
                                                    Agendar Cita
                                                </Button>
                                            </div>

                                            <Tabs>
                                                <Tab title="Observaciones">
                                                    <ScrollShadow hideScrollBar className="h-[30vh]">

                                                        {cargando ? (
                                                            <>
                                                                <div className="flex justify-center items-center col-span-full mb-8">
                                                                    <Spinner color="primary" size="lg" />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {observacionesActualizadas.length > 0 ? (
                                                                    observacionesActualizadas.map((observacionActualizada, index) => (
                                                                        <Card key={index} className="mb-4"> {/* Ajustado el estilo de la tarjeta */}

                                                                            <CardHeader className="justify-between">
                                                                                <div className="flex gap-5">
                                                                                    <Avatar showFallback radius="full" size="sm" src='https://images.unsplash.com/broken' />
                                                                                    <div className="flex flex-col gap-2 items-start justify-center">
                                                                                        <h4 className="text-wrap font-semibold leading-none text-default-600">
                                                                                            Por {`${observacionActualizada.nombre} ${observacionActualizada.apellido}`}
                                                                                        </h4>
                                                                                    </div>
                                                                                </div>
                                                                            </CardHeader>

                                                                            <CardBody className="px-3 py-0 text-small text-default-400">
                                                                                <p>
                                                                                    {observacionActualizada.observations}
                                                                                </p>
                                                                            </CardBody>

                                                                            <CardFooter className="gap-1">
                                                                                <div className="flex gap-3">
                                                                                    <p className="font-semibold text-default-400 text-small">
                                                                                        {new Date(observacionActualizada.updatedAt).toISOString().split('T')[0]}
                                                                                    </p>
                                                                                    <div className="flex flex-grow justify-end gap-3">
                                                                                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                                                            onClick={() => handleEditarObservacion(observacionActualizada)
                                                                                            }
                                                                                        >
                                                                                            <EditIcon />
                                                                                        </span>
                                                                                        <span className="text-lg text-danger cursor-pointer active:opacity-50"
                                                                                            onClick={() => handleEliminarObservacion(observacionActualizada)}>
                                                                                            <DeleteIcon />
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </CardFooter>
                                                                        </Card>
                                                                    ))
                                                                ) : (
                                                                    <>
                                                                        <div className="flex justify-center items-center gap-1">
                                                                            <p className="font-semibold text-default-400 text-small">
                                                                                No hay observaciones
                                                                            </p>
                                                                        </div>
                                                                    </>
                                                                )
                                                                }
                                                            </>
                                                        )}
                                                    </ScrollShadow>
                                                </Tab>

                                                <Tab title="Añadir">
                                                    <Card>
                                                        <CardBody>
                                                            {/* Seleccionar el médico que va a realizar la observación */}
                                                            <div className="space-y-3">
                                                                <Select label="Seleccione un Médico" onChange={handleSelectMedicoChange} required>
                                                                    {medicos && (
                                                                        medicos.map((medico, index) => (
                                                                            <SelectItem key={index + 1} value={medico.id} textValue={medico.firstname}>
                                                                                {medico.firstname} {medico.lastname}
                                                                            </SelectItem>
                                                                        ))
                                                                    )}
                                                                </Select>

                                                                <Textarea
                                                                    label="Observaciones"
                                                                    value={observacionSeleccionada ? observacionSeleccionada.observations : ''}
                                                                    onChange={(e) => handleTextAreaChange({ target: { id: 'observations', value: e.target.value } })}
                                                                />
                                                            </div>

                                                            <div className="flex justify-end items-center gap-3 mt-2">
                                                                <Button
                                                                    className="mt-2"
                                                                    color="primary"
                                                                    variant="light"
                                                                    onClick={() => handleGuardarObservacion(observacionSeleccionada, historiaSeleccionada.id)}>
                                                                    Guardar
                                                                </Button>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Tab>
                                            </Tabs>
                                            <Divider />
                                        </>
                                    ) : (
                                        // Mostrar un mensaje de confirmacion para crear un nuevo registro a partir del id de la mascota
                                        <>
                                            {/* Mostrar las mascotas */}
                                            <p className="text-default-400 text-small">Seleccione una mascota para crear una historia clinica</p>
                                            <Select label="Seleccione una Mascota" onChange={handleSelectChange} required>
                                                {mascotas.map((mascota, index) => (
                                                    <SelectItem key={index + 1} value={mascota.id} textValue={mascota.name}>
                                                        {mascota.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </>
                                    )}
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                    {/* Este boton solo se va a mostrar cuando se va a añadir una historia */}
                                    {!historiaSeleccionada.id && (
                                        <Button
                                            color="primary"
                                            onPress={() => { handleGuardarHistoria(historiaSeleccionada); onClose(); }}>
                                            Agregar
                                        </Button>
                                    )}
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                {/* MODAL DE CITAS */}
                <Modal isOpen={mostrarModalCita} onOpenChange={setMostrarModalCita} backdrop="blur">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader>
                                    Agendar Cita
                                </ModalHeader>

                                <ModalBody>
                                    <div className="flex flex-col gap-3">
                                        <Input
                                            type="text"
                                            value={historiaSeleccionada?.nombre}
                                            disabled
                                        />

                                        {/* Seleccionar el dia, fecha y hora para la cita */}
                                        <div className="flex gap-3">
                                            <Input
                                                type="date"
                                                placeholder="Fecha"
                                                value={fecha}
                                                onChange={(e) => setFecha(e.target.value)}
                                            />
                                            <Input
                                                type="time"
                                                placeholder="Hora"
                                                value={hora}
                                                onChange={(e) => setHora(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </ModalBody>

                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                    <Button
                                        color="primary"
                                        // Obtener los valores del imput para fecha y hora
                                        onPress={() => { handleGuardarCita(fecha, hora); onClose(); }}>
                                        Agregar
                                    </Button>
                                </ModalFooter>
                            </>

                        )}


                    </ModalContent>
                </Modal>

                {/* MODAL DE CONFIRMACION */}
                <Modal isOpen={mostrarModalConfirmacion} onOpenChange={setMostrarModalConfirmacion}>
                    <ModalContent>
                        <ModalHeader>Confirmar eliminación</ModalHeader>
                        <ModalBody>¿Estás seguro de que quieres eliminar a esta observacion?</ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={confirmarEliminacion}>Eliminar</Button>
                            <Button onPress={() => setMostrarModalConfirmacion(false)}>Cancelar</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* MODAL DE ALERTA */}
                <Modal isOpen={alerta.visible} onOpenChange={() => setAlerta({ visible: false, mensaje: "" })}>
                    <ModalContent>
                        <ModalHeader>Alerta</ModalHeader>
                        <ModalBody>{alerta.mensaje}</ModalBody>
                        <ModalFooter>
                            <Button onPress={() => setAlerta({ visible: false, mensaje: "" })}>OK</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div >
        </div >
    )
}
