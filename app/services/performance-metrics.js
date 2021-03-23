import Service, { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { setProperties } from '@ember/object';

export default class PerformanceMetricsService extends Service {
  @service() router;

  currentRouteTracking = {};

  startTracking(transition) {
    const startTime = Date.now();
    const routeName = transition.to.name;

    setProperties(this.currentRouteTracking, {
      routeName,
      startTime,
    });

    // schedule end tracking once transition has settled
    this.router.on('routeDidChange', this, this.scheduleEndTracking);
  }

  // end tracking after all previously schedule render task are completed
  // and the entire DOM tree has been updated
  scheduleEndTracking(transition) {
    scheduleOnce('afterRender', this, this.endTracking, transition);
  }

  endTracking(transition) {
    const endTime = Date.now();
    const currentRoute = transition.to.name;

    const { routeName, startTime } = this.currentRouteTracking;

    if (routeName === currentRoute) {
      console.log({
        routeUrl: this.router.currentURL,
        startTime,
        endTime,
      });

      this.currentRouteTracking = {};
    }
  }
}
