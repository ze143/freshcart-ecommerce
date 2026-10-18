import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', rePassword: '', phone: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'Min 3 characters').required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
      rePassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
      phone: Yup.string().matches(/^01[0-9]{9}$/, 'Invalid Egyptian phone').required('Phone is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await register(values.name, values.email, values.password, values.rePassword, values.phone);
        if (res.success) {
          toast.success('Account created!');
          navigate('/');
        } else {
          toast.error(res.message || 'Registration failed');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h1>

        {['name', 'email', 'password', 'rePassword', 'phone'].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field === 'rePassword' ? 'Confirm Password' : field}
            </label>
            <input
              name={field}
              type={field.includes('assword') ? 'password' : field === 'email' ? 'email' : 'text'}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              value={formik.values[field]}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {formik.touched[field] && formik.errors[field] && (
              <p className="text-red-500 text-xs mt-1">{formik.errors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit" disabled={formik.isSubmitting}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
        >
          {formik.isSubmitting ? 'Creating...' : 'Register'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-primary font-medium">Sign In</Link>
        </p>
      </form>
    </div>
  );
}