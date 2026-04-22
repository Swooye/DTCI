import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { UploadsModule } from './uploads/uploads.module';
import { CasesModule } from './cases/cases.module';
import { ServicesModule } from './services/services.module';
import { SettingsModule } from './settings/settings.module';
import { AssessmentsModule } from './assessments/assessments.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    AdminsModule,
    AuthModule,
    UsersModule,
    CasesModule,
    ServicesModule,
    SettingsModule,
    UploadsModule,
    AssessmentsModule,
    FeedbacksModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
