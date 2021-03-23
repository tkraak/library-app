import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service() performanceMetrics;
  @service() router;

  beforeModel(transition) {
    this.performanceMetrics.startTracking(transition);
    this.router.on('routeWillChange', (transition) => {
      if (!transition.to.find((route) => route.name === 'loading')) {
        this.performanceMetrics.startTracking(transition);
      }
    });
  }
}
