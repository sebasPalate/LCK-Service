import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, RadioGroup, Radio } from "@nextui-org/react";

export function MedicosTable({ medicos }) {
    return (
        <Table selectionMode="single" aria-label="Tabla de Médicos">
            <TableHeader>
                <TableColumn>USUARIO</TableColumn>
                <TableColumn>NOMBRE</TableColumn>
                <TableColumn>APELLIDO</TableColumn>
                <TableColumn>CORREO</TableColumn>
            </TableHeader>
            <TableBody>
                {medicos.map((medico) => (
                    <TableRow key={medico.id}>
                        <TableCell>{medico.username}</TableCell>
                        <TableCell>{medico.firstname}</TableCell>
                        <TableCell>{medico.lastname}</TableCell>
                        <TableCell>{medico.email}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}