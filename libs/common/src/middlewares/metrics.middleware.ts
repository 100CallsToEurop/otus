import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Histogram, Counter } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  private readonly httpRequestDurationMicroseconds = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  });

  private readonly httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  use(req: Request, res: Response, next: NextFunction): void {
    const end = this.httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
      const route = req.route ? req.route.path : 'unknown_route';
      const labels = {
        method: req.method,
        route,
        status_code: res.statusCode.toString(),
      };

      this.httpRequestsTotal.inc(labels);
      end(labels);
    });

    next();
  }
}
