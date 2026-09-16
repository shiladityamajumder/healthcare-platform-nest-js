# Messaging platform library

<p><img src="https://img.shields.io/badge/Platform-Planned%20Messaging-64748B?logo=rabbitmq&logoColor=white" alt="Planned messaging platform" /></p>

Reserved technical composition boundary for provider-neutral message buses and delivery adapters. It must not import a business bounded context.

`MessagingModule` is currently an empty Nest module and is not imported by `AppModule`. No queue, broker, publisher, consumer, retry policy, or outbox dispatcher is implemented here yet. Auth notification messages are currently built in the auth context and are not dispatched through this module.

When messaging is introduced, keep transport/provider clients here, expose a narrow public contract from `src/index.ts`, and keep business event names and payload types owned by their bounded contexts or the shared integration-event contract.
