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
      .get<Document[]>('http://localhost:3000/documents')
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
  // addDocument(newDocument: Document) {
  //   if (!newDocument) {
  //     return;
  //   }
  //   this.maxDocumentId++;
  //   newDocument.id = this.maxDocumentId.toString();
  //   this.documents.push(newDocument);
  //   this.storeDocuments(); 
  // }
 addDocument(document: Document) {
  if (!document) {
    return;
  }
  // Let the server assign the new ID
  document.id = '';
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  this.http.post<{ message: string; document: Document }>(
    'http://localhost:3000/documents',
    document,
    { headers: headers }
  )
  .subscribe((responseData) => {
    // Add the document returned from the server
    this.documents.push(responseData.document);
    // Sort the list (your existing logic)
    this.documents.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    // Notify all subscribers (your existing logic)
    this.documentListChangedEvent.next(this.documents.slice());
  });
}



  // update existing document in documents list
  // updateDocument(originalDocument: Document, newDocument: Document) {
  //   if (!originalDocument || !newDocument) {
  //     return;
  //   }
  //   const position = this.documents.indexOf(originalDocument);
  //   if (position < 0) {
  //     return;
  //   }
  //   newDocument.id = originalDocument.id;
  //   this.documents[position] = newDocument;
  //   this.storeDocuments(); 
  // }
  updateDocument(originalDocument: Document, newDocument: Document) {
  if (!originalDocument || !newDocument) {
    return;
  }

  // find the document in the list
  const pos = this.documents.findIndex(d => d.id === originalDocument.id);

  if (pos < 0) {
    return;
  }

  // keep IDs consistent
  newDocument.id = originalDocument.id;
  (newDocument as any)._id = (originalDocument as any)._id;
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  // send update to the backend
  this.http
    .put(
      'http://localhost:3000/documents/' + originalDocument.id,
      newDocument,
      { headers: headers }
    )
    .subscribe({
      next: () => {
        // update local array
        this.documents[pos] = newDocument;
        // re-sort list
        this.documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        // notify components
        this.documentListChangedEvent.next(this.documents.slice());
      },
      error: (error) => {
        console.error("Error updating document:", error);
      }
    });
}


  // delete document from the documents list
  // deleteDocument(document: Document) {
  //   if (!document) {
  //     return;
  //   }
  //   const position = this.documents.indexOf(document);

  //   if (position < 0) {
  //     return;
  //   }
  //   this.documents.splice(position, 1);
  //   this.storeDocuments(); 
  // }


  deleteDocument(document: Document) {
  if (!document) {
    return;
  }

  const pos = this.documents.findIndex(d => d.id === document.id);

  if (pos < 0) {
    return;
  }

  // send DELETE request to Express backend
  this.http.delete('http://localhost:3000/documents/' + document.id)
    .subscribe({
      next: () => {
        // remove document locally
        this.documents.splice(pos, 1);

        // re-sort list
        this.documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        // notify subscribers
        this.documentListChangedEvent.next(this.documents.slice());
      },

      error: (error) => {
        console.error("Error deleting document:", error);
      }
    });
}



}
