import { Component } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
  providers: [DocumentService]
})
export class DocumentsComponent {
  selectedDocument: Document;

  constructor(private documentService: DocumentService) {}
  
  ngOnInit() {
    // this.documentService.selectedDocumentEvent
    //   .subscribe(
    //     (document: Document) => {
    //       this.selectedDocument = document;
    //     }
    //   );
  }

}
