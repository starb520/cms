import { Component, signal } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cms');

  selectedFeature = 'documents';

  switchView(feature: string) {
    this.selectedFeature = feature;
  }
}
