import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { registerLicense } from '@syncfusion/ej2-base';


registerLicense('Ngo9BigBOggjHTQxAR8/V1NHaF5cXmVCf1JpR3xbf1xzZFREalhYTndcUj0eQnxTdEZiWX9dcXZQT2BUU011Vw==');
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
