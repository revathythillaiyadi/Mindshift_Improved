import { useState } from 'react';
import { Brain, Mail, Lock, AlertCircle, CheckCircle, User, Phone, MapPin, Shield, Check, Users, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, UserProfile } from '../contexts/AuthContext';
import TreeRing from '../components/TreeRing';

const REGIONS = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Japan',
  'South Korea',
  'India',
  'Brazil',
  'Mexico',
  'Other',
];

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [breachedPasswordError, setBreachedPasswordError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    region: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signUpWithProfile } = useAuth();

  const updateFormData = (field: keyof UserProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    setBreachedPasswordError(false);
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain uppercase, lowercase, and a number.');
      return false;
    }
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.phoneNumber.trim()) {
      setError('Please enter your phone number.');
      return false;
    }
    if (!formData.region) {
      setError('Please select your region.');
      return false;
    }
    if (!formData.emergencyContactName.trim()) {
      setError('Please enter an emergency contact name.');
      return false;
    }
    if (!formData.emergencyContactPhone.trim()) {
      setError('Please enter an emergency contact phone number.');
      return false;
    }
    if (!formData.emergencyContactRelationship) {
      setError('Please select your relationship with the emergency contact.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    setBreachedPasswordError(false);
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    setError('');
    setBreachedPasswordError(false);

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    const { error } = await signUpWithProfile(formData);

    if (error) {
      const errorMessage = error.message || '';
      if (errorMessage.toLowerCase().includes('password') &&
          (errorMessage.toLowerCase().includes('breach') ||
           errorMessage.toLowerCase().includes('leaked') ||
           errorMessage.toLowerCase().includes('compromised') ||
           errorMessage.toLowerCase().includes('pwned'))) {
        setBreachedPasswordError(true);
        setStep(1);
      } else {
        setError(errorMessage || 'Failed to create account. Please try again.');
      }
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return null;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength <= 3) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-teal-500', width: '100%' };
  };

  const passwordStrength = getPasswordStrength();

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-mint-50/20 via-warm-white to-sage-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <TreeRing
            ringCount={7}
            className="absolute top-10 -left-5 w-[250px] h-[250px] opacity-25"
          />
          <TreeRing
            ringCount={5}
            className="absolute -bottom-5 -right-5 w-[200px] h-[200px] opacity-25"
          />
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 border border-sage-100/50 dark:border-gray-700 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-mint-500 to-sage-500 rounded-[1.5rem] flex items-center justify-center shadow-lg">
                <CheckCircle className="w-9 h-9 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-forest dark:text-blue-100 mb-4">
              Welcome to MindShift!
            </h2>
            <p className="text-soft-gray dark:text-blue-300 mb-8">
              Your account has been created successfully. You can now log in and start your journey to mental wellness.
            </p>

            <Link
              to="/login"
              className="inline-block w-full py-3 bg-gradient-to-r from-sage-500 to-mint-500 hover:from-sage-600 hover:to-mint-600 text-white font-semibold rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-mint-50/20 via-warm-white to-sage-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <TreeRing
          ringCount={9}
          className="absolute top-10 -right-10 w-[280px] h-[280px] opacity-20"
        />
        <TreeRing
          ringCount={7}
          className="absolute bottom-20 -left-10 w-[240px] h-[240px] opacity-20"
        />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-8 border border-sage-100/50 dark:border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-mint-500 rounded-[1.5rem] flex items-center justify-center shadow-lg">
              <Brain className="w-9 h-9 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-forest dark:text-blue-100 text-center mb-2">
            Join MindShift
          </h2>
          <p className="text-soft-gray dark:text-blue-300 text-center mb-8">
            Start your journey to mental wellness
          </p>

          <div className="flex items-center justify-between mb-8 px-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= num
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-sage-400'
                  }`}
                >
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                {num < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 transition-all ${
                      step > num ? 'bg-blue-600' : 'bg-blue-100 dark:bg-gray-700'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[1.5rem] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-forest dark:text-blue-100 mb-4">
                Core Credentials
              </h3>

              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-blue-900 dark:text-white placeholder-gentle-gray dark:placeholder-gray-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-blue-900 dark:text-white placeholder-gentle-gray dark:placeholder-gray-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-blue-900 dark:text-white placeholder-gentle-gray dark:placeholder-gray-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {breachedPasswordError && (
                  <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 dark:border-orange-600 rounded-lg flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 text-lg leading-none mt-0.5">⚠️</span>
                    <p className="text-orange-800 dark:text-orange-200 text-sm font-medium leading-relaxed">
                      This password has been found in public data breaches and cannot be used for your security. Please choose a strong, unique password.
                    </p>
                  </div>
                )}
                {passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-blue-600 dark:text-sage-400">
                        Password Strength: {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-blue-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: passwordStrength.width }}
                      ></div>
                    </div>
                  </div>
                )}
                <p className="mt-2 text-xs text-blue-600 dark:text-sage-400">
                  Must be at least 8 characters with uppercase, lowercase, and a number
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-blue-900 dark:text-white placeholder-gentle-gray dark:placeholder-gray-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={breachedPasswordError}
                className="w-full py-3 bg-gradient-to-r from-sage-500 to-mint-500 hover:from-sage-600 hover:to-mint-600 text-white font-semibold rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-forest dark:text-blue-100 mb-4">
                Contact & Safety Details
              </h3>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full pl-12 pr-4 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-blue-900 dark:text-white placeholder-gentle-gray dark:placeholder-gray-400 transition-all"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-blue-600 dark:text-sage-400">
                  For account recovery and security verification
                </p>
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                  Region
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400 pointer-events-none z-10" />
                  <select
                    id="region"
                    value={formData.region}
                    onChange={(e) => updateFormData('region', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-blue-900 dark:text-white appearance-none transition-all"
                    required
                  >
                    <option value="">Select your region</option>
                    {REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-gray-700/50 p-5 rounded-[1.5rem] border border-sage-200 dark:border-gray-600">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-sage-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-forest dark:text-blue-100 mb-2">
                      Emergency Contact
                    </h4>
                    <p className="text-sm text-soft-gray dark:text-blue-300 leading-relaxed">
                      For your safety, this contact is only used by our SOS service in critical emergencies.
                      We monitor conversations for crisis keywords like "suicidal" and may reach out to your
                      emergency contact if immediate help is needed.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="emergencyContactName" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                      Emergency Contact Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                      <input
                        id="emergencyContactName"
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => updateFormData('emergencyContactName', e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full pl-12 pr-4 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-blue-900 dark:text-white placeholder-gentle-gray dark:placeholder-gray-400 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="emergencyContactPhone" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                      Emergency Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400" />
                      <input
                        id="emergencyContactPhone"
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => updateFormData('emergencyContactPhone', e.target.value)}
                        placeholder="+1 (555) 987-6543"
                        className="w-full pl-12 pr-4 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-blue-900 dark:text-white placeholder-gentle-gray dark:placeholder-gray-400 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="emergencyContactRelationship" className="block text-sm font-semibold text-forest dark:text-blue-100 mb-2">
                      Relationship
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-400 pointer-events-none z-10" />
                      <select
                        id="emergencyContactRelationship"
                        value={formData.emergencyContactRelationship}
                        onChange={(e) => updateFormData('emergencyContactRelationship', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-sage-200 dark:border-gray-600 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-blue-900 dark:text-white appearance-none transition-all"
                        required
                      >
                        <option value="">Select relationship</option>
                        <option value="Parent">Parent</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Partner">Partner</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Child">Child</option>
                        <option value="Friend">Friend</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Relative">Relative</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 text-forest dark:text-blue-100 font-semibold rounded-[1.5rem] transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 bg-gradient-to-r from-sage-500 to-mint-500 hover:from-sage-600 hover:to-mint-600 text-white font-semibold rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-forest dark:text-blue-100 mb-4">
                Review & Confirm
              </h3>

              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-gray-700/50 p-4 rounded-[1.5rem]">
                  <h4 className="font-semibold text-forest dark:text-blue-100 mb-3">
                    Account Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-soft-gray dark:text-blue-300">Full Name:</span>
                      <span className="font-medium text-forest dark:text-blue-100">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-gray dark:text-blue-300">Email:</span>
                      <span className="font-medium text-forest dark:text-blue-100">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-gray dark:text-blue-300">Phone:</span>
                      <span className="font-medium text-forest dark:text-blue-100">{formData.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-gray dark:text-blue-300">Region:</span>
                      <span className="font-medium text-forest dark:text-blue-100">{formData.region}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 dark:bg-gray-700/50 p-4 rounded-[1.5rem] border border-teal-200 dark:border-gray-600">
                  <h4 className="font-semibold text-forest dark:text-blue-100 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Emergency Contact
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-soft-gray dark:text-blue-300">Name:</span>
                      <span className="font-medium text-forest dark:text-blue-100">{formData.emergencyContactName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-gray dark:text-blue-300">Phone:</span>
                      <span className="font-medium text-forest dark:text-blue-100">{formData.emergencyContactPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft-gray dark:text-blue-300">Relationship:</span>
                      <span className="font-medium text-forest dark:text-blue-100">{formData.emergencyContactRelationship}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-gray-700/50 p-4 rounded-[1.5rem]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-2 border-blue-300 dark:border-gray-500 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-soft-gray dark:text-blue-300">
                    I agree to the{' '}
                    <a href="#" className="text-blue-600 dark:text-sage-400 hover:underline font-semibold">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 dark:text-sage-400 hover:underline font-semibold">
                      Privacy Policy
                    </a>
                    . I understand that my emergency contact will only be used in critical situations.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 text-forest dark:text-blue-100 font-semibold rounded-[1.5rem] transition-all"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !agreedToTerms}
                  className="flex-1 py-3 bg-gradient-to-r from-sage-500 to-mint-500 hover:from-sage-600 hover:to-mint-600 text-white font-semibold rounded-[1.5rem] shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create My MindShift Account'}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center space-y-3">
            <p className="text-soft-gray dark:text-blue-300">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-sage-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                Log In
              </Link>
            </p>
            <p className="text-soft-gray dark:text-blue-300">
              <Link to="/" className="text-blue-600 dark:text-sage-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
