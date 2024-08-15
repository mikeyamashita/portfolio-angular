import { Component, Input } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-link-form',
  standalone: true,
  imports: [MatButton, MatDialogModule, MatInputModule, MatFormFieldModule, MatIconModule,
    FormsModule],
  templateUrl: './link-form.component.html',
  styleUrl: './link-form.component.scss'
})
export class LinkFormComponent {

  @Input() links: Array<any> = [];

  linksForm = this.formBuilder.group({
    name: [''],
    url: ['']
  });

  constructor(private formBuilder: FormBuilder) {
    this.links.forEach((link, i) => {


    })
  }
}
