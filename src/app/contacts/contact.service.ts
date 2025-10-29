import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contacts: Contact[] = [];
  // contactSelectedEvent = new EventEmitter<Contact>();
  // contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor() {
    // Initialize contacts with mock data
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(c => c.id === id) || null;
  }

  // find the highest id number in the contacts list so when
  // adding additional contacts we know where to start
  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach(contact => {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  // add new contact to contacts list
  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.contactListChangedEvent.next(this.contacts.slice()); // passes a clone of the array to the subscribers
  }

  // update existing contact in contacts list
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {  
      return;
    } 
    const position = this.contacts.indexOf(originalContact);
    if (position < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[position] = newContact;
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  // delete contact from the contacts list
  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const position = this.contacts.indexOf(contact);

    if (position < 0) {
      return;
    }
    this.contacts.splice(position, 1);
    this.contactListChangedEvent.next(this.contacts.slice());;
  }
}
