export type Hooks = {
  registrationOptions?: RegistrationOptions;
  ready?: (registration: ServiceWorkerRegistration) => void;
  registered?: (registration: ServiceWorkerRegistration) => void;
  cached?: (registration: ServiceWorkerRegistration) => void;
  updated?: (registration: ServiceWorkerRegistration) => void;
  updatefound?: (registration: ServiceWorkerRegistration) => void;
  offline?: () => void;
  error?: (error: Error) => void;
};

export function register(swUrl: string, hooks?: Hooks): void;

export function unregister(): void;
