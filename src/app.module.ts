import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { Context } from 'apollo-server-core';
import { PubSub } from 'graphql-subscriptions';
import Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { ChatModule } from './chat/chat.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ContactModule } from './contact/contact.module';
import { FileModule } from './file/file.module';
import { HsmModule } from './hsm/hsm.module';
import { MessageModule } from './message/message.module';
import { ProjectModule } from './project/project.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';

export const pubSub = new PubSub();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        BROKER_URL: Joi.string().uri().required(),
        PORT: Joi.number().default(8080),
        WEBSOCKET_PORT: Joi.number().default(4040),
        SECRET: Joi.string().required(),
        S3_ENDPOINT: Joi.string().uri().required(),
        S3_ACCESS_KEY: Joi.string().required(),
        S3_SECRET_KEY: Joi.string().required(),
        S3_BUCKET: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async () => ({
        autoSchemaFile: true,
        uploads: false,
        persistedQueries: false,
        subscriptions: {
          'graphql-ws': {
            onConnect: async (context: Context<any>) => {
              const connectionParams = Object.fromEntries(
                Object.entries(context.connectionParams).map(([key, val]) => [
                  key.toLowerCase(),
                  val,
                ]),
              );

              Object.assign(context.extra.request.headers, connectionParams);
              context.req = context.extra.request;
            },
          },
          context: ({ req, extra }) => ({
            req,
            extra,
          }),
        },
        playground: true,
      }),
    }),
    EventEmitterModule.forRoot({
      maxListeners: Infinity,
    }),
    AuthModule,
    ChannelModule,
    ChatModule,
    ChatbotModule,
    ContactModule,
    FileModule,
    HsmModule,
    MessageModule,
    ProjectModule,
    TagModule,
    UserModule,
    WebhookModule,
  ],
  providers: [],
})
export class AppModule {}
