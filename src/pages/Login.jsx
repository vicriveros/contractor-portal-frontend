import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');

        const result = await login(data.username, data.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center">
                    <div className="inline-block bg-white p-6 rounded-2xl shadow-2xl mb-6">
                        <img
                            src="https://www.hormetal.com/wp-content/uploads/2025/03/logo.png"
                            alt="Hormetal Logo"
                            className="h-12 w-auto"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wide">
                        Portal de Proyectos
                    </h1>
                    <p className="text-secondary text-sm">
                        Seguimiento de proyectos y actualizaciones
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-primary mb-6 uppercase tracking-wide">
                        Iniciar Sesión
                    </h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide"
                            >
                                Usuario
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="input-field"
                                placeholder="Ingrese su usuario"
                                {...register('username', {
                                    required: 'Usuario es requerido',
                                })}
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-neutral-700 mb-2 uppercase tracking-wide"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="input-field"
                                placeholder="Ingrese su contraseña"
                                {...register('password', {
                                    required: 'Contraseña es requerida',
                                })}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-neutral-300 text-accent focus:ring-accent"
                                />
                                <span className="ml-2 text-sm text-neutral-600">
                                    Recordame
                                </span>
                            </label>

                            <a
                                href="#"
                                className="ext-sm text-primary hover:text-accent font-medium"
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-accent"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Iniciando sesión...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-600">
                            ¿No tienes una cuenta?{' '}
                            <a
                                href="/register"
                                className="font-semibold text-primary hover:text-accent uppercase tracking-wide"
                            >
                                Contacta a tu contratista
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-secondary">
                    © 2026 Hormetal. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}