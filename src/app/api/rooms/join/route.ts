import { prisma } from 'src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string')
      return NextResponse.json({ message: 'Mã phòng không hợp lệ' }, { status: 400 });

    const room = await prisma.room.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!room) return NextResponse.json({ message: 'Mã phòng không tồn tại' }, { status: 404 });

    return NextResponse.json({
      roomId: room.id,
      code: room.code,
      title: room.title,
    });
  } catch (error) {
    console.error('Error joining room:', error);
    return NextResponse.json({ message: 'Có lỗi xảy ra trên server' }, { status: 500 });
  }
}
