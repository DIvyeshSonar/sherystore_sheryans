import { useEffect, useState } from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { getMe } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setProfile(data.data.user);
      } catch {
        setProfile(authUser); // Fall back to context user
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authUser]);

  if (loading) {
    return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  }

  const user = profile || authUser;

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-main-text mb-1">Profile</h2>
        <p className="text-secondary-text text-sm">Your account information.</p>
      </div>

      <div className="card overflow-hidden">
        {/* Avatar header */}
        <div className="bg-gradient-to-r from-primary to-secondary px-8 py-10 text-white text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 text-3xl font-bold uppercase">
            {user?.name?.charAt(0)}
          </div>
          <h3 className="text-xl font-bold">{user?.name}</h3>
          <p className="text-white/70 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Info fields */}
        <div className="divide-y divide-border">
          <ProfileField icon={User} label="Full Name" value={user?.name} />
          <ProfileField icon={Mail} label="Email Address" value={user?.email} />
          <ProfileField
            icon={Calendar}
            label="Member Since"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })
                : '—'
            }
          />
          <ProfileField
            icon={Shield}
            label="Account Status"
            value={
              <span className="badge-success">Active</span>
            }
          />
        </div>

        {/* Security note */}
        <div className="px-6 py-4 bg-background border-t border-border">
          <p className="text-xs text-secondary-text">
            <Shield size={12} className="inline mr-1" />
            Your password and tokens are never displayed here for security reasons.
          </p>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 px-6 py-4">
    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon size={16} className="text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-secondary-text mb-0.5">{label}</p>
      <div className="text-sm font-medium text-main-text">{value}</div>
    </div>
  </div>
);

export default ProfilePage;
