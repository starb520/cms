import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  // selectedDocumentEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    this.http
      .get<Document[]>('https://wdd430-cms-cc424-default-rtdb.firebaseio.com/documents.json')
      .subscribe({
        next: (documents: Document[]) => {
          this.documents = documents || [];

          //  console.log("🔥 Documents received from Firebase:", this.documents);

          this.documents.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });

          this.maxDocumentId = this.getMaxId();
          this.documentListChangedEvent.next(this.documents.slice());
        },

        error: (error: any) => {
          console.error('Error fetching documents:', error);
        },
      });
  }

  //  getDocuments(): Document[] {
  //    return this.documents.slice();
  //  }

  getDocument(id: string): Document | null {
    return this.documents.find((d) => d.id === id) || null;
  }

  storeDocuments() {
    const documentsString = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(
        'https://wdd430-cms-cc424-default-rtdb.firebaseio.com/documents.json',
        documentsString,
        { headers: headers }
      )
      .subscribe({
        next: () => {
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: (error: any) => {
          console.error('Error storing documents:', error);
        },
      });
  }


  // find the highest id number in the documents list so when
  // adding additional documents we know where to start
  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach((document) => {
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
    this.storeDocuments(); 
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
    this.storeDocuments(); 
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
    this.storeDocuments(); 
  }
}
