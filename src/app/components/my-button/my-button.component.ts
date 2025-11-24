import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-button',
  templateUrl: './my-button.component.html',
  styleUrls: ['./my-button.component.css'],
  imports: [CommonModule]
})
export class MyButtonComponent {
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() isSelected: boolean = false;
  @Input() fontSize: string = '55px';
  @Output() buttonClick = new EventEmitter<void>();

  onClick() {
    this.buttonClick.emit();
  }
}