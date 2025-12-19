import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { motion } from 'framer-motion';
import { validatePassword, validateName, validateEmail } from '../lib/validation';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Normal User');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const nameError = validateName(name);
        if (nameError) {
            setError(nameError);
            setLoading(false);
            return;
        }

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            setLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        try {
            await signup(email, password, role, name);
            navigate('/dashboard');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-white text-black font-sans selection:bg-[#FFDA1A] selection:text-black">
            <div className="grid w-full lg:grid-cols-2 min-h-screen">
                {/* Left Panel - Visual */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-[#111] relative overflow-hidden order-last lg:order-first">
                    <div className="absolute inset-0 bg-[#111]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFDA1A]/10 rounded-full blur-[120px]" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10 text-center p-12 max-w-lg"
                    >
                        <div className="h-24 w-24 bg-white rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-white/10 transform -rotate-6 hover:rotate-0 transition-all duration-500">
                            <span className="text-4xl font-black text-black">SR</span>
                        </div>
                        <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Join the Community.</h2>
                        <p className="text-lg text-gray-400 leading-relaxed font-medium">
                            Create an account to start rating stores, sharing reviews, and managing your own business profile.
                        </p>
                    </motion.div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-24 relative bg-white">
                    <Link to="/" className="absolute top-8 left-8 lg:left-12 inline-flex items-center text-sm font-bold text-gray-400 hover:text-black transition-colors gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
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
                                Create account.
                            </h1>
                            <p className="text-gray-500 font-medium">
                                Get started with your free account today.
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
                                    <label className="text-sm font-bold text-gray-900">Name</label>
                                    <Input
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        icon={User}
                                        required
                                        className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black transition-all h-12"
                                    />
                                </div>

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
                                    <label className="text-sm font-bold text-gray-900">Password</label>
                                    <Input
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        icon={Lock}
                                        required
                                        className="bg-gray-50 border-gray-200 focus:bg-white focus:border-black transition-all h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-900">I want to...</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setRole('Normal User')}
                                            className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${role === 'Normal User'
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            Rate Stores
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole('Store Owner')}
                                            className={`p-3 rounded-lg border-2 text-sm font-bold transition-all ${role === 'Store Owner'
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
                                                }`}
                                        >
                                            Manage Store
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#FFDA1A] hover:bg-[#e6c417] text-black font-bold h-12 text-base shadow-lg shadow-[#FFDA1A]/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-full"
                                isLoading={loading}
                            >
                                Get Started <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2.5} />
                            </Button>

                            <p className="text-center text-sm font-medium text-gray-500">
                                Already have an account?{' '}
                                <Link to="/login" className="font-bold text-black hover:underline decoration-2 underline-offset-4">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
