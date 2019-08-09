import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { ChecklistService } from '../services/checklist.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChecklistType } from '../models/checklist_type';

@Component({
  selector: 'app-checklist-summary',
  templateUrl: './checklist-summary.component.html',
  providers: [ChecklistService]
})

export class ChecklistSummaryComponent implements OnInit {
  public checklistForm: FormGroup;
  public checklistTypes: ChecklistType[];
  public delete: string;
  public idFromURL: number;
  public queryString: string;
  
  get formControls() { return this.checklistForm.controls; }

  constructor(private _checklistService: ChecklistService, private modalService: NgbModal,  private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.checklistForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    })

    this.checklistTypeList()
  }

  newChecklistType() {
    this._checklistService.newChecklistType(this.checklistForm.value)
      .subscribe(
        checklistTypes => this.checklistTypes = checklistTypes,
        () => console.log('There was an error storing the new checklistType'),
        () => this.checklistTypeList()
      );
  }

  updateChecklistType(id: number) {
    this._checklistService.updateChecklistType(id, this.checklistForm.value).subscribe(x =>
      // Get the new project list on delete
      this.checklistTypeList())
  }

  checklistTypeList() {
    this._checklistService
      .getChecklistTypeList()
      .subscribe(
        checklistTypes => {
          this.checklistTypes = checklistTypes;
        },
        () => console.log('Getting the checklist types failed, contact an administrator! '))
  }


  deleteChecklistType(id: number) {
    if (this.delete == 'DELETE') {
      this._checklistService.deleteChecklistType(id).subscribe(x =>
        // Get the new project list on delete
        this.checklistTypeList())
      this.delete = '';
    }
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' }).result
  }

  deleteContent(deleteContent) {
    this.modalService.open(deleteContent, { size: 'lg' }).result
  }

  updateContent(updateContent) {
    this.modalService.open(updateContent, { size: 'lg' }).result
  }

  getSet(name, description) {
    this.checklistTypes['name'] = name
    this.checklistTypes['description'] = description
    this.checklistForm.patchValue(this.checklistTypes)
  }
}