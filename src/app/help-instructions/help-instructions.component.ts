import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help-instructions',
  templateUrl: './help-instructions.component.html',
  styleUrls: ['./help-instructions.component.scss']
})
export class HelpInstructionsComponent implements OnInit {
  panelOpenState = false;

  constructor() { }

  ngOnInit(): void {
  }

}
