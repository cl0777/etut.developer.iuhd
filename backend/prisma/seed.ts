import { PrismaClient, UserRole, LessonContentType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iuhd.tm' },
    update: {},
    create: {
      email: 'admin@iuhd.tm',
      passwordHash,
      name: 'Portal Admin',
      role: UserRole.ADMIN,
    },
  });

  const course = await prisma.course.upsert({
    where: { slug: 'introduction-to-web-development' },
    update: {},
    create: {
      title: 'Introduction to Web Development',
      slug: 'introduction-to-web-development',
      description:
        'HTML, CSS, and JavaScript fundamentals. Build responsive pages and understand how the web works.',
      category: 'Programming',
      tags: ['web', 'beginner', 'html', 'css'],
      published: true,
    },
  });

  const count = await prisma.lesson.count({ where: { courseId: course.id } });
  if (count === 0) {
    await prisma.lesson.createMany({
      data: [
        {
          courseId: course.id,
          title: 'How the web works',
          description: 'Understand request/response flow and browser rendering basics.',
          order: 0,
          contentType: LessonContentType.TEXT,
          body: 'Clients request resources from servers over HTTP. Browsers render HTML and execute JavaScript.',
        },
        {
          courseId: course.id,
          title: 'CSS layout basics',
          description: 'Video walkthrough for modern CSS layout strategies.',
          order: 1,
          contentType: LessonContentType.VIDEO,
          contentUrl: 'https://example.com/video-placeholder',
        },
        {
          courseId: course.id,
          title: 'Project files',
          description: 'Download starter templates and resources.',
          order: 2,
          contentType: LessonContentType.FILE,
          contentUrl: 'https://example.com/sample.zip',
        },
      ],
    });
  }

  console.log('Seed OK. Admin:', admin.email, '| demo password: Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
