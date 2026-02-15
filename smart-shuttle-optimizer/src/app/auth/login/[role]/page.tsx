'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Props {
    params: Promise<{
        role: string;
    }>;
}

export default function RoleLoginPage(props: Props) {
    const params = use(props.params);
    const router = useRouter();

    // Config with static classes to ensure Tailwind compatibility
    const roleConfig = {
        rider: {
            title: 'Student Login',
            iconBg: 'bg-blue-600',
            buttonStyle: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            linkText: 'text-blue-600 hover:text-blue-500'
        },
        driver: {
            title: 'Driver Login',
            iconBg: 'bg-orange-600',
            buttonStyle: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
            linkText: 'text-orange-600 hover:text-orange-500'
        },
        admin: {
            title: 'QAdmin Login',
            iconBg: 'bg-red-600',
            buttonStyle: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            linkText: 'text-red-600 hover:text-red-500'
        }
    };

    const currentRole = (roleConfig[params.role as keyof typeof roleConfig] || roleConfig.rider);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Sending login request...', formData);
            const res = await api.post('/auth/login', { ...formData });
            console.log('Login response:', res.data);
            const { token, role } = res.data;

            // Allow login only if roles match or if it's a super-user/admin situation (optional logic)
            if (role !== params.role && role !== 'admin') {
                setError(`This account is not registered as a ${params.role}.`);
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // Set cookie for middleware
            document.cookie = `token=${token}; path=/; max-age=432000; SameSite=Lax`;

            console.log('Redirecting to dashboard for role:', role);
            if (role === 'admin') router.push('/admin');
            else if (role === 'driver') router.push('/driver');
            else router.push('/rider');

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.msg || 'Login failed. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                <Link href="/" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Role Selection
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className={`${currentRole.iconBg} p-3 rounded-full`}>
                        <Lock className="text-white w-8 h-8" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {currentRole.title}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Secure access for {params.role}s.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${currentRole.buttonStyle}`}
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don&apos;t have a {params.role} account?{' '}
                            <Link href={`/auth/signup/${params.role}`} className={`font-medium ${currentRole.linkText}`}>
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
