
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Store, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/Card';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!email || !password) throw new Error("Please fill in all fields.");
            const success = await login(email, password);
            if (success) {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                if (userData.role === 'System Administrator') {
                    navigate('/admin');
                } else if (userData.role === 'Store Owner') {
                    navigate('/owner');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError('Invalid credentials');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white text-black font-sans selection:bg-[#FFDA1A] selection:text-black">
            <div className="grid w-full lg:grid-cols-2 min-h-screen">
                {/* Left Panel - Form */}
                <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-24 relative">
                    <Link to="/" className="absolute top-8 left-8 lg:left-12 inline-flex items-center text-sm font-bold text-gray-400 hover:text-black transition-colors gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-sm mx-auto space-y-8"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-8 w-8 bg-[#0058A3] rounded-full flex items-center justify-center">
                                    <span className="text-[#FFDA1A] font-bold text-lg">S</span>
                                </div>
                                <span className="text-xl font-extrabold tracking-tight">StoreRate.</span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-[#111]">
                                Welcome back.
                            </h1>
                            <p className="text-gray-500 font-medium">
                                Sign in to access your dashboard.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100"
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        icon={Mail}
                                        required
                                        className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black transition-all h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-gray-900">Password</label>
                                        <Link to="#" className="text-xs font-bold text-gray-400 hover:text-black transition-colors">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        icon={Lock}
                                        required
                                        className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black transition-all h-12"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#FFDA1A] hover:bg-[#e6c417] text-black font-bold h-12 text-base shadow-lg shadow-[#FFDA1A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-full"
                                isLoading={loading}
                            >
                                Sign In <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2.5} />
                            </Button>

                            <p className="text-center text-sm font-medium text-gray-500">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-bold text-black hover:underline decoration-2 underline-offset-4">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </motion.div>
                </div>

                {/* Right Panel - Visual */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-[#111] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#111]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0058A3]/20 rounded-full blur-[120px]" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10 text-center p-12 max-w-lg"
                    >
                        <div className="h-24 w-24 bg-[#FFDA1A] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-[#FFDA1A]/20 transform rotate-12 hover:rotate-0 transition-all duration-500">
                            <Store className="h-12 w-12 text-black" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Rate Real. Shop Better.</h2>
                        <p className="text-lg text-gray-400 leading-relaxed font-medium">
                            Join our community to discover top-rated local businesses and share your own experiences.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
