"use client";
import React, { useState } from "react";
import { Slider } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";


import { EditIcon } from "../../../components/icons/EditIcon";
import { PlusIcon } from "../../../components/icons/PlusIcon"
import { DeleteIcon } from "../../../components/icons/DeleteIcon";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Input } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";


export default function MascotasPage() {
    // Datos de mascotas
    const [mascotas, setMascotas] = React.useState([]);

    // Médico seleccionado
    const [mascotaSeleccionada, setMascotaSeleccionada] = React.useState(null);

    // Mostrar Modal
    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado para controlar la visibilidad del modal de confirmación
    const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);

    // Estado para controlar el mensaje de alerta
    const [alerta, setAlerta] = useState({ visible: false, mensaje: "" });

    const [razasPerro, setRazasPerro] = useState([
        { label: "Schnauzer", value: "Schnauzer" },
        { label: "Poodle", value: "Poodle" },
        { label: "Chihuahua", value: "Chihuahua" },
        { label: "Bulldog", value: "Bulldog" },
        { label: "Pug", value: "Pug" },
        { label: "Labrador", value: "Labrador" },
        { label: "Golden Retriever", value: "Golden Retriever" },
        { label: "Pastor Aleman", value: "Pastor Aleman" },
        { label: "Husky", value: "Husky" },
        { label: "Beagle", value: "Beagle" },
        { label: "Otro", value: "Otro" },
    ]);

    const [razasGato, setRazasGato] = useState([
        { label: "Angora", value: "Angora" },
        { label: "Persa", value: "Persa" },
        { label: "Siames", value: "Siames" },
        { label: "Bengala", value: "Bengala" },
        { label: "Otro", value: "Otro" },
    ]);


    /* METODOS DE API */
    const obtenerMascotas = async () => {
        try {
            const response = await fetch('/api/mascotas');
            const data = await response.json();
            setMascotas(data);
        } catch (error) {
            console.error('Error al obtener datos de mascotas:', error);
        }
    };

    const registrarMascota = async (mascota) => {
        try {
            const response = await fetch('/api/mascotas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mascota),
            });

            if (!response.ok) {
                throw new Error('Error al Registrar una Mascota');
            }

            mostrarAlerta("Mascota registrada correctamente");
            obtenerMascotas();
        } catch (error) {
            mostrarAlerta("Error al registrar una mascota");
            console.log(error);

        }
    };

    const actualizarMascota = async (mascota) => {
        try {
            const response = await fetch(`/api/mascotas/${mascota.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mascota),
            });

            if (!response.ok) {
                throw new Error('Error al Actualizar una Mascota');
            }
            mostrarAlerta("Mascota actualizada correctamente");
            obtenerMascotas();
        } catch (error) {
            mostrarAlerta("Error al actualizar un médico");
            console.log(error);
        }
    };

    const eliminarMascota = async (mascota) => {
        try {
            const response = await fetch(`/api/mascotas/${mascota.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al Eliminar una Mascota');
            }

            obtenerMascotas();
        } catch (error) {
            mostrarAlerta("Error al eliminar una mascota");
            console.log(error);

        }
    };

    React.useEffect(() => {
        obtenerMascotas();
    }, []);

    const handleInputChange = (event) => {
        // Extraer el id y el valor del elemento del formulario/modal que a cambiado
        const { id, value } = event.target;

        // Si hay un mascota seleccionado (modo edicion), actualizar la mascota seleccionada
        setMascotaSeleccionada((prevMascotaSeleccionada) => ({
            ...prevMascotaSeleccionada,
            [id]: value,
        }));
    }

    const handleRadioGroupChange = (event) => {
        // Extraer el id y el valor del elemento del formulario/modal que a cambiado
        const { value } = event.target;
        console.log("Tipo de mascota:", value);

        // Si hay una mascota seleccionada (modo edición), actualizar la mascota seleccionada
        setMascotaSeleccionada((prevMascotaSeleccionada) => ({
            ...prevMascotaSeleccionada,
            type: value,
        }));
    }

    const handleSelectChange = (event) => {
        // Extraer el id y el valor del objeto del evento
        const { value } = event.target;
        console.log("Raza de mascota:", value);

        // Si hay una mascota seleccionada (modo edición), actualizar la mascota seleccionada
        setMascotaSeleccionada((prevMascotaSeleccionada) => ({
            ...prevMascotaSeleccionada,
            race: value,
        }));
    };

    const handleNuevo = () => {
        setMascotaSeleccionada({});
        setMostrarModal(true);
    }

    const handleEditar = (mascota) => {
        console.log("Accediendo a Mascota:", mascota);
        setMascotaSeleccionada(mascota); // Guardar la mascota seleccionada
        setMostrarModal(true); // Mostrar el modal
    };

    const handleSave = (mascota) => {
        if (mascota.id) {
            // Aquí es donde enviarías la solicitud PUT o PATCH a tu API para actualizar los detalles de una mascota
            console.log("Actualizando mascota:", mascota);
            actualizarMascota(mascota);
        } else {
            // Aquí es donde enviarías la solicitud POST a tu API para agregar un nuevo mascota
            console.log("Registrando mascota:", mascota);
            registrarMascota(mascota);
        }
        setMostrarModal(false);
    };

    const handleEliminar = async (mascota) => {
        setMascotaSeleccionada(mascota); // Guardar la mascota seleccionado
        setMostrarModalConfirmacion(true); // Mostrar el modal de confirmación
    };

    // Función para confirmar la eliminación de un mascota
    const confirmarEliminacion = () => {
        console.log("Mascota eliminado:", mascotaSeleccionada);
        eliminarMascota(mascotaSeleccionada); // Eliminar el médico seleccionado
        setMostrarModalConfirmacion(false); // Cerrar el modal de confirmación
    };

    const mostrarAlerta = (mensaje) => {
        setAlerta({ visible: true, mensaje });
        setTimeout(() => setAlerta({ visible: false, mensaje: "" }), 3000); // Desaparece después de 3 segundos
    };

    return (
        <div className="flex flex-col justify-start min-h-[calc(100vh-5rem)] w-4/5 mx-auto mt-8">
            <h1 className="text-slate-200 font-bold text-4xl mb-4">Mascotas</h1>

            <div className="flex justify-end items-center mb-4">
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        onClick={handleNuevo}
                        endContent={<PlusIcon />}>
                        Nueva Mascota
                    </Button>
                </div>
            </div>

            <div className="flex justify-center items-center w-full">
                <div className="flex flex-col gap-4 w-full">

                    <Table
                        selectionMode="none"
                        aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>NOMBRE</TableColumn>
                            <TableColumn>TIPO</TableColumn>
                            <TableColumn>RAZA</TableColumn>
                            <TableColumn>PROPIETARIO</TableColumn>
                            <TableColumn>COLOR</TableColumn>
                            <TableColumn>EDAD (AÑOS)</TableColumn>
                            <TableColumn>ACCIONES</TableColumn>
                        </TableHeader>

                        <TableBody>
                            {mascotas.map((mascota) => (
                                <TableRow key={mascota.id}>
                                    <TableCell>{mascota.name}</TableCell>
                                    <TableCell>{mascota.type}</TableCell>
                                    <TableCell>{mascota.race}</TableCell>
                                    <TableCell>{mascota.property}</TableCell>
                                    <TableCell>{mascota.color}</TableCell>
                                    <TableCell>{mascota.age}</TableCell>

                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Tooltip
                                                content="Editar Mascota">

                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                    onClick={() => handleEditar(mascota)}>
                                                    <EditIcon />
                                                </span>
                                            </Tooltip>
                                            <Tooltip
                                                content="Eliminar Mascota">

                                                <span className="text-lg text-danger cursor-pointer active:opacity-50"
                                                    onClick={() => handleEliminar(mascota)}>
                                                    <DeleteIcon />
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* MODAL DE INGRESO */}
            <Modal
                isOpen={mostrarModal}
                onOpenChange={setMostrarModal}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {mascotaSeleccionada.id ? 'Editar Mascota' : 'Nuevo Mascota'}
                            </ModalHeader>

                            <ModalBody>
                                <Input
                                    isRequired
                                    label="Nombre"
                                    value={mascotaSeleccionada ? mascotaSeleccionada.name : ''}
                                    onChange={(e) => handleInputChange({ target: { id: 'name', value: e.target.value } })}
                                />

                                <RadioGroup
                                    isRequired
                                    label="Tipo"
                                    orientation="horizontal"
                                    value={mascotaSeleccionada ? mascotaSeleccionada.type : ''}
                                    onChange={(e) => handleRadioGroupChange({ target: { id: 'type', value: e.target.value } })}>

                                    <Radio value="Canina">Canina</Radio>
                                    <Radio value="Felina">Felina</Radio>
                                </RadioGroup>

                                <Select
                                    isRequired
                                    label="Raza"
                                    value={mascotaSeleccionada ? mascotaSeleccionada.race : ''}
                                    onChange={(e) => handleSelectChange({ target: { id: 'race', value: e.target.value } })}
                                >
                                    {mascotaSeleccionada && mascotaSeleccionada.type &&
                                        (mascotaSeleccionada.type === "Canina" ? razasPerro : razasGato).map((raza) => (
                                            <SelectItem key={raza.value} value={raza.value}>
                                                {raza.label}
                                            </SelectItem>
                                        ))
                                    }
                                </Select>

                                <Input
                                    isRequired
                                    label="Propietario"
                                    value={mascotaSeleccionada ? mascotaSeleccionada.property : ''}
                                    onChange={(e) => handleInputChange({ target: { id: 'property', value: e.target.value } })}
                                />

                                <Input
                                    isRequired
                                    label="Color"
                                    value={mascotaSeleccionada ? mascotaSeleccionada.color : ''}
                                    onChange={(e) => handleInputChange({ target: { id: 'color', value: e.target.value } })}
                                />

                                <Slider
                                    isRequired
                                    label="Edad"
                                    min={1}
                                    max={20}
                                    step={1}
                                    value={mascotaSeleccionada ? mascotaSeleccionada.age : 1}
                                    onChange={(value) => handleInputChange({ target: { id: 'age', value: value[0] } })}
                                />
                            </ModalBody>

                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => { handleSave(mascotaSeleccionada); onClose(); }}>
                                    {mascotaSeleccionada ? 'Guardar' : 'Agregar'}
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
                    <ModalBody>¿Estás seguro de que quieres eliminar a esta mascota?</ModalBody>
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
        </div>

    );
}