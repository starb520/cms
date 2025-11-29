import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    // Initialize contacts with mock data
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts() {
    this.http.get<Contact[]>('http://localhost:3000/contacts').subscribe({
      next: (contacts: Contact[]) => {
        this.contacts = contacts || [];

        //  console.log("🔥 Contacts received from Firebase:", this.contacts);

        this.contacts.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        this.maxContactId = this.getMaxId();
        this.contactListChangedEvent.next(this.contacts.slice());
      },

      error: (error: any) => {
        console.error('Error fetching contacts:', error);
      },
    });
  }

  // getContacts(): Contact[] {
  //   return this.contacts.slice();
  // }

  getContact(id: string): Contact | null {
    return this.contacts.find((c) => c.id === id) || null;
  }

  storeContacts() {
    const contactsString = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put('https://wdd430-cms-cc424-default-rtdb.firebaseio.com/contacts.json', contactsString, {
        headers: headers,
      })
      .subscribe({
        next: () => {
          // console.log('Contacts successfully stored to Firebase.');
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: (error: any) => {
          console.error('Error storing contacts:', error);
        },
      });
  }

  // find the highest id number in the contacts list so when
  // adding additional contacts we know where to start
  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach((contact) => {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  // add new contact to contacts list
  // addContact(newContact: Contact) {
  //   if (!newContact) {
  //     return;
  //   }
  //   this.maxContactId++;
  //   newContact.id = this.maxContactId.toString();
  //   this.contacts.push(newContact);
  //   this.storeContacts();
  // }

  // // update existing contact in contacts list
  // updateContact(originalContact: Contact, newContact: Contact) {
  //   if (!originalContact || !newContact) {
  //     return;
  //   }
  //   const position = this.contacts.indexOf(originalContact);
  //   if (position < 0) {
  //     return;
  //   }
  //   newContact.id = originalContact.id;
  //   this.contacts[position] = newContact;
  //   this.storeContacts();
  // }

  // add new contact to contacts list
  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
    // Let backend assign ID
    newContact.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .post<{ message: string; contact: Contact }>('http://localhost:3000/contacts', newContact, {
        headers: headers,
      })
      .subscribe({
        next: (responseData) => {
          this.contacts.push(responseData.contact);

          // sort list
          this.contacts.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });

          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: (err) => {
          console.error('Error adding contact:', err);
        },
      });
  }

  // update existing contact in contacts list
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.findIndex((c) => c.id === originalContact.id);
    if (pos < 0) {
      return;
    }
    // Keep IDs consistent
    newContact.id = originalContact.id;
    (newContact as any)._id = (originalContact as any)._id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put('http://localhost:3000/contacts/' + originalContact.id, newContact, { headers: headers })
      .subscribe({
        next: () => {
          this.contacts[pos] = newContact;

          this.contacts.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        error: (error) => {
          console.error('Error updating contact:', error);
        },
      });
  }

  // delete contact from the contacts list
  // deleteContact(contact: Contact) {
  //   if (!contact) {
  //     return;
  //   }
  //   const position = this.contacts.indexOf(contact);

  //   if (position < 0) {
  //     return;
  //   }
  //   this.contacts.splice(position, 1);
  //   this.storeContacts();
  // }

  // delete contact from the contacts list
  deleteContact(contact: Contact) {
  if (!contact) {
    return;
  }

  const pos = this.contacts.findIndex(c => c.id === contact.id);

  if (pos < 0) {
    return;
  }

  this.http.delete('http://localhost:3000/contacts/' + contact.id)
    .subscribe({
      next: () => {
        this.contacts.splice(pos, 1);

        this.contacts.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        this.contactListChangedEvent.next(this.contacts.slice());
      },

      error: (error) => {
        console.error('Error deleting contact:', error);
      }
    });
}

}
