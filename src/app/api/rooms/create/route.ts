import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from 'src/lib/prisma';
import { authOptions } from 'src/lib/next-auth/authOptions';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const { title, maxMembers, locked } = await req.json();
    // Lấy session để xác định user tạo phòng
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id)
      return NextResponse.json({ message: 'Bạn cần đăng nhập để tạo phòng' }, { status: 401 });

    const hostId = session.user.id;

    // Tạo mã code duy nhất
    let code = generateRoomCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.room.findUnique({ where: { code } });
      if (!existing) break;
      code = generateRoomCode();
      attempts++;
    }

    if (attempts >= 10) return NextResponse.json({ message: 'Không thể tạo phòng, vui lòng thử lại' }, { status: 500 });

    const room = await prisma.room.create({
      data: {
        code,
        title: title || `Phòng ${code}`,
        hostId,
        maxMembers: typeof maxMembers === 'number' ? maxMembers : 8,
        locked: typeof locked === 'boolean' ? locked : false,
      },
    });

    return NextResponse.json(
      {
        roomId: room.id,
        code: room.code,
        title: room.title,
        hostId: room.hostId,
        maxMembers: room.maxMembers,
        locked: room.locked,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ message: 'Có lỗi xảy ra trên server' }, { status: 500 });
  }
}
