'use client';

import { signIn, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Session } from 'next-auth';

interface AvatarMenuProps {
  session: Session | null;
  namePosition?: 'left' | 'right' | 'hidden';
}

export default function AvatarMenu({
  session,
  namePosition = 'right', // "left" | "right" | "hidden"
}: AvatarMenuProps) {
  if (!session)
    return (
      <Button variant="outline" onClick={() => signIn('google')}>
        Đăng nhập
      </Button>
    );
  const { user } = session;
  const NameTag = () => namePosition !== 'hidden' && <span className="text-sm font-medium truncate">{user?.name}</span>;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center gap-2">
          {namePosition === 'left' && <NameTag />}
          <Avatar className="w-10 h-10 cursor-pointer">
            <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
            <AvatarFallback>{user?.name?.substring(0, 1).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          {namePosition === 'right' && <NameTag />}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" side="bottom">
        <DropdownMenuLabel>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="text-red-600">
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
