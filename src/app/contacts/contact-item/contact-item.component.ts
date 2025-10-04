import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-item',
  standalone: false,
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css',
})
export class ContactItemComponent implements OnInit {
  @Input() contact: Contact;
  @Output() contactSelected = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {

  }

  onSelected() {
    this.contactSelected.emit();
    // console.log('Contact clicked:', this.contact)
  }
}
