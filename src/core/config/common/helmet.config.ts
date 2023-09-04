import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';

export function configureHelmet(app: INestApplication) {
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ['http://localhost:3000'],
        baseUri: ["'self'"],
        blockAllMixedContent: [],
        fontSrc: ["'self'", 'data:'],
        formAction: ["'self'"],
        objectSrc: ["'none'"],

        // requireTrustedTypesFor: ["'script'"], // Prevents DOM XSS injection, but it also breaks the client
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        upgradeInsecureRequests: [],
        imgSrc: ["'self'", 'https: data:'],

        // requireTrustedTypesFor: ["'script'"], // Prevents DOM XSS injection, but it also breaks the client
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
      reportOnly: false,
    }),
  );

  app.use(
    helmet.crossOriginResourcePolicy({
      policy: 'cross-origin',
    }),
  );

  app.use(
    helmet.referrerPolicy({
      policy: ['strict-origin-when-cross-origin'],
    }),
  );
  app.use(helmet.hsts());
  app.use(helmet.noSniff());
  app.use(helmet.originAgentCluster());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.ieNoOpen());
  app.use(helmet.frameguard());
  app.use(
    helmet.permittedCrossDomainPolicies({
      permittedPolicies: 'by-content-type',
    }),
  );
  app.use(helmet.hidePoweredBy());
  app.use(helmet.xssFilter());
}
