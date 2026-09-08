import { Global, Injectable, Logger, Module } from '@nestjs/common';

/** Application logger boundary. Keep business rules out of this library. */
@Injectable()
export class AppLogger extends Logger {}

@Global()
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggingModule {}
