import { NextRequest, NextResponse } from 'next/server';
import { prisma } from 'src/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    if (!id) return new Response('Room id is required', { status: 400 });

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        host: {
          select: { id: true, name: true, image: true },
        },

        photos: {
          take: 100,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!room) return NextResponse.json({ message: 'Phòng không tồn tại' }, { status: 404 });

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json({ message: 'Có lỗi xảy ra' }, { status: 500 });
  }
}
