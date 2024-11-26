import { useAuth } from '@/hooks/useAuth';
import { Camera, Mail, User } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useFetcher } from 'react-router-dom';
import { updateProfile } from './actions/profileAction';

function ProfilePage() {
  const auth = useAuth().auth;

  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);

  const fetcher = useFetcher({
    key: 'profile',
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const file = files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5 MB limit
      toast.error('File size exceeds 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      await updateProfile(formData);
    } catch (error) {
      console.error(error);
      toast.error('Error updating profile');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={(selectedImage as string) || auth?.avatar || '/avatar.png'}
                alt="avatar"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 hover:scale-105 bg-base-content p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  fetcher.state !== 'idle'
                    ? 'animate-pulse pointer-events-none'
                    : ''
                }`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={fetcher.state !== 'idle'}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {fetcher.state !== 'idle'
                ? 'Uploading...'
                : 'Click the camera icon to update your avatar'}
            </p>
          </div>
          {/* Avatar upload */}

          {/* Profile details */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {auth?.username}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {auth?.email}
              </p>
            </div>
          </div>
          {/* Profile details */}

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {auth?.created_At
                    ? new Date(auth.created_At).toISOString().split('T')[0]
                    : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
