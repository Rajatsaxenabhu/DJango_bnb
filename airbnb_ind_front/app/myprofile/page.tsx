'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";

interface ProfileFormData {
  name: string;
  avatar?: File; // Optional
  pk: string;
}

const createFormData = (data: ProfileFormData): FormData => {
  const formData = new FormData();
  
  formData.append('name', data.name);
  
  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }
  
  formData.append('pk', data.pk);

  return formData;
};

const UserProfile = () => {
  const [name, setName] = useState('');
  const [avatar, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [userid, setUserid] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = await getUserId();
        setUserid(userId);
        const response = await apiService.get(`/api/auth/${userId}`);
        console.log(response.avatar)
        setName(response.name);
        setPreview(response.avatar_url || '/logo.png'); // Set preview URL
      } catch (err) {
        setError('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (avatar) {
      setPreview(URL.createObjectURL(avatar));
    } else {
      setPreview(null);
    }

    return () => {
      if (preview && preview !== '/logo.png') {
        URL.revokeObjectURL(preview);
      }
    };
  }, [avatar]);

  const setImageHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
      console.log(avatar);
    }
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = createFormData({
      name,
      avatar: avatar || undefined, // Pass undefined if image is null
      pk: userid || ''
    });

    try {
      const response = await apiService.post('/api/auth/update/', formData);
      console.log(response)
      if (!response.status) throw new Error('Failed to update profile');
      setUpdateStatus('Profile updated successfully');
    } catch (err) {
      console.log(err)
      setUpdateStatus('Failed to update profile');
      setError(err.message || 'An error occurred during the update');

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[1500px] mx-auto px-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <aside className="col-span-1 mb-4">
          <div className="flex flex-col items-center p-6 rounded-xl border border-gray-300 shadow-xl">
            
            <Image
              src={preview ?preview:'/logo.png'}
              width={200}
              height={200}
              alt="Profile Picture"
              className="rounded-full"
            />

            <h1 className="mt-6 text-2xl">
              {name ? name : "Airbnb user"}
            </h1>

          </div>
        </aside>

        <div className="col-span-1 md:col-span-3 pl-0 md:pl-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  placeholder={name}

                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>

              <div>
              <div className="font-[sans-serif] max-w-md mx-auto">
                <label className="text-base text-gray-500 font-semibold mb-2 block">Upload file</label>
                <input type="file" 
                className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" 
                onChange={setImageHandler}/>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
              </div>{/* <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  onChange={setImageHandler}
                  className="mt-1 block w-full"
                /> */}
              </div>

              {updateStatus && <p className="mt-2 text-green-500">{updateStatus}</p>}
              {error && <p className="mt-2 text-red-500">{error}</p>}

              <button
                type="submit"
                className={`mt-4 px-4 py-2 text-white bg-blue-500 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
