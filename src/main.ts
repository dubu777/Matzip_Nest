import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3030

  if(process.env.NODE_ENV === 'production') {
    app.enableCors({ // https 적용해서 실제로 내 주소로 배포했을시에
      // origin: ['https://내 주소'],
      origin: true,
      credentials: true,
    })
  } else { // 프로덕션이 아닌 개발환경
    app.enableCors({
      origin: true,
      credentials: true,
    })
  }

  await app.listen(port);
  console.log(`http://localhost:${port}`);
  
}
bootstrap();
