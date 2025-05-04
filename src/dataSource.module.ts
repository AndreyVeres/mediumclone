import { Global, Module } from '@nestjs/common';
import DataSourceInstance from './orm.config';
import { DataSource } from 'typeorm';

@Global()
@Module({
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        try { 
          await DataSourceInstance.initialize();
          console.log('Database connected successfully');
          return DataSourceInstance;
        } catch (error) {
          console.error('Error connecting to database: ', error);
          throw error;
        }
      },
    },
  ],
  exports: [DataSource],
})
export class DataSourceModule {}
