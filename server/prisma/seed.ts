import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // 1. 创建一个默认作者用户
  const user = await prisma.user.upsert({
    where: { openid: 'seed_user_openid_001' },
    update: {},
    create: {
      openid: 'seed_user_openid_001',
      nickname: '小米粥',
      avatarUrl: '/assets/images/founder.jpg',
      phone: '18600000000',
    },
  });

  console.log('Created/Updated seed user:', user.nickname);

  // 2. 清理并重新创建案例
  await prisma.case.deleteMany({});

  const cases = [
    {
      title: '报名【奢侈品全案操盘】，定位青少年藤校教育规划和心力教练全年陪跑',
      content: '我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子前...',
      tag: '事业',
      tagColor: '#FF6B35',
      isRecommended: true,
      authorId: user.id,
      images: JSON.stringify(['/assets/images/founder.jpg']),
      likes: 128,
      stars: 56,
    },
    {
      title: '报名【奢侈品全案操盘】定位青少年藤校教育，实现职业转型',
      content: '我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子...',
      tag: '事业',
      tagColor: '#FF6B35',
      isRecommended: false,
      authorId: user.id,
      images: JSON.stringify(['/assets/images/founder.jpg', '/assets/images/founder.jpg']),
      likes: 5,
      stars: 13,
    },
    {
      title: '关于自我成长与基因健康的深度解析案例',
      content: '通过基因检测，我重新认识了自己的天赋领域，在职场和生活中都找到了更适合自己的节奏。',
      tag: '自我成长',
      tagColor: '#4A90E2',
      isRecommended: true,
      authorId: user.id,
      images: JSON.stringify(['/assets/images/founder.jpg', '/assets/images/founder.jpg', '/assets/images/founder.jpg']),
      likes: 209,
      stars: 999,
    },
  ];

  for (const c of cases) {
    await prisma.case.create({ data: c });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
