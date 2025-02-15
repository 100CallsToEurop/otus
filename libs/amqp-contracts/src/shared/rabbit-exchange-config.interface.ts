export interface IRabbitExchangeConfig {
  name: string;
  type: 'topic' | 'direct' | 'fanout' | 'headers';
  options?: IAssertEchange;
}

interface IAssertEchange {
  durable?: boolean;
  internal?: boolean;
  autoDelete?: boolean;
  alternateExchange?: string;
  arguments?: unknown | unknown[];
}
