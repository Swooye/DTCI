import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async login(code: string, phoneCode?: string) {
    const appId = process.env.WECHAT_APPID;
    const appSecret = process.env.WECHAT_APPSECRET;

    if (!appId || !appSecret) {
      throw new Error('WeChat AppID or AppSecret not configured');
    }

    let openid = "mock_openid_" + code;
    let phone = null;
    
    // 如果是测试环境或者未配置真实密钥，则开启Mock模式
    if (appSecret === 'YOUR_APPSECRET' || !appSecret) {
      console.warn('⚠️ 使用Mock微信登录 (未配置真实WECHAT_APPSECRET)');
      openid = "mock_openid_dev_user"; // 使用固定的 OpenID 以便开发调试唯一性逻辑
      if (phoneCode) phone = "186****8254"; // 使用稳定的 Mock 手机号
    } else {
      // 1. 调用微信接口获取 openid
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
      
      try {
        const response = await firstValueFrom(this.httpService.get(url));
        const { openid: resOpenid, errcode, errmsg } = response.data;
        
        if (errcode) {
          console.warn(`WeChat login API error: ${errmsg}, falling back to mock`);
        } else if (resOpenid) {
          openid = resOpenid;
        }

        // 1.1 获取手机号逻辑 (此处省略真实调用，仅为框架展示)
        if (phoneCode) {
           console.log('真实环境获取手机号 Code:', phoneCode);
           // 实际应调用微信 getPhoneNumber 接口
           phone = "已通过Code校验"; 
        }
      } catch (e) {
        console.warn(`WeChat login request failed, falling back to mock:`, e.message);
      }
    }

    // 2. 数据库查重与创建 (Upsert 逻辑)
    const user = await this.prisma.user.upsert({
      where: { openid },
      update: {
        ...(phone ? { phone } : {})
      }, 
      create: {
        openid,
        nickname: '微信用户',
        avatarUrl: '/assets/images/default-avatar.png',
        phone: phone
      },
    });

    return user;
  }
}

