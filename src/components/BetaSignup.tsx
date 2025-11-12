import { useState, useEffect } from 'react';

interface FormData {
  fullName: string;
  email: string;
  reason: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  reason?: string;
}

export default function BetaSignup() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    reason: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [alreadySignedUp, setAlreadySignedUp] = useState(false);

  useEffect(() => {
    const signedUp = localStorage.getItem('mindshift-beta-signup');
    if (signedUp) {
      setAlreadySignedUp(true);
    }
  }, []);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return undefined;
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email';
        return undefined;
      case 'reason':
        if (!value) return 'Please select a reason';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field as keyof FormData]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const isFormValid = () => {
    const nameError = validateField('fullName', formData.fullName);
    const emailError = validateField('email', formData.email);
    const reasonError = validateField('reason', formData.reason);
    return !nameError && !emailError && !reasonError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = {
      fullName: true,
      email: true,
      reason: true,
    };
    setTouched(allTouched);

    const newErrors: FormErrors = {
      fullName: validateField('fullName', formData.fullName),
      email: validateField('email', formData.email),
      reason: validateField('reason', formData.reason),
    };
    setErrors(newErrors);

    if (!isFormValid()) return;

    console.log('Form submitted:', formData);
    localStorage.setItem('mindshift-beta-signup', JSON.stringify(formData));

    setIsSubmitted(true);
    setShowConfetti(true);

    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleReturnHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (alreadySignedUp && !isSubmitted) {
    return (
      <section id="beta-signup" className="py-20 bg-sage-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl p-8 md:p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-3xl font-bold text-sage-700 dark:text-white mb-3">
              Already Signed Up!
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              You're already on our waitlist. We'll be in touch soon!
            </p>
            <button
              onClick={handleReturnHome}
              className="px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-full transition-all"
            >
              Return Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="beta-signup" className="py-20 bg-sage-50 dark:bg-gray-900 relative overflow-hidden">
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="confetti" style={{ left: `${Math.random() * 100}%` }} />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-sage-700 dark:text-white mb-4">
            Join the MindShift Beta
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Be among the first to experience AI-powered mental wellness
          </p>
        </div>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl p-8 md:p-12 animate-fade-in"
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('fullName')}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                    touched.fullName && errors.fullName
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-sage-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/20`}
                  aria-label="Full Name"
                  aria-required="true"
                />
                {touched.fullName && errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                    touched.email && errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-sage-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/20`}
                  aria-label="Email"
                  aria-required="true"
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  What brings you to MindShift? *
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  onBlur={() => handleBlur('reason')}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                    touched.reason && errors.reason
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:border-sage-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/20`}
                  aria-label="Reason for joining"
                  aria-required="true"
                >
                  <option value="">Select an option</option>
                  <option value="anxiety">Managing anxiety</option>
                  <option value="depression">Dealing with depression</option>
                  <option value="stress">Stress management</option>
                  <option value="growth">Personal growth</option>
                  <option value="other">Other</option>
                </select>
                {touched.reason && errors.reason && (
                  <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Tell us more (optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={200}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-sage-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-500/20 resize-none"
                  aria-label="Additional message"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-right">
                  {formData.message.length}/200
                </p>
              </div>

              <button
                type="submit"
                disabled={!isFormValid()}
                className={`w-full py-4 rounded-full font-semibold text-white transition-all shadow-lg ${
                  isFormValid()
                    ? 'bg-sage-600 hover:bg-sage-700 hover:shadow-xl transform hover:scale-105 cursor-pointer'
                    : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
                }`}
              >
                Join the Waitlist
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl p-8 md:p-12 text-center animate-fade-in">
            <div className="mb-6 inline-block">
              <div className="checkmark-circle">
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark-circle-path" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-sage-700 dark:text-white mb-3">
              Welcome to MindShift! 🎉
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              We'll be in touch soon.
            </p>
            <p className="text-base text-gray-500 dark:text-gray-400 mb-8">
              Check your email for next steps.
            </p>
            <button
              onClick={handleReturnHome}
              className="px-8 py-3 bg-sage-600 hover:bg-sage-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              Return Home
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
