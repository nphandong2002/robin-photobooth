'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from 'src/shared/components/ui/button';
import { Skeleton } from 'src/shared/components/ui/skeleton';
import AvatarMenu from 'src/shared/components/user-avatar/AvatarMenu';
import LiveVideo from './_sections/live-video';

function RoomDetail() {
  const params = useParams();
  const roomId = params.id as string;
  const { data: session, status } = useSession();
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}`);
        if (!response.ok) {
          toast.error('Phòng không tồn tại');
          router.push('/');
          return;
        }
        const data = await response.json();
        setRoom(data);
      } catch (err) {
        setError('Phòng không tồn tại');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleExit = () => {
    router.push('/');
  };
  return (
    <div className="flex min-h-screen  justify-center bg-linear-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="w-screen">
        <div className="mb-8 flex items-center justify-between bg-white shadow-2xl p-4 ">
          {loading && <Skeleton className="h-8 w-48 rounded-md" />}
          {!loading && room && (
            <div className="flex justify-between items-center">
              <div className="flex flex-col mr-4">
                <h1 className="text-xl font-bold text-gray-900 ">{room?.title}</h1>
                <p className="text-sm text-gray-400">Mã: {room?.code}</p>
              </div>
              <Button onClick={handleExit} variant="default">
                Thoát
              </Button>
            </div>
          )}

          <AvatarMenu namePosition="left" session={session} />
        </div>
        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
          <div className="lg:flex-1 flex flex-col">
            {loading && <Skeleton className="h-64 w-full rounded-md" />}
            {!loading && room && <LiveVideo room={room} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetail;
