import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PlatformConfigModule } from '@platform/config';
import { DatabaseModule } from '@platform/database';
import { HttpKernelModule } from '@platform/http';
import { LoggingModule } from '@platform/logging';
import { ObservabilityModule } from '@platform/observability';
import { CacheModule } from '@platform/cache';
import { AuthModule } from '@modules/auth';
import { UserManagementModule } from '@modules/user-management';
import { OrganizationsModule } from '@modules/organizations';
import { PatientsModule } from '@modules/patients';
import { PractitionersModule } from '@modules/practitioners';
import { FileManagementModule } from '@modules/file-management';
import { CatalogModule } from '@modules/catalog';
import { PricingModule } from '@modules/pricing';
import { InventoryModule } from '@modules/inventory';
import { OrdersModule } from '@modules/orders';
import { PaymentsModule } from '@modules/payments';
import { NotificationsModule } from '@modules/notifications';
import { PrescriptionsModule } from '@modules/prescriptions';
import { AppointmentsModule } from '@modules/appointments';
import { AuditModule } from '@modules/audit';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    PlatformConfigModule,
    LoggingModule,
    ObservabilityModule,
    DatabaseModule,
    CacheModule,
    HttpKernelModule,
    CqrsModule.forRoot(),
    HealthModule,
    AuthModule,
    UserManagementModule,
    OrganizationsModule,
    PatientsModule,
    PractitionersModule,
    FileManagementModule,
    CatalogModule,
    PricingModule,
    InventoryModule,
    OrdersModule,
    PaymentsModule,
    NotificationsModule,
    PrescriptionsModule,
    AppointmentsModule,
    AuditModule,
  ],
})
export class AppModule {}
