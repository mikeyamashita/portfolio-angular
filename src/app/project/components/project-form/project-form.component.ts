import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { MatButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

import { ProjectService } from '../../services/project.service';
import { LinkFormComponent } from "../link-form/link-form.component";

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [MatButton, MatDialogModule, MatInputModule, MatFormFieldModule, MatChipsModule, MatIconModule,
    ReactiveFormsModule,
    LinkFormComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})

export class ProjectFormComponent {
  projectForm = this.formBuilder.group({
    id: [0],
    name: [''],
    description: [''],
    image: [''],
    imageUrl: [''],
    tags: [new Array<string>]
  });
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly announcer = inject(LiveAnnouncer);
  readonly tagsArr = signal<Array<string>>([])
  readonly linksArr = signal<Array<any>>([])

  constructor(private formBuilder: FormBuilder,
    public projectService: ProjectService) {

    //populate form
    this.projectService.project().id ? this.projectForm.controls.id.setValue(this.projectService.project().id) : undefined;
    this.projectForm.controls.name.setValue(this.projectService.project().name);
    this.projectForm.controls.description.setValue(this.projectService.project().description);
    this.projectForm.controls.image.setValue(this.projectService.project().image);
    this.projectForm.controls.imageUrl.setValue(this.projectService.project().imageUrl);

    // this.projectService.project().links ? this.projectForm.controls.links.setValue(this.projectService.project().links) : this.projectForm.controls.links.setValue([])
    // this.linksArr.set(JSON.parse(this.projectService.project().links));
    // console.log(this.linksArr())

    this.projectService.project().tags ? this.projectForm.controls.tags.setValue(this.projectService.project().tags) : this.projectForm.controls.tags.setValue([])
    this.tagsArr.set(this.projectService.project().tags);
  }

  onSubmit() {
    console.warn(this.projectForm.value);
  }

  add(event: MatChipInputEvent): void {
    const tag = (event.value || '').trim();

    if (tag) {
      this.tagsArr.update(tags => [...tags, tag])
      this.projectForm.patchValue({ tags: this.tagsArr() })
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    this.tagsArr.update(tags => {
      const index = tags.indexOf(tag);
      if (index < 0) {
        return tags;
      }

      tags.splice(index, 1);
      this.announcer.announce(`Removed ${tag}`);
      return [...tags];
    });
  }

  edit(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tag if it no longer has a name
    if (!value) {
      this.remove(tag);
      return;
    }

    // Edit existing tag
    this.tagsArr.update(tags => {
      const index = tags.indexOf(tag);
      if (index >= 0) {
        tags[index] = value;
        return [...tags];
      }
      return tags;
    });
  }
}
