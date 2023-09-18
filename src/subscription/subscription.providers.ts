import { Subscription } from '../models/subscription.model';

export const subscriptionProviders = [
  {
    provide: 'SUBSCRIPTION_REPOSITORY',
    useValue: Subscription,
  },
]; 