import { Video } from '../../models/video.model';

export const videoProviders = [
  {
    provide: 'VIDEO_REPOSITORY',
    useValue: Video,
  },
]; 