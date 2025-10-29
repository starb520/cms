import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  // selectedDocumentEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
   }

   getDocuments(): Document[] {
     return this.documents.slice();
   }

   getDocument(id: string): Document | null {
     return this.documents.find(d => d.id === id) || null;
   }

   // find the highest id number in the documents list so when
   // adding additional documents we know where to start
   getMaxId(): number {
    let maxId = 0;
    this.documents.forEach(document => {
      const currentId = parseInt(document.id, 10);  
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
   }

   // add new document to documents list
   addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.documentListChangedEvent.next(this.documents.slice()); // passes a clone of the array to the subscribers
   }

   // update existing document in documents list
   updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    } 
    const position = this.documents.indexOf(originalDocument);
    if (position < 0) {
      return;
    }   
    newDocument.id = originalDocument.id;
    this.documents[position] = newDocument;
    this.documentListChangedEvent.next(this.documents.slice());
   }

   // delete document from the documents list
   deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const position = this.documents.indexOf(document);
 
    if (position < 0) {
      return;
    }
    this.documents.splice(position, 1);
    this.documentListChangedEvent.next(this.documents.slice());
   }
}
