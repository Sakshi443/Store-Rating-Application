
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, Building, Store, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/Card';
import { motion } from 'framer-motion';
import { validateName, validateAddress, validateEmail, validatePassword } from '../lib/validation';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [role] = useState('Normal User');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const nameError = validateName(name);
            if (nameError) throw new Error(nameError);

            const emailError = validateEmail(email);
            if (emailError) throw new Error(emailError);

            const addressError = validateAddress(address);
            if (addressError) throw new Error(addressError);

            const passwordError = validatePassword(password);
            if (passwordError) throw new Error(passwordError);
            await signup(email, password, role, name, address);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
            <div className="grid w-full lg:grid-cols-2">
                {/* Left Panel - Visual */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-slate-100/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-600/5" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(79,70,229,0.1),transparent_50%)]" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative z-10 text-center p-10 max-w-xl"
                    >
                        <div className="mb-8 flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/20">
                                <Store className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <h2 className="mb-6 text-3xl font-bold text-slate-900">Join Our Platform</h2>
                        <p className="text-lg text-slate-600">
                            Create an account to start your journey. Whether you're a shopper, a store owner, or an administrator, we have the tools you need.
                        </p>
                    </motion.div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex items-center justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md space-y-8"
                    >
                        <div className="text-center lg:text-left">
                            <Link to="/" className="lg:hidden inline-flex items-center gap-2 mb-8 text-slate-900 font-bold text-xl">
                                <Store className="h-6 w-6 text-blue-600" />
                                StoreRate
                            </Link>

                            <Link to="/" className="hidden lg:inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
                                Create Account
                            </h1>
                            <p className="mt-2 text-slate-500">
                                Get started with your free account today.
                            </p>
                        </div>

                        <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/50">
                            <form onSubmit={handleSubmit}>
                                <CardHeader>
                                    <CardTitle>Sign Up</CardTitle>
                                    <CardDescription>
                                        Fill in your details to register
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100"
                                        >
                                            <AlertCircle size={16} />
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            icon={User}
                                            required
                                            className="bg-slate-50 border-slate-200 focus:bg-white text-slate-900"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email</label>
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            icon={Mail}
                                            required
                                            className="bg-slate-50 border-slate-200 focus:bg-white text-slate-900"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Address</label>
                                        <Input
                                            type="text"
                                            placeholder="123 Main St"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            icon={Building}
                                            required
                                            className="bg-slate-50 border-slate-200 focus:bg-white text-slate-900"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Password</label>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            icon={Lock}
                                            required
                                            className="bg-slate-50 border-slate-200 focus:bg-white text-slate-900"
                                        />
                                    </div>

                                    {/* Role selection is hidden/fixed to Normal User */}
                                </CardContent>

                                <CardFooter className="flex flex-col gap-4">
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" isLoading={loading}>
                                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>

                                    <p className="text-center text-sm text-slate-500">
                                        Already have an account?{' '}
                                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
                                            Sign in
                                        </Link>
                                    </p>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
