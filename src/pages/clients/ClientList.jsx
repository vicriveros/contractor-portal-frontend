import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { clientsAPI } from '../../services/api';
import Toast from '../../components/common/Toast';

export default function ClientList() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showToast, setShowToast] = useState(false);
    const itemsPerPage = 10;

    // Cargar clientes
    useEffect(() => {
        fetchClients();
    }, []);

    // Debounce de búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Resetear a la página 1 cuando cambia la búsqueda o los datos
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, clients.length]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const data = await clientsAPI.list();
            setClients(data);
            setError('');
        } catch (err) {
            setError('Error al cargar clientes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar cliente
    const handleDelete = async (clientId) => {
        try {
            await clientsAPI.delete(clientId);
            setClients(clients.filter(c => c.id !== clientId));
            setDeleteConfirm(null);
            setShowToast(true);
        } catch (err) {
            setError('Error al eliminar cliente');
            console.error(err);
        }
    };

    // Filtrar clientes
    const filteredClients = clients.filter((client) => {
        const search = debouncedSearchTerm.toLowerCase();
        return (
            (client.company_name?.toLowerCase().includes(search)) ||
            (client.contact_name?.toLowerCase().includes(search)) ||
            (client.contact_email?.toLowerCase().includes(search))
        );
    });

    // Paginación
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-primary uppercase tracking-wide">
                            Clientes
                        </h1>
                        <p className="text-neutral-600 mt-1">
                            Gestiona tus clientes y sus proyectos
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/clients/create')}
                        className="btn-accent flex items-center gap-2"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Nuevo Cliente
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="h-5 w-5 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar clientes por nombre, empresa o email..."
                        className="input-field pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Clients Grid */}
                {clients.length === 0 ? (
                    <div className="card text-center py-12">
                        <svg
                            className="mx-auto h-16 w-16 text-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-semibold text-primary uppercase">
                            No hay clientes
                        </h3>
                        <p className="mt-2 text-neutral-600">
                            Comienza agregando tu primer cliente
                        </p>
                        <button
                            onClick={() => navigate('/clients/create')}
                            className="mt-6 btn-accent inline-flex items-center gap-2"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Crear Primer Cliente
                        </button>
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="card text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-semibold text-primary uppercase">
                            No se encontraron resultados
                        </h3>
                        <p className="mt-2 text-neutral-600">
                            Prueba con otros términos de búsqueda
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-neutral-200">
                                <thead className="bg-primary">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-accent uppercase tracking-wider">
                                            Empresa / Contacto
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-accent uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-accent uppercase tracking-wider">
                                            Teléfono
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-accent uppercase tracking-wider">
                                            Dirección
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-accent uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-neutral-200">
                                    {paginatedClients.map((client) => (
                                        <tr key={client.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-primary uppercase">
                                                        {client.company_name || 'Individual'}
                                                    </span>
                                                    <span className="text-xs text-neutral-600">
                                                        {client.contact_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                {client.contact_email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                {client.contact_phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                <div className="max-w-xs truncate" title={client.address}>
                                                    {client.address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => navigate(`/clients/${client.id}/edit`)}
                                                        className="p-2 text-primary hover:text-accent-dark transition-colors"
                                                        title="Editar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(client.id)}
                                                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination footer */}
                        {totalPages > 1 && (
                            <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
                                <div className="text-sm text-neutral-600">
                                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredClients.length)} de {filteredClients.length} clientes
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-semibold text-primary hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Anterior
                                    </button>
                                    <div className="flex items-center px-4 text-sm font-bold text-primary">
                                        Página {currentPage} de {totalPages}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-semibold text-primary hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-primary uppercase mb-4">
                                Confirmar Eliminación
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                ¿Estás seguro de que deseas eliminar este cliente? Esta acción
                                también eliminará todos sus proyectos y archivos asociados.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold uppercase"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showToast && (
                <Toast 
                    message="Cliente eliminado correctamente" 
                    onClose={() => setShowToast(false)}
                />
            )}
        </DashboardLayout>
    );
}