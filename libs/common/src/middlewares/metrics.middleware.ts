import { Injectable, NestMiddleware } from '@nestjs/common';
import { Counter, Summary } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('http_requests_total')
    private requestsCounter: Counter<string>,
    @InjectMetric('http_errors_total') private errorsCounter: Counter<string>,
    @InjectMetric('http_request_duration_seconds')
    private requestDuration: Summary<string>,
  ) {}

  use(req: any, res: any, next: () => void) {
    // Используем оригинальный URL, если route.path недоступен
    const routePath = req.route?.path || req.originalUrl || req.url;

    const end = this.requestDuration.startTimer({
      method: req.method,
      route: routePath,
    });

    res.on('finish', () => {
      this.requestsCounter.inc({
        method: req.method,
        route: routePath,
        status: res.statusCode,
      });

      if (res.statusCode >= 500) {
        this.errorsCounter.inc({ method: req.method, route: routePath });
      }

      end();
    });

    next();
  }
}
