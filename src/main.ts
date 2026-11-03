import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElement } from 'ionicons/components/ion-icon.js';
import { addIcons } from 'ionicons';
import {
  addOutline,
  createOutline,
  trashOutline,
  downloadOutline,
  cloudUploadOutline,
  gridOutline,
  listOutline,
  chevronDownOutline,
  chevronUpOutline
} from 'ionicons/icons';
import { appConfig } from './app/app.config';
import { App } from './app/app';

defineCustomElement();
addIcons({
  addOutline,
  createOutline,
  trashOutline,
  downloadOutline,
  cloudUploadOutline,
  gridOutline,
  listOutline,
  chevronDownOutline,
  chevronUpOutline
});

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
