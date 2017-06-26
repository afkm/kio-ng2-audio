import { Component } from '@angular/core';
import { AudioSource } from 'kio-ng2-audio'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';


  sourceIndex:number=-1

  sources:AudioSource[]=[
    {url: '../assets/audio/indiff.mp3', mimeType: 'audio/mpeg'},
    {url: '../assets/audio/punk elephant.mp3', mimeType: 'audio/mpeg'}
  ]

  onSelectSource ( source:AudioSource ) {
    this.sourceIndex = this.sources.indexOf(source)
  }

}
