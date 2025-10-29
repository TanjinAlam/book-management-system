import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: configService.get('POSTGRES_HOST', 'localhost'),
      port: configService.get<number>('POSTGRES_PORT', 5432),
      username: configService.get('POSTGRES_USER', 'postgres'),
      password: configService.get('POSTGRES_PASSWORD', 'password'),
      database: configService.get('POSTGRES_DB', 'book_management_system'),
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      logging: false,
    };
  },
};
