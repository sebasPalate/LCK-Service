"use client";
import React, { useState } from "react";
import { EditIcon } from "../../../components/icons/EditIcon";
import { DeleteIcon } from "../../../components/icons/DeleteIcon";
import { PlusIcon } from "../../../components/icons/PlusIcon"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Input } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";


export default function MedicosPage() {
    // Datos de médicos
    const [medicos, setMedicos] = React.useState([]);

    // Médico seleccionado
    const [medicoSeleccionado, setMedicoSeleccionado] = React.useState(null);

    // Mostrar Modal
    const [mostrarModal, setMostrarModal] = useState(false);

    // Estado para controlar la visibilidad del modal de confirmación
    const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);

    // Estado para controlar el mensaje de alerta
    const [alerta, setAlerta] = useState({ visible: false, mensaje: "" });



    /* METODOS DE API */
    const obtenerMedicos = async () => {
        try {
            const response = await fetch('/api/medicos');
            const data = await response.json();
            setMedicos(data);
        } catch (error) {
            console.error('Error al obtener datos de médicos:', error);
        }
    };

    const registrarMedico = async (medico) => {
        try {
            const response = await fetch('/api/medicos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(medico),
            });

            if (!response.ok) {
                throw new Error('Error al Registrar un Médico');
            }

            mostrarAlerta("Médico registrado correctamente");
            obtenerMedicos();
        } catch (error) {
            console.log('Error al registrar un médico:', error);

        }
    };

    const actualizarMedico = async (medico) => {
        try {
            const response = await fetch(`/api/medicos/${medico.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(medico),
            });

            if (!response.ok) {
                throw new Error('Error al Actualizar un Médico');
            }
            mostrarAlerta("Médico actualizado correctamente");
            obtenerMedicos();
        } catch (error) {
            console.log('Error al actualizar un médico:', error);

        }
    };

    const eliminarMedico = async (medico) => {
        try {
            const response = await fetch(`/api/medicos/${medico.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al Eliminar un Médico');
            }
            mostrarAlerta("Médico eliminado correctamente");
            obtenerMedicos();
        } catch (error) {
            console.log('Error al eliminar un médico:', error);

        }
    };

    React.useEffect(() => {
        obtenerMedicos();
    }, []);


    const handleInputChange = (event) => {
        // Extraer el id y el valor del elemento del formulario/modal que a cambiado
        const { id, value } = event.target;

        if (medicoSeleccionado) {
            // Si hay un medico seleccionado (modo edicion), actualizar el medico seleccionado
            setMedicoSeleccionado((prevMedicoSeleccionado) => ({
                ...prevMedicoSeleccionado,
                [id]: value,
            }));
        } else {
            // Si no hay un medico seleccionado (modo creacion), actualizar el formData con el nuevo valor de campo
            setFormData((prevFormData) => ({
                ...prevFormData,
                [id]: value,
            }));
        }
    }

    const handleNuevo = () => {
        setMedicoSeleccionado({});
        setMostrarModal(true);
    }

    const handleEditar = (medico) => {
        console.log("Accediendo a Médico:", medico);
        setMedicoSeleccionado(medico); // Guardar el médico seleccionado
        setMostrarModal(true); // Mostrar el modal
    };

    const handleSave = (medico) => {
        if (medicoSeleccionado.id) {
            // Aquí es donde enviarías la solicitud PUT o PATCH a tu API para actualizar los detalles del médico
            actualizarMedico(medico);
        } else {
            // Aquí es donde enviarías la solicitud POST a tu API para agregar un nuevo médico
            registrarMedico(medico);
        }
        setMostrarModal(false);
    };

    const handleEliminar = async (medico) => {
        setMedicoSeleccionado(medico); // Guardar el médico seleccionado
        setMostrarModalConfirmacion(true); // Mostrar el modal de confirmación
    };

    // Función para confirmar la eliminación de un médico
    const confirmarEliminacion = () => {
        console.log("Médico eliminado:", medicoSeleccionado);
        eliminarMedico(medicoSeleccionado); // Eliminar el médico seleccionado
        setMostrarModalConfirmacion(false); // Cerrar el modal de confirmación
    };

    const mostrarAlerta = (mensaje) => {
        setAlerta({ visible: true, mensaje });
        setTimeout(() => setAlerta({ visible: false, mensaje: "" }), 3000); // Desaparece después de 3 segundos
    };

    return (
        <div className="flex flex-col justify-start min-h-[calc(100vh-5rem)] w-4/5 mx-auto mt-8">
            <h1 className="text-slate-200 font-bold text-4xl mb-4">Médicos</h1>

            <div className="flex justify-end items-center mb-4">
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        onClick={handleNuevo}
                        endContent={<PlusIcon />}
                    >
                        Nuevo Médico
                    </Button>
                </div>
            </div>

            <div className="flex justify-center items-center w-full">
                <div className="flex flex-col gap-4 w-full">

                    <Table
                        selectionMode="none"
                        aria-label="Example static collection table"
                    >
                        <TableHeader>
                            <TableColumn>USUARIO</TableColumn>
                            <TableColumn>NOMBRE</TableColumn>
                            <TableColumn>APELLIDO</TableColumn>
                            <TableColumn>CORREO</TableColumn>
                            <TableColumn>ACCIONES</TableColumn>
                        </TableHeader>

                        
                        <TableBody>
                            {
                                medicos.map((medico) => (
                                    <TableRow key={medico.id}>
                                        <TableCell>{medico.username}</TableCell>
                                        <TableCell>{medico.firstname}</TableCell>
                                        <TableCell>{medico.lastname}</TableCell>
                                        <TableCell>{medico.email}</TableCell>

                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Tooltip
                                                    content="Editar médico">

                                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                        onClick={() => handleEditar(medico)}>
                                                        <EditIcon />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip
                                                    content="Eliminar médico">

                                                    <span className="text-lg text-danger cursor-pointer active:opacity-50"
                                                        onClick={() => handleEliminar(medico)}>
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
                            <ModalHeader className="flex flex-col gap-1">{medicoSeleccionado.id ? 'Editar Médico' : 'Nuevo Médico'}</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Usuario"
                                    //value={medicoSeleccionado?.username}
                                    value={medicoSeleccionado ? medicoSeleccionado.username : ''}
                                    onChange={(e) => handleInputChange({ target: { id: 'username', value: e.target.value } })}
                                />

                                <Input
                                    label="Nombre"
                                    value={medicoSeleccionado ? medicoSeleccionado.firstname : ''}
                                    onChange={(e) => handleInputChange({ target: { id: 'firstname', value: e.target.value } })}
                                />

                                <Input
                                    label="Apellido"
                                    value={medicoSeleccionado ? medicoSeleccionado.lastname : ''}
                                    onChange={(e) => handleInputChange({ target: { id: 'lastname', value: e.target.value } })}
                                />

                                <Input
                                    label="Correo"
                                    value={medicoSeleccionado ? medicoSeleccionado.email : ''}
                                    onChange={(e) => handleInputChange({ target: { id: 'email', value: e.target.value } })}
                                />

                                <Input
                                    label="Contraseña"
                                    type="password"
                                    value={medicoSeleccionado ? medicoSeleccionado.password : ''}
                                    onChange={(e) => handleInputChange({ target: { id: 'password', value: e.target.value } })}
                                />

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={() => { handleSave(medicoSeleccionado); onClose(); }}>
                                    {medicoSeleccionado ? 'Guardar' : 'Agregar'}
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
                    <ModalBody>¿Estás seguro de que quieres eliminar a este médico?</ModalBody>
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