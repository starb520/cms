import { Component, OnInit } from '@angular/core';

import { Document } from '../document.model';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'cms-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css'
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor() {}

  ngOnInit(){}

  onSubmit(form: NgForm) {}
  
  onCancel() {}


}
