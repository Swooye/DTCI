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
      content: `
        <p>我是小王子，前泽宇团队成员，19年有幸接触到平台，跟着团队1年时间实现了年入百万，接着买房车，让整个人生至少加速了10年我是小王子前...</p>
        <p><img src="/uploads/1776435512820-456376591.png" alt="case image" /></p>
        <p>在这次全案操盘中，我们深度复盘了教育领域的诸多痛点...</p>
      `,
      tag: '事业',
      tagColor: '#FF6B35',
      isRecommended: true,
      authorId: user.id,
      images: JSON.stringify(['/uploads/1776435512820-456376591.png']),
      likes: 128,
      stars: 56,
    },
    {
      title: '报名【奢侈品全案操盘】定位青少年藤校教育，实现职业转型',
      content: `
        <p>职业转型是每个职场人的必经之路。通过DTCI的深度评估，我找到了属于自己的赛道。</p>
        <p><img src="/uploads/1776435726463-807489654.png" alt="office" /></p>
        <p>在藤校教育规划中，我们不仅仅是做申请，更是做长远的人生布局。</p>
      `,
      tag: '事业',
      tagColor: '#FF6B35',
      isRecommended: false,
      authorId: user.id,
      images: JSON.stringify(['/uploads/1776435726463-807489654.png']),
      likes: 5,
      stars: 13,
    },
    {
      title: '关于自我成长与基因健康的深度解析案例',
      content: `
        <p>通过基因检测，我重新认识了自己的天赋领域，在职场和生活中都找到了更适合自己的节奏。</p>
        <p><img src="/uploads/1776435746256-74330690.png" alt="growth" /></p>
        <p>基因不仅决定了生理，更在深层次影响着我们的决策模式。</p>
      `,
      tag: '自我成长',
      tagColor: '#4A90E2',
      isRecommended: true,
      authorId: user.id,
      images: JSON.stringify(['/uploads/1776435746256-74330690.png']),
      likes: 209,
      stars: 999,
    },
  ];

  for (const c of cases) {
    await prisma.case.create({ data: c });
  }

  // 3. 创建服务信息
  await prisma.service.deleteMany({});

  const services = [
    {
      name: 'DTCI 1V1深度解读',
      description: '帮您更深度地看见事业、婚恋、亲子关系的卡点和改善之道',
      price: 199,
      originalPrice: 399,
      category: 'personal',
      image: '/assets/images/founder.jpg',
      content: '<p>DTOI 1V1深度解读详情介绍...</p>'
    },
    {
      name: 'DTCI进化1V1陪伴',
      description: '深度陪伴、支持您更好地自我成长、自我疗愈与亲密关系改善',
      price: 299,
      originalPrice: 599,
      category: 'personal',
      image: '/assets/images/founder.jpg',
      content: '<p>DTCI进化1V1陪伴详情介绍...</p>'
    },
    {
      name: 'DTCI正念训练营',
      description: '在团体中，共同科学训练、刻意练习，践行“你好、我好”生活之道',
      price: 99,
      originalPrice: 199,
      category: 'personal',
      image: '/assets/images/founder.jpg',
      content: '<p>DTCI正念训练营详情介绍...</p>'
    },
    {
      name: 'DTCI 认证解读师培训',
      description: '支持有潜力、有能力的人成为DTCI解读师，影响更多人活好自己',
      price: 999,
      originalPrice: 1999,
      category: 'personal',
      image: '/assets/images/founder.jpg',
      content: '<p>DTCI 认证解读师培训详情介绍...</p>'
    },
    {
      name: '企业人才测评',
      description: '帮助企业更好地识别人才、遴选人才，大大提高人才招聘的效率',
      price: 599,
      originalPrice: 899,
      category: 'corporate',
      image: '/assets/images/founder.jpg',
      content: '<p>企业人才测评详情介绍...</p>'
    },
    {
      name: '高管匹配度评估',
      description: '评估高管与岗位职能、当前企业发展阶段的匹配度，避免人才引进的盲目',
      price: 899,
      originalPrice: 1299,
      category: 'corporate',
      image: '/assets/images/founder.jpg',
      content: '<p>高管匹配度评估详情介绍...</p>'
    },
    {
      name: '幸福领导力培训',
      description: '助力管理者发展出L型幸福领导力，激发其带领出高效能、高幸福感的团队',
      price: 1299,
      originalPrice: 1999,
      category: 'corporate',
      image: '/assets/images/founder.jpg',
      content: '<p>幸福领导力培训详情介绍...</p>'
    },
    {
      name: '企业文化咨询',
      description: '基于企业生命周期与企业DTCI诊断，帮助企业建立更具效能的企业文化',
      price: 2999,
      originalPrice: 4999,
      category: 'corporate',
      image: '/assets/images/founder.jpg',
      content: '<p>企业文化咨询详情介绍...</p>'
    }
  ];

  for (const s of services) {
    await prisma.service.create({ data: s });
  }

  console.log('Created seed services:', services.length);
  
  // 4. 创建初始设置
  const consolidatedDescription = `
    <h3 style="text-align: center;">了庸文化（DTCI）</h3>
    <p>上海了庸文化传播有限公司是一家专注于个人成长、家庭幸福与组织发展的综合性文化机构。致力于通过社会基因DTCI赋能个人、赋能家庭、赋能组织，成就每个人、每个家庭和每个组织的幸福，推动社会更加幸福、更加美好。</p>
    <p>我们的使命是影响2亿人更好地认识自己、进化自己、成就自己。这不是一句空洞的口号，而是我们切切实实的每一步。我们坚信，路虽难，行则将至！</p>
    
    <hr />
    
    <h3>联系我们</h3>
    <p>联系电话：400-888-8888</p>
    <p>电子邮箱：contact@dtci.com</p>
    <p>公司地址：北京市朝阳区XXX大厦</p>
    
    <hr />
    
    <h3>关注我们</h3>
    <p style="text-align: center;"><img src="/assets/images/qrcode.png" style="width: 200px;" alt="QR Code" /></p>
    <p style="text-align: center; color: #999;">扫描二维码关注公众号</p>
  `;

  await prisma.setting.upsert({
    where: { key: 'about_us' },
    update: {
      value: JSON.stringify({ description: consolidatedDescription })
    },
    create: {
      key: 'about_us',
      value: JSON.stringify({ description: consolidatedDescription })
    }
  });

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
